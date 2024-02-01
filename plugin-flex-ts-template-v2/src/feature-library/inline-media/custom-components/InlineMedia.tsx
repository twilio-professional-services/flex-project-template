import InlineMediaAttachment from './InlineMediaAttachment';

interface OwnProps {
  message?: any;
}
const InlineMedia = ({ message }: OwnProps) => {
  return (
    message.source.attachedMedia?.map((media: any) => {
      return <InlineMediaAttachment media={media} key={media.state.sid} />;
    }) ?? null
  );
};

export default InlineMedia;
