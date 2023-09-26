import { useDemoConfigs } from '../viewModel/useDemoConfigs';
import { webchatUrl } from '../config';
import { useAuth } from 'oidc-react';

export const Webchat = () => {
  const auth = useAuth();
  const personaName = auth?.userData?.profile?.persona_name;
  const personaEmail = auth?.userData?.profile.email;

  const wchatUrlObject = new URL(webchatUrl);
  wchatUrlObject.searchParams.set('name', personaName);
  wchatUrlObject.searchParams.set('email', personaEmail);

  const style = {
    position: "fixed",
    bottom: 30,
    right: 30,
    zIndex: 3,
    height: 666,
    width: 360,
  };

  return (
    <>
      <iframe src={wchatUrlObject.href} frameBorder="0" style={style}></iframe>
    </>
  );
};
