import { createLogger, transports, format } from 'winston';

const alignColorsAndTime = format.combine(
  format.colorize({
    all: true,
  }),
  format.label({
    label: '[Flex Project Template]',
  }),
  format.printf((info) => `${info.label} ${info.level} : ${info.message}`),
);

const logger = createLogger({
  level: 'debug',
  defaultMeta: { service: 'twilio:flex-ui' },
  transports: [
    new transports.Console({
      format: alignColorsAndTime,
    }),
  ],
});

export default logger;
