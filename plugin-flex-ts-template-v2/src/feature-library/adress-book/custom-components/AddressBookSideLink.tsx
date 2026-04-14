import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';

export interface AddressBookSideLinkProps {
  viewName: string;
  activeView?: string;
}

const AddressBookSideLink: React.FC<AddressBookSideLinkProps> = ({ viewName, activeView }) => {
  const handleNavigate = () => {
    Actions.invokeAction('NavigateToView', { viewName });
  };

  return (
    <SideLink
      showLabel={true}
      icon="OutboundCall"
      iconActive="OutboundCall"
      isActive={activeView === viewName}
      onClick={handleNavigate}
      key="address-book-side-link"
    >
      Address Book
    </SideLink>
  );
};

export default AddressBookSideLink;
