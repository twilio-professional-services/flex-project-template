import { useTabState } from '@twilio-paste/core/tabs';
import { useEffect, useRef } from 'react';

const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const useDesignerTabState = () => {
  const tab = useTabState();
  return {
    ...tab,
    baseId: 'designer-tab',
  };
};

export { usePrevious, useDesignerTabState };
