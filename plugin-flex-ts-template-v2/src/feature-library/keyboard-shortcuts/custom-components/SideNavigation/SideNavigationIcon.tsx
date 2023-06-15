import { SideLink, Actions, Template, templates } from '@twilio/flex-ui';
import { useEffect } from 'react';

import { StringTemplates } from '../../flex-hooks/strings';
import { KeyboardIcon, KeyboardIconFilled } from '../../../../icons/Keyboard';
import { getCustomShortcuts, getDefaultShortcuts } from '../../utils/KeyboardShortcutsUtil';

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

  useEffect(() => {
    getDefaultShortcuts();
    getCustomShortcuts();
  }, []);

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
