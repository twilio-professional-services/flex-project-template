import { createLogger, transports, format } from 'winston';

import FlexHelperSingleton from '../flex-helper';

const worker = FlexHelperSingleton.getCurrentWorker();
const logger = createLogger({
  level: 'debug',
  defaultMeta: { service: 'twilio:flex-ui', workerName: worker?.name, workerSid: worker?.sid },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({
          all: true,
        }),
        format.label({
          label: '[Flex Project Template]',
        }),
        format.printf((info) => {
          return `${info.label} ${info.level} : ${info.message}`;
        }),
      ),
    }),
  ],
});

export default logger;
