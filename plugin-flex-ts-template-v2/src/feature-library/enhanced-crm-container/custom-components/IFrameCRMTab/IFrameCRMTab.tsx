import EventEmitter from 'events';

import React, { useEffect, useState, useRef } from 'react';
import { ITask } from '@twilio/flex-ui';

import { getUrl, displayUrlWhenNoTasks } from '../../config';
import { replaceStringAttributes } from '../../../../utils/helpers';

export interface Props {
  task: ITask;
  reloadEmitter: EventEmitter;
}

export const IFrameCRMTab = ({ task, reloadEmitter }: Props) => {
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const [iFrameKey, setIframeKey] = useState(0 as number);

  useEffect(() => {
    reloadEmitter.on('reload', handleOnClick);

    return () => {
      reloadEmitter.off('reload', handleOnClick);
    };
  }, []);

  const handleOnClick = () => {
    setIframeKey(Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER + 1)));
  };

  const url = replaceStringAttributes(task ? getUrl() : displayUrlWhenNoTasks(), task);

  return <iframe key={iFrameKey} src={url} ref={iFrameRef} />;
};
