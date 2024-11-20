import { Button } from '@twilio-paste/core/button';
import { ButtonGroup } from '@twilio-paste/core/button-group';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';
import { DeleteIcon } from '@twilio-paste/icons/esm/DeleteIcon';
import { FC } from 'react';

export interface EditButtonGroupProps {
  canAddNew: boolean;
  canDelete: boolean;
  isEditing: boolean;
  handleAddPress: () => void;
  handleEditPress: () => void;
  handleDeletePress: () => void;
}

const EditButtonGroup: FC<EditButtonGroupProps> = (props) => {
  return (
    <>
      <ButtonGroup attached>
        <Button variant="secondary" disabled={!props.canAddNew} onClick={props.handleAddPress}>
          <PlusIcon decorative />
          Add question
        </Button>
        <Button variant="secondary" disabled={props.isEditing} onClick={props.handleEditPress}>
          <EditIcon decorative />
          Edit
        </Button>

        <Button variant="destructive_secondary" disabled={!props.canDelete} onClick={props.handleDeletePress}>
          <DeleteIcon decorative />
          Delete
        </Button>
      </ButtonGroup>
    </>
  );
};

export default EditButtonGroup;
