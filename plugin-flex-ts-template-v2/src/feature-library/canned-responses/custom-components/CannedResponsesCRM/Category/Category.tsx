import React from 'react';
import { Text } from '@twilio-paste/text';
import { Box } from '@twilio-paste/core/box';
import { CannedResponse } from 'feature-library/canned-responses/types/CannedResponses';
import { Table, THead, Tr, Th, TBody } from '@twilio-paste/table';

import Response from '../Response';

interface CategoryProps {
  section: string;
  responses: CannedResponse[];
}

const Category: React.FunctionComponent<CategoryProps> = ({ section, responses }) => {
  return (
    <Box as="div" backgroundColor="colorBackgroundBody" padding="space40" borderRadius="borderRadius30">
      <Table>
        <THead>
          <Tr>
            <Th>
              <Text as="h4" color="colorText" fontWeight="fontWeightSemibold" fontSize="fontSize40">
                {section}
              </Text>
            </Th>
            <Th></Th>
          </Tr>
        </THead>
        <TBody>
          {responses.map((response: CannedResponse) => {
            return <Response key={response.text} label={response.label} text={response.text} />;
          })}
        </TBody>
      </Table>
    </Box>
  );
};

export default Category;
