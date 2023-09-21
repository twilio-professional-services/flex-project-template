import { SkeletonLoader, TBody, Td, Tr } from '@twilio-paste/core';
import { templates } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings';

interface ParkViewTableBodyWrapperProps {
  children: JSX.Element;
  isLoading: boolean;
  isEmpty: boolean;
}

const ParkViewTableBodyWrapper = (props: ParkViewTableBodyWrapperProps) => {
  if (props.isLoading) {
    return (
      <TBody>
        {[...Array(3)].map((_, rowIndex: number) => (
          <Tr key={`row-${rowIndex}`}>
            <Td>
              <SkeletonLoader width="35%" />
            </Td>
            <Td>
              <SkeletonLoader width="50%" />
            </Td>
            <Td>
              <SkeletonLoader width="50%" />
            </Td>
            <Td>
              <SkeletonLoader width="35%" />
            </Td>
            <Td>
              <SkeletonLoader width="20%" />
            </Td>
          </Tr>
        ))}
      </TBody>
    );
  }

  if (props.isEmpty) {
    return (
      <TBody>
        <Tr>
          <Td textAlign="center" colSpan={5}>
            {templates[StringTemplates.NoItemsToList]()}
          </Td>
        </Tr>
      </TBody>
    );
  }

  return props.children;
};

export default ParkViewTableBodyWrapper;
