import { styled, css } from '@twilio-paste/styling-library';

interface KeyCommandProps {
  keyCommand: string;
}

const KeyCommand = ({ keyCommand }: KeyCommandProps) => {
  const KeyCommandSpan = styled.span(
    css({
      backgroundColor: '#edf2f7',
      paddingLeft: 'space20',
      paddingRight: 'space20',
      paddingTop: 'space10',
      paddingBottom: 'space10',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '0.8rem',
      fontFamily: 'TwilioSansMono, Courier, monospace',
      border: '2px solid #e4e4e4',
      boxShadow: '2px 2px 2px #e4e4e4',
    })
  );

  return <KeyCommandSpan>{keyCommand}</KeyCommandSpan>;
};

export default KeyCommand;
