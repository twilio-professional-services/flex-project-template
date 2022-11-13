import React, { Component } from "react";
import IFrameWrapper from "./IFrameWrapper";
import { ContainerProps } from './IFrameCRMContainer'

export interface OwnProps {
  baseUrl: string
}

export type Props = ContainerProps & OwnProps;

export default class IFrameCRMComponent extends Component<Props> {


  render() {
    let { tasks, baseUrl } = this.props;

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
}


