import React, { useCallback, useMemo, useState } from 'react';
import { Manager, Notifications } from '@twilio/flex-ui';
import { Alert } from '@twilio-paste/core/alert';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Heading } from '@twilio-paste/core/heading';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';

import { StringTemplates } from '../../flex-hooks/strings/MassWorkerUpdate';
import { NotificationIds } from '../../flex-hooks/notifications/MassWorkerUpdate';
import { getBatchSize, getSyncDocName, getMaxWorkersPerRun } from '../../config';
import { useMassUpdateState } from '../../hooks/useMassUpdateState';
import MassWorkerUpdateService from '../../utils/MassWorkerUpdateService';
import { AddSkillMutation, TargetSelection, WorkerRow } from '../../types/mass-worker-update';
import TargetSelector from '../TargetSelector/TargetSelector';
import WorkerPreviewTable from '../WorkerPreviewTable/WorkerPreviewTable';
import SkillMutationPicker from '../SkillMutationPicker/SkillMutationPicker';
import ProgressLockModal from '../ProgressLockModal/ProgressLockModal';
import { MassWorkerUpdateWrapper, SectionHeader } from './MassWorkerUpdateView.styles';

const format = (template: string, values: Record<string, string | number>): string =>
  Object.keys(values).reduce(
    (acc, key) => acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(values[key])),
    template,
  );

