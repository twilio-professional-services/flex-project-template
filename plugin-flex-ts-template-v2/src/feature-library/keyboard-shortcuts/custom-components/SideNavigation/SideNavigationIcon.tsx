import { SideLink, Actions, Template, templates } from '@twilio/flex-ui';

import { StringTemplates } from '../../flex-hooks/strings';
import { KeyboardIcon, KeyboardIconFilled } from '../../../../icons/Keyboard';

interface SideNavigationProps {
  activeView?: string;
  viewName: string;
}

const SideNavigationIcon = ({ activeView, viewName }: SideNavigationProps) => {
  const navigateHandler = () => {
    Actions.invokeAction('NavigateToView', {
      viewName,
    });
  };

  return (
    <SideLink
      showLabel={true}
      icon={<KeyboardIcon />}
      iconActive={<KeyboardIconFilled />}
      onClick={navigateHandler}
      isActive={activeView === viewName}
      key="KeyboardShortcuts"
    >
      <Template source={templates[StringTemplates.SideNaveTitle]} />
    </SideLink>
  );
};

export default SideNavigationIcon;
