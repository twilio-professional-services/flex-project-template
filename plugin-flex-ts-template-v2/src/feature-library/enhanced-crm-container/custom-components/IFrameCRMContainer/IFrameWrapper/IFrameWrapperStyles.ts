import * as Flex from '@twilio/flex-ui';

export const wrapperStyle = {
  margin: "0",
  padding: "0",
  overflow: "hidden",
  height: "100%"
};

export const frameStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  border: "0px"
} as any;

export const IFrameRefreshButtonStyledDiv = Flex.styled('div')`
  border-radius: 50%;
  bottom: 10px;
  box-shadow: rgb(0 0 0 / 30%) 0px 1px 10px;
  position: fixed;
  right: 10px;
  z-index: 9999;
`;
