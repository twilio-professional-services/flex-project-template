import React, { Component } from "react";
import IFrameWrapper from "./IFrameWrapper";
import { useFlexSelector } from "@twilio/flex-ui";
import { AppState } from '../../../../flex-hooks/states';

type IFrameCRMComponentProps = {
  baseUrl: string
}

export const IFrameCRMComponent = ({baseUrl}: IFrameCRMComponentProps) => {

  const tasks = useFlexSelector((state: AppState) => state.flex.worker.tasks);

  // Only render iframes for tasks without a parent task
  const tasksFiltered = Array.from(tasks.values()).filter(task => !task.attributes.parentTask);

  return (
    <div>
      {tasksFiltered.map(task => (
        <IFrameWrapper thisTask={task} key={task.taskSid} baseUrl={baseUrl} />
      ))}
    </div>
  );
}