const MassWorkerUpdateView: React.FC = () => {
  const strings = Manager.getInstance().strings as any;
  const syncDocName = getSyncDocName();
  const maxWorkersPerRun = getMaxWorkersPerRun();

  const [selection, setSelection] = useState<TargetSelection>({});
  const [preview, setPreview] = useState<WorkerRow[] | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identifyError, setIdentifyError] = useState<string | null>(null);
  const [addSkills, setAddSkills] = useState<AddSkillMutation[]>([]);
  const [removeSkills, setRemoveSkills] = useState<string[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const { state, isStale, cancel } = useMassUpdateState();

  const hasAnyFilter = Boolean(selection.team || selection.department || selection.skill);
  const hasAnyMutation = addSkills.length > 0 || removeSkills.length > 0;
  const previewCount = preview?.length ?? 0;
  const overLimit = previewCount > maxWorkersPerRun;

  const canIdentify = hasAnyFilter && !isIdentifying && !state.inProgress;
  const canConfirm =
    hasAnyFilter && hasAnyMutation && previewCount > 0 && !overLimit && !state.inProgress && !isExecuting;

  const identify = useCallback(async () => {
    setIsIdentifying(true);
    setIdentifyError(null);
    setPreview(null);
    try {
      const result = await MassWorkerUpdateService.identifyWorkers(selection);
      if (!result || !result.success) {
        setIdentifyError(result?.error ?? strings[StringTemplates.ERROR_IDENTIFY]);
        Notifications.showNotification(NotificationIds.IDENTIFY_FAILED);
        return;
      }
      setPreview(result.workers);
    } finally {
      setIsIdentifying(false);
    }
  }, [selection, strings]);

  const execute = useCallback(async () => {
    setIsExecuting(true);
    setIsConfirmOpen(false);
    try {
      const result = await MassWorkerUpdateService.executeUpdate(
        { ...selection, addSkills, removeSkills },
        syncDocName,
        getBatchSize(),
      );
      if (!result || !result.success) {
        if (result?.cancelled) {
          Notifications.showNotification(NotificationIds.CANCELLED);
        } else {
          Notifications.showNotification(NotificationIds.EXECUTE_FAILED);
        }
        return;
      }
      Notifications.showNotification(NotificationIds.SUCCESS, { processed: result.processed });
      // Reset local UI state — the run is done.
      setPreview(null);
      setAddSkills([]);
      setRemoveSkills([]);
    } finally {
      setIsExecuting(false);
    }
  }, [selection, addSkills, removeSkills, syncDocName]);

  const handleCancel = useCallback(async () => {
    setIsCancelling(true);
    try {
      await cancel();
    } finally {
      setIsCancelling(false);
    }
  }, [cancel]);

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    try {
      const ok = await MassWorkerUpdateService.resetState(syncDocName);
      if (!ok) Notifications.showNotification(NotificationIds.RESET_FAILED);
    } finally {
      setIsResetting(false);
    }
  }, [syncDocName]);

  const confirmDialogText = useMemo(
    () => format(strings[StringTemplates.CONFIRM_DIALOG_TITLE], { count: previewCount }),
    [previewCount, strings],
  );

  const matchCountText = useMemo(
    () => format(strings[StringTemplates.IDENTIFY_MATCH_COUNT], { count: previewCount }),
    [previewCount, strings],
  );

  const overLimitText = useMemo(
    () =>
      format(strings[StringTemplates.IDENTIFY_LIMIT_WARNING], {
        count: previewCount,
        limit: maxWorkersPerRun,
      }),
    [previewCount, maxWorkersPerRun, strings],
  );

  return (
    <MassWorkerUpdateWrapper>
      <SectionHeader>
        <Heading as="h1" variant="heading10">
          {strings[StringTemplates.TITLE]}
        </Heading>
      </SectionHeader>

      <Alert variant="warning">
        <Text as="p">
          <strong>KNOWN LIMITATIONS</strong>
        </Text>
        <Text as="p">
          - Updates larger than <strong>{maxWorkersPerRun}</strong> workers are blocked client-side. You can update this
          limit in the admin panel.
        </Text>
        <Text as="p">
          - If the batch size is too large you may see failures, try lowering the batch size in the admin panel. There
          is a hard limit on the batch size of 25, even if it has been configured to a higher value.
        </Text>
      </Alert>

      <Box>
        <Heading as="h2" variant="heading20">
          {strings[StringTemplates.SECTION_IDENTIFY]}
        </Heading>
        <Text as="p">{strings[StringTemplates.SECTION_IDENTIFY_TEXT]}</Text>
        <Box paddingY="space50">
          <TargetSelector selection={selection} onChange={setSelection} disabled={state.inProgress} />
        </Box>
        <Stack orientation="horizontal" spacing="space40">
          <Button variant="primary" onClick={identify} disabled={!canIdentify} loading={isIdentifying}>
            {strings[StringTemplates.IDENTIFY_BUTTON]}
          </Button>
          {preview && (
            <Text as="span" color={overLimit ? 'colorTextError' : 'colorText'}>
              {matchCountText}
            </Text>
          )}
        </Stack>
        {identifyError && (
          <Box paddingTop="space40">
            <Alert variant="error">
              <Text as="p">{identifyError}</Text>
            </Alert>
          </Box>
        )}
        {preview && overLimit && (
          <Box paddingTop="space40">
            <Alert variant="error">
              <Text as="p">{overLimitText}</Text>
            </Alert>
          </Box>
        )}
        {preview && (
          <Box paddingTop="space40">
            <WorkerPreviewTable workers={preview} />
          </Box>
        )}
      </Box>

      <Box opacity={preview && !overLimit ? 1 : 0.5}>
        <Heading as="h2" variant="heading20">
          {strings[StringTemplates.SECTION_MUTATE]}
        </Heading>
        <Text as="p">{strings[StringTemplates.SECTION_MUTATE_TEXT]}</Text>
        <Box paddingY="space50">
          <SkillMutationPicker
            addSkills={addSkills}
            removeSkills={removeSkills}
            disabled={!preview || overLimit || state.inProgress}
            onChange={({ addSkills: nextAdd, removeSkills: nextRemove }) => {
              setAddSkills(nextAdd);
              setRemoveSkills(nextRemove);
            }}
          />
        </Box>
        <Button variant="primary" onClick={() => setIsConfirmOpen(true)} disabled={!canConfirm} loading={isExecuting}>
          {strings[StringTemplates.CONFIRM_BUTTON]}
        </Button>
      </Box>

      <Modal
        isOpen={isConfirmOpen}
        onDismiss={() => setIsConfirmOpen(false)}
        ariaLabelledby="mwu-confirm-heading"
        size="default"
      >
        <ModalHeader>
          <ModalHeading as="h3" id="mwu-confirm-heading">
            {confirmDialogText}
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Text as="p">{strings[StringTemplates.CONFIRM_DIALOG_TEXT]}</Text>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              {strings[StringTemplates.CONFIRM_NO]}
            </Button>
            <Button variant="primary" onClick={execute}>
              {strings[StringTemplates.CONFIRM_YES]}
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>

      {state.inProgress && (
        <ProgressLockModal
          state={state}
          isStale={isStale}
          isCancelling={isCancelling}
          isResetting={isResetting}
          onCancel={handleCancel}
          onReset={handleReset}
        />
      )}
    </MassWorkerUpdateWrapper>
  );
};

export default MassWorkerUpdateView;
