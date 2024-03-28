import {
  Button,
  Modal,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
  Spinner,
} from "@twilio-paste/core";
import { useUID } from "@twilio-paste/core/dist/uid-library";
import { FC } from "react";
import React from "react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  isProcessingAction: boolean;
  modalHeader: string;
  modalBody: React.ReactElement;
  actionLabel: string;
  actionIsDestructive: boolean;
  handleConfirmAction: () => void;
  handleCancelAction: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = (props) => {
  // Modal properties
  const modalHeadingID = useUID();

  return (
    <Modal
      ariaLabelledby={modalHeadingID}
      isOpen={props.isOpen}
      onDismiss={props.handleCancelAction}
      size="default"
    >
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingID}>
          {props.modalHeader}
        </ModalHeading>
      </ModalHeader>
      <ModalBody>{props.modalBody}</ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          <Button
            variant="secondary"
            onClick={props.handleCancelAction}
            disabled={props.isProcessingAction}
          >
            Cancel
          </Button>
          <Button
            variant={props.actionIsDestructive ? "destructive" : "primary"}
            onClick={props.handleConfirmAction}
            disabled={props.isProcessingAction}
          >
            {props.isProcessingAction && <Spinner decorative={true} />}
            {props.actionLabel}
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
