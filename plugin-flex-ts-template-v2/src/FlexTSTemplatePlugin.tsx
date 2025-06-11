import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import React from 'react';

const PLUGIN_NAME = 'FlexTSTemplatePlugin';

// Define interface for TaskAttributesDebug props
interface TaskAttributesDebugProps {
  task?: Flex.ITask;
  taskSid?: string;
}

// Debug component to show task attributes
const TaskAttributesDebug: React.FC<TaskAttributesDebugProps> = (props) => {
  const task = props.task || (props.taskSid ? Flex.TaskHelper.getTaskByTaskSid(props.taskSid) : null);
  
  if (!task) return null;
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.8)', 
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      fontSize: '12px'
    }}>
      <h3>Task Attributes Debug</h3>
      <pre>{JSON.stringify(task.attributes, null, 2)}</pre>
    </div>
  );
};

export default class FlexTSTemplatePlugin extends FlexPlugin {
  public constructor() {
    super(PLUGIN_NAME);
  }

  init(flex: typeof Flex, manager: Flex.Manager) {
    // Log environment info
    console.log('Flex environment:', {
      accountSid: manager.serviceConfiguration.account_sid,
      flexServiceInstance: manager.serviceConfiguration.flex_service_instance_sid,
      workerSid: manager.workerClient?.sid,
      isLocalhost: window.location.hostname === 'localhost'
    });

    // Add debug panel to TaskCanvas
    flex.TaskCanvas.Content.add(
      <TaskAttributesDebug key="task-attributes-debug" />,
      { sortOrder: 1000 }
    );

    // Log all tasks when they arrive - safely check for workerClient
    if (manager.workerClient) {
      manager.workerClient.on("reservationCreated", (reservation) => {
        console.log("New reservation created:", reservation.sid);
        console.log("Task attributes:", JSON.stringify(reservation.task.attributes, null, 2));
      });
    }

    // Customize the Call channel templates
    const callChannel = flex.DefaultTaskChannels.Call;
    
    // Override the templates for the Call channel
    callChannel.templates = {
      ...callChannel.templates,
      TaskListItem: {
        ...callChannel.templates?.TaskListItem,
        firstLine: (task: Flex.ITask) => {
          const attributes = task.attributes || {};
          const firstName = attributes.first_name || attributes.firstname || '';
          const lastName = attributes.last_name || attributes.lastname || '';
          const callerName = attributes.caller_name || '';
          
          if (firstName || lastName) {
            return [firstName, lastName].filter(Boolean).join(' ');
          } else if (callerName) {
            return callerName;
          } else if (attributes.from) {
            return `Caller: ${attributes.from}`;
          } else {
            return task.defaultFrom || 'Unknown Caller';
          }
        },
        secondLine: (task: Flex.ITask) => {
          const attributes = task.attributes || {};
          const parts = [];
          
          if (attributes.direction) parts.push(`${attributes.direction}`);
          if (attributes.from) parts.push(`From: ${attributes.from}`);
          if (attributes.call_sid) {
            const shortCallSid = attributes.call_sid.substring(0, 8) + '...';
            parts.push(`Call: ${shortCallSid}`);
          }
          
          return parts.length > 0 ? parts.join(' | ') : task.queueName;
        }
      },
      // Also update the TaskCanvasHeader to show the same information
      TaskCanvasHeader: {
        ...callChannel.templates?.TaskCanvasHeader,
        title: (task: Flex.ITask) => {
          const attributes = task.attributes || {};
          const firstName = attributes.first_name || attributes.firstname || '';
          const lastName = attributes.last_name || attributes.lastname || '';
          const callerName = attributes.caller_name || '';
          
          if (firstName || lastName) {
            return [firstName, lastName].filter(Boolean).join(' ');
          } else if (callerName) {
            return callerName;
          } else if (attributes.from) {
            return `Caller: ${attributes.from}`;
          } else {
            return task.defaultFrom || 'Unknown Caller';
          }
        }
      }
    };
  }
}
