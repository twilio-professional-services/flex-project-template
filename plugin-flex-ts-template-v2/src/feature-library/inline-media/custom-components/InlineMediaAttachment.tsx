import { useEffect, useState } from 'react';
import { styled } from '@twilio/flex-ui';

interface OwnProps {
  media: any;
  setFocus?: () => void;
}

const InlineImage = styled('img')`
  width: auto;
  max-height: 300px;
  max-width: 350px;
  border-radius: 4px;
`;

const InlinePdf = styled('iframe')`
  min-width: 350px;
  height: 300px;
  border-radius: 4px;
`;

const InlineVideo = styled('video')`
  width: auto;
  max-height: 300px;
  max-width: 350px;
  border-radius: 4px;
`;

const InlineAudio = styled('audio')`
  width: 100%;
  border-radius: 4px;
`;

const InlineMediaAttachment = ({ media, setFocus }: OwnProps) => {
  const [mediaUrl, setMediaUrl] = useState('');

  const fetchMediaUrl = async () => {
    const url = await media.getContentTemporaryUrl();
    setMediaUrl(url);
  };

  useEffect(() => {
    fetchMediaUrl();
  }, [media]);

  const renderImage = () => (
    <a href={mediaUrl} target="_blank">
      <InlineImage src={mediaUrl} alt={media.state.filename ?? 'Image'} />
    </a>
  );

  const renderAudio = () => (
    <InlineAudio controls onMouseEnter={setFocus}>
      <source src={mediaUrl} type={media.state.contentType} />
    </InlineAudio>
  );

  const renderPdf = () => <InlinePdf title={media.state.filename ?? 'PDF Preview'} src={mediaUrl} />;

  const renderVideo = () => (
    <InlineVideo controls onMouseEnter={setFocus}>
      <source src={mediaUrl} type={media.state.contentType} />
    </InlineVideo>
  );

  if (!mediaUrl) {
    return null;
  }

  switch (media.state.contentType) {
    case 'image/jpeg':
    case 'image/png':
      return renderImage();
    case 'audio/mpeg':
    case 'audio/ogg':
    case 'audio/amr':
      return renderAudio();
    case 'application/pdf':
      return renderPdf();
    case 'video/mp4':
      return renderVideo();
    default:
      return null;
  }
};

export default InlineMediaAttachment;
