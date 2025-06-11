import * as Flex from '@twilio/flex-ui';
import React from 'react';

import { FlexComponent } from '../../../../types/feature-loader';

// Define the props type for clarity
interface TaskCanvasHeaderProps {
  task: Flex.ITask;
}

// This works for most Flex templates, even with TS
const CustomTaskCanvasHeader: React.FC<TaskCanvasHeaderProps> = ({ task }) => {
  // Log the full task and attributes for debugging
  console.log('CustomTaskCanvasHeader task:', task);
  console.log('CustomTaskCanvasHeader attributes:', task?.attributes);
  
  // Extract name from attributes with fallbacks
  const { attributes } = task || {};
  const name = [
    attributes?.firstname || attributes?.first_name, 
    attributes?.lastname || attributes?.last_name
  ].filter(Boolean).join(' ') || 
    attributes?.from || 
    task?.defaultFrom || 
    'Unknown Caller';
  
  // Show additional useful information
  return (
    <div>
      <strong>{name}</strong>
      {attributes?.call_sid && <div style={{fontSize: 'smaller'}}>Call: {attributes.call_sid}</div>}
      {attributes?.conference?.sid && <div style={{fontSize: 'smaller'}}>Conference: {attributes.conference.sid}</div>}
    </div>
  );
};

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function customizeTaskCanvasHeader(flex: typeof Flex, _manager: Flex.Manager) {
  console.log('TaskCanvasHeader componentHook executing');
  
  try {
    // Fix: Use the correct TypeScript approach with type casting
    (flex.TaskCanvasHeader.Content as any).replace((props: TaskCanvasHeaderProps) => <CustomTaskCanvasHeader {...props} />);
    console.log('Successfully replaced TaskCanvasHeader.Content');
  } catch (error) {
    console.error('Error replacing TaskCanvasHeader.Content:', error);
  }
};
