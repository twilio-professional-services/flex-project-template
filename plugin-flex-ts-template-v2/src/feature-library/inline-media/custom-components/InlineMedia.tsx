import { VERSION } from '@twilio/flex-ui';

import InlineMediaAttachment from './InlineMediaAttachment';

interface OwnProps {
  message?: any;
  updateFocus?: (newFocus: number, isMessageBubbleClicked?: boolean) => void;
}
const InlineMedia = ({ message, updateFocus }: OwnProps) => {
  const setFocus = () => {
    try {
      // The focus workaround is no longer needed as of Flex UI 2.7.1
      const versionNum = Number(VERSION?.replaceAll('.', ''));
      if (!isNaN(versionNum) && versionNum >= 271) {
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
