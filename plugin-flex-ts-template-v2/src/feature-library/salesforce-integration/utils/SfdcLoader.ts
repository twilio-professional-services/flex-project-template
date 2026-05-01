import { getConsole, getOpenCti, getSfdcBaseUrl, isSalesforce } from './SfdcHelper';
import logger from '../../../utils/logger';

export const loadScript = async (url: string) =>
  new Promise((resolve, reject) => {
    const scriptRef = document.createElement('script');
    const tag = document.getElementsByTagName('script')[0];

    const onLoaded = (res: any) => (!res.readyState || res.readyState === 'complete') && resolve(res);

    scriptRef.src = url;
    scriptRef.type = 'text/javascript';
    scriptRef.async = true;
    scriptRef.onerror = reject;
    scriptRef.onload = onLoaded;
    (scriptRef as any).onreadystatechange = onLoaded;

    tag.parentNode?.insertBefore(scriptRef, tag);
  });

export const initializeSalesforceAPIs = async () => {
  const sfdcBaseUrl = getSfdcBaseUrl();

  if (!isSalesforce(sfdcBaseUrl)) {
    // Continue as usual
    logger.warn(
      '[salesforce-integration] Not initializing Salesforce APIs since this instance has been launched independently.',
    );
    return false;
  }

  // We only need to load Open CTI if another plugin has not done so already
  if (!getOpenCti()) {
    logger.log('[salesforce-integration] Loading Open CTI API...');
    const sfOpenCTIScriptUrl = `${sfdcBaseUrl}/support/api/52.0/lightning/opencti_min.js`;
    await loadScript(sfOpenCTIScriptUrl);
  }

  // We only need to load console APIs if another plugin has not done so already
  if (!getConsole()) {
    logger.log('[salesforce-integration] Loading Console Integration API...');
    const sfConsoleAPIScriptUrl = `${sfdcBaseUrl}/support/console/52.0/integration.js`;
    await loadScript(sfConsoleAPIScriptUrl);
  }

  if (!getOpenCti()) {
    // We care mostly that Open CTI loaded
    logger.error('[salesforce-integration] Salesforce APIs cannot be found');
    return false;
  }

  return true;
};
