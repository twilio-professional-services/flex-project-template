import * as Flex from '@twilio/flex-ui';

import { injectGlobal } from 'react-emotion';
import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().configuration as UIAttributes;
const { enabled } = custom_data.features.scrollable_activities;

export default () => {
  if( !enabled ) return;
  injectGlobal`
    .Twilio-Menu.Twilio-UserControls-AccountMenu {
      overflow-y: scroll;
      max-height: 90vh;
    }
  `;
};

