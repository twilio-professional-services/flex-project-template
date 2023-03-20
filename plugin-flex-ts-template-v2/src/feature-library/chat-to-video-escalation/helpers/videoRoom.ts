/*
  Track-related helper functions
*/

// Attach the Local Tracks to the DOM.
export const attachLocalTracks = (tracks: any, divId: string) => {
  tracks.forEach((track: any) => {
    if (track.track) track = track.track;
    const trackDom = track.attach();
    trackDom.style.maxWidth = '100%';
    trackDom.style.height = '200px';
    document.getElementById(divId)?.appendChild(trackDom);
  });
};

// Attach the Remote Tracks to the DOM.
export const attachRemoteTracks = (tracks: any, divId: string) => {
  tracks.forEach((track: any) => {
    if (track.track) track = track.track;
    if (!track.attach) return;
    const trackDom = track.attach();
    trackDom.style.width = '100%';
    trackDom.style['max-height'] = '100%';
    document.getElementById(divId)?.appendChild(trackDom);
  });
};

// Detach tracks from the DOM.
export const detachTracks = (tracks: any) => {
  tracks.forEach((track: any) => {
    if (track.track) track = track.track;
    if (!track.detach) return;
    track.detach().forEach((detachedElement: any) => {
      detachedElement.remove();
    });
  });
};
