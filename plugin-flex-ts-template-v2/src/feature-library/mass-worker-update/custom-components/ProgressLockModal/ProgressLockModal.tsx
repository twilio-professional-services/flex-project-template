import React from 'react';
import { Manager } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';
import { Spinner } from '@twilio-paste/core/spinner';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';

import { StringTemplates } from '../../flex-hooks/strings/MassWorkerUpdate';
import { MassUpdateState } from '../../types/mass-worker-update';

interface Props {
  state: MassUpdateState;
  isStale: boolean;
  isCancelling: boolean;
  isResetting: boolean;
  onCancel: () => void;
  onReset: () => void;
}

const format = (template: string, values: Record<string, string | number>): string => {
  return Object.keys(values).reduce(
    (acc, key) => acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(values[key])),
    template,
  );
};

const ProgressLockModal: React.FC<Props> = ({ state, isStale, isCancelling, isResetting, onCancel, onReset }) => {
  const strings = Manager.getInstance().strings as any;
  const modalHeadingId = 'mwu-progress-modal-heading';

  const heading = isStale ? strings[StringTemplates.STALE_TITLE] : strings[StringTemplates.PROGRESS_TITLE];
  const body = isStale
    ? strings[StringTemplates.STALE_TEXT]
    : format(strings[StringTemplates.PROGRESS_TEXT], {
        processed: state.processed,
        total: state.total,
      });
  // Prefer the initiator's `full_name` (looked up server-side from the worker
  // record). Fall back to the raw SID with a small note when the name lookup
  // failed or the attribute wasn't present.
  let startedBy = '';
  if (state.startedByName) {
    startedBy = format(strings[StringTemplates.PROGRESS_STARTED_BY], { startedBy: state.startedByName });
  } else if (state.startedBy) {
    startedBy = format(strings[StringTemplates.PROGRESS_STARTED_BY_UNKNOWN_NAME], {
      startedBy: state.startedBy,
    });
  }

  // Empty handler on Modal onDismiss — the modal is a hard lock on this screen
  // by design. Users can navigate away via the SideNav, which unmounts the
  // whole view and its modal alongside.
  return (
    <Modal isOpen ariaLabelledby={modalHeadingId} onDismiss={() => undefined} size="default">
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingId}>
          {heading}
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        <Stack orientation="vertical" spacing="space40">
          {!isStale && (
            <Box display="flex" justifyContent="center">
              <Spinner decorative={false} title="Mass worker update in progress" size="sizeIcon80" />
            </Box>
          )}
          <Text as="p">{body}</Text>
          {startedBy && (
            <Text as="p" color="colorTextWeak">
              {startedBy}
            </Text>
          )}
        </Stack>
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          {isStale ? (
            <Button variant="destructive" onClick={onReset} loading={isResetting}>
              {strings[StringTemplates.RESET_BUTTON]}
            </Button>
          ) : (
            <Button
              variant="destructive_secondary"
              onClick={onCancel}
              loading={isCancelling}
              disabled={state.cancelled}
            >
              {strings[StringTemplates.CANCEL_BUTTON]}
            </Button>
          )}
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default ProgressLockModal;
