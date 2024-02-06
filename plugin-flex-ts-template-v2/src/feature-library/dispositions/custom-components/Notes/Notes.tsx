import { ITask, Template, templates } from '@twilio/flex-ui';
import { TextArea } from '@twilio-paste/core/textarea';
import { Label } from '@twilio-paste/core/label';
import { HelpText } from '@twilio-paste/core/help-text';

import { StringTemplates } from '../../flex-hooks/strings';

export interface OwnProps {
  task?: ITask;
  notes: string;
  saveNotes: (notes: string) => void;
}

const Notes = ({ task, notes, saveNotes }: OwnProps) => {
  const NOTES_MAX_LENGTH = 100;

  const handleChange = (value: string) => {
    saveNotes(value);
  };

  return (
    <>
      <Label htmlFor="notes">
        <Template source={templates[StringTemplates.NotesTitle]} />
      </Label>
      <TextArea
        onChange={(e) => handleChange(e.target.value)}
        aria-describedby="notes_help_text"
        id={`${task?.sid}-notes`}
        name={`${task?.sid}-notes`}
        value={notes}
        maxLength={NOTES_MAX_LENGTH}
      />
      <HelpText id="notes_help_text">
        <Template
          source={templates[StringTemplates.NotesCharactersRemaining]}
          characters={NOTES_MAX_LENGTH - notes.length}
        />
      </HelpText>
    </>
  );
};

export default Notes;
