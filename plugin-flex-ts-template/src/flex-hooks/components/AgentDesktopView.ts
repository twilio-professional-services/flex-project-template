import * as Flex from '@twilio/flex-ui';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  setDefaultProps(flex);
}

function setDefaultProps(flex: typeof Flex) {
  flex.AgentDesktopView.defaultProps.splitterOptions = {
    initialFirstPanelSize: '276px'
  };
}
