import React, { useState, useEffect } from 'react';
import { Box } from '@twilio-paste/core/box';
import { Text } from '@twilio-paste/text';
import { SkeletonLoader } from '@twilio-paste/core/skeleton-loader';
import { Column, Grid } from '@twilio-paste/core/grid';

import Category from './Category';
import CannedResponsesService from '../../../../feature-library/canned-responses/utils/CannedResponsesService';
import { CannedResponseCategories, ResponseCategory } from 'feature-library/canned-responses/types/CannedResponses';
import { ErrorText, TextCopy } from '../../../../feature-library/canned-responses/utils/constants';

const CannedResponsesCRM: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [responseCategories, setResponseCategories] = useState<undefined | CannedResponseCategories>(undefined);

  useEffect(() => {
    async function getResponses() {
      try {
        const responses = await CannedResponsesService.fetchCannedResponses();
        setResponseCategories(responses.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }

    getResponses();
  }, []);

  return (
    <Box as="div" padding="space50">
      <Text as="h1" fontSize="fontSize60" fontWeight="fontWeightSemibold" marginBottom="space40" marginTop="space30">
        {TextCopy.HEADING}
      </Text>
      {isLoading ? (
        <SkeletonLoader />
      ) : !!responseCategories ? (
        <>
          {responseCategories.categories.map((category: ResponseCategory) => (
            <Grid gutter="space30" vertical key={category.section}>
              <Column>
                <Category {...category} />
              </Column>
            </Grid>
          ))}
        </>
      ) : (
        <Text as="p">{ErrorText.LOADING_ERROR}</Text>
      )}
    </Box>
  );
};

export default CannedResponsesCRM;
