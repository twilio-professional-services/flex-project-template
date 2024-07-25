import InlineMediaAttachment from './InlineMediaAttachment';
import { validateUiVersion } from '../../../utils/configuration';

interface OwnProps {
  message?: any;
  updateFocus?: (newFocus: number, isMessageBubbleClicked?: boolean) => void;
}
const InlineMedia = ({ message, updateFocus }: OwnProps) => {
  const setFocus = () => {
    try {
      // The focus workaround is no longer needed as of Flex UI 2.7.1
      if (!validateUiVersion('>=2.7.1')) {
        return;
      }
    } catch {}
    if (updateFocus) {
      updateFocus(message.index, true);
    }
  };

  return (
    message.source.attachedMedia?.map((media: any) => {
      return <InlineMediaAttachment media={media} key={media.state.sid} setFocus={setFocus} />;
    }) ?? null
  );
};

export default InlineMedia;
