import InlineMediaAttachment from './InlineMediaAttachment';

interface OwnProps {
  message?: any;
  updateFocus?: (newFocus: number, isMessageBubbleClicked?: boolean) => void;
}
const InlineMedia = ({ message, updateFocus }: OwnProps) => {
  const setFocus = () => {
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
