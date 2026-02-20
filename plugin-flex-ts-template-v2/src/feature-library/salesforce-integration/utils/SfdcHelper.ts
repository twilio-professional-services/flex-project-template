const getSforce = () => (window as any).sforce;

export const getConsole = () => getSforce()?.console;

export const getOpenCti = () => getSforce()?.opencti;

export const getSfdcBaseUrl = () => {
  try {
    return window.location.ancestorOrigins[0];
  } catch {
    // ancestorOrigins is not a web standard; handle non-chromium browsers here
    return '';
  }
};

export const isSalesforce = (baseUrl: string) =>
  Boolean(baseUrl) && window.self !== window.top && baseUrl.includes('.lightning.force.com');
