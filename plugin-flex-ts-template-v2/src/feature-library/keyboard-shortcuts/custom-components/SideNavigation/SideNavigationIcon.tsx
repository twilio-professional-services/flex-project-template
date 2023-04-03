import { SideLink, Actions } from '@twilio/flex-ui';
import { useEffect } from 'react';
import { BsKeyboard, BsKeyboardFill } from 'react-icons/bs';
import { getCustomShortcuts } from '../../utils/KeyboardShortcutsUtil';
import { getDefaultShortcuts } from '../../utils/KeyboardShortcutsUtil';
interface SideNavigationProps {
  activeView?: string;
  viewName: string;
}

const SideNavigationIcon = ({ activeView, viewName }: SideNavigationProps) => {
  const navigateHandler = () => {
    Actions.invokeAction('NavigateToView', {
      viewName: viewName,
    });
  };

  useEffect(() => {
    getDefaultShortcuts();
    getCustomShortcuts();
  }, []);

  return (
    <SideLink
      showLabel={true}
      icon={<BsKeyboard />}
      iconActive={<BsKeyboardFill />}
      onClick={navigateHandler}
      isActive={activeView === viewName}
      key="KeyboardShortcuts"
    >
      Keyboard Shortcuts
    </SideLink>
  );
};

export default SideNavigationIcon;
