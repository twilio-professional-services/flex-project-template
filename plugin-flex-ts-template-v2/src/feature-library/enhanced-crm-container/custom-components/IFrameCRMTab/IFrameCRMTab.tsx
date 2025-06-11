import React, { useState, useRef, useEffect } from 'react';
import { IconButton, ITask } from '@twilio/flex-ui';

import { IFrameRefreshButtonStyledDiv } from './IFrameCRMTab.Styles';
import { getUrl, displayUrlWhenNoTasks } from '../../config';
import { replaceStringAttributes } from '../../../../utils/helpers';

export interface Props {
  task: ITask;
}

export const IFrameCRMTab = ({ task }: Props) => {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const [iFrameKey, setIframeKey] = useState(0 as number);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Remove any global event listeners that might interfere with Ctrl+C
    // Debug the types and values of our URL functions
    console.log("URL Function Types:", {
      getUrlType: typeof getUrl,
      displayUrlWhenNoTasksType: typeof displayUrlWhenNoTasks
    });
    
    // Get the appropriate URL based on whether we have a task or not
    const templateUrl = task ? getUrl() : displayUrlWhenNoTasks();
    
    // Replace template variables with actual values from task attributes
    // Only pass the task if we have one
    const processedUrl = task 
      ? replaceStringAttributes(templateUrl, task)
      : replaceStringAttributes(templateUrl);
    
    // For debugging
    console.log("CRM URL Debug:", { 
      hasTask: !!task, 
      templateUrl, 
      processedUrl,
      rawConfig: {
        getUrl: getUrl(),
        displayUrlWhenNoTasks: displayUrlWhenNoTasks()
      }
    });
    
    // Set the URL state
    setCurrentUrl(processedUrl);
    
    // No cleanup needed for this effect
  }, [task]);

  const handleOnClick = () => {
    setIframeKey(Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER + 1)));
  };

  return (
    <>
      <IFrameRefreshButtonStyledDiv onClick={handleOnClick}>
        <IconButton variant="primary" icon="Loading" />
      </IFrameRefreshButtonStyledDiv>
      <iframe key={iFrameKey} src={currentUrl} ref={iFrameRef} />
    </>
  );
};
