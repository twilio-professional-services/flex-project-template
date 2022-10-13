import { useUID } from "@twilio-paste/core/dist/uid-library";
import { Button, Box} from "@twilio-paste/core"
import { Modal, ModalHeader, ModalHeading, ModalBody, ModalFooter, ModalFooterActions } from "@twilio-paste/core"
import { SelectAgentToInvite } from "./SelectAgentToInvite";


export const InviteParticipantModal = ({isOpen, handleClose} : any) => {

    const modalHeadingID = useUID();

    // Note the temp hack with two Boxes :)
    // Worksaround this issue: https://github.com/twilio-labs/paste/issues/2630
    // Should be able to remove once next release of Flex is out and uses latest version Paste (Oct-22)
    return (
    <div>
      <Modal ariaLabelledby={modalHeadingID} isOpen={isOpen} onDismiss={handleClose} size="default">
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            Invite a Specific Agent
          </ModalHeading>
        </ModalHeader>
        <ModalBody>

          <SelectAgentToInvite />
            
          <Box paddingTop="space200" paddingBottom="space200"/>
          <Box paddingTop="space200" paddingBottom="space200" />
            
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary">Invite Agent</Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </div>
  );
};
