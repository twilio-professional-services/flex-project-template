import React from 'react';

import { Separator } from '@twilio-paste/core/separator';
import { Text } from '@twilio-paste/text';
import { Box } from '@twilio-paste/core/box';

import Response from '../Response';
import { CannedResponse } from 'feature-library/canned-responses/types/CannedResponses';

interface CategoryProps {
  section: string;
  responses: CannedResponse[];
}

const Category: React.FunctionComponent<CategoryProps> = ({ section, responses }) => {
  return (
    <Box as="div" backgroundColor="colorBackgroundBody" padding="space60" borderRadius="borderRadius30">
      <Text as="h2" color="colorText" fontWeight="fontWeightSemibold" fontSize="fontSize60">
        {section}
      </Text>
      <Separator orientation="horizontal" verticalSpacing="space40" />
      {responses.map((q) => {
        return <Response key={q.text} label={q.label} text={q.text} />;
      })}
    </Box>
  );
};

export default Category;
