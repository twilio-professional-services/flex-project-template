import React from 'react';
import { Manager } from '@twilio/flex-ui';
import { Box } from '@twilio-paste/core/box';
import { Table, TBody, THead, Td, Th, Tr } from '@twilio-paste/core/table';
import { Text } from '@twilio-paste/core/text';

import { StringTemplates } from '../../flex-hooks/strings/MassWorkerUpdate';
import { WorkerRow } from '../../types/mass-worker-update';

interface Props {
  workers: WorkerRow[];
}

const WorkerPreviewTable: React.FC<Props> = ({ workers }) => {
  const strings = Manager.getInstance().strings as any;

  if (workers.length === 0) {
    return (
      <Box paddingY="space40">
        <Text as="p">{strings[StringTemplates.IDENTIFY_EMPTY]}</Text>
      </Box>
    );
  }

  return (
    <Box maxHeight="320px" overflow="auto" borderStyle="solid" borderColor="colorBorder" borderWidth="borderWidth10">
      <Table>
        <THead>
          <Tr>
            <Th>{strings[StringTemplates.COLUMN_NAME]}</Th>
            <Th>{strings[StringTemplates.COLUMN_SID]}</Th>
            <Th>{strings[StringTemplates.COLUMN_TEAM]}</Th>
            <Th>{strings[StringTemplates.COLUMN_DEPARTMENT]}</Th>
            <Th>{strings[StringTemplates.COLUMN_SKILLS]}</Th>
          </Tr>
        </THead>
        <TBody>
          {workers.map((worker) => (
            <Tr key={worker.sid}>
              <Td>{worker.friendlyName}</Td>
              <Td>
                <Text as="span" fontFamily="fontFamilyCode" fontSize="fontSize20">
                  {worker.sid}
                </Text>
              </Td>
              <Td>{worker.teamName || '—'}</Td>
              <Td>{worker.departmentName || '—'}</Td>
              <Td>{worker.skills.length ? worker.skills.join(', ') : '—'}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </Box>
  );
};

export default WorkerPreviewTable;
