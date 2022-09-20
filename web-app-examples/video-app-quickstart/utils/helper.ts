/*
  Track-related helper functions
*/

// Attach the Local Tracks to the DOM.
export function attachLocalTracks(tracks: any, divId: string) {
  tracks.forEach(function (track: any) {
    if (track.track) track = track.track;
    let trackDom = track.attach();
    trackDom.style.maxWidth = "100%";
    trackDom.style["height"] = "100%";
    //trackDom.style["max-height"] = "100%";
    document.getElementById(divId)?.appendChild(trackDom);
  });
}

// Attach the Remote Tracks to the DOM.
export function attachRemoteTracks(tracks: any, divId: string) {
  tracks.forEach(function (track: any) {
    if (track.track) track = track.track;
    if (!track.attach) return;
    let trackDom = track.attach();
    trackDom.style.width = "100%";
    //trackDom.style["max-height"] = "100%";
    //trackDom.style["height"] = "200px";
    trackDom.style["height"] = "100%";
    document.getElementById(divId)?.appendChild(trackDom);
  });
}

// Detach tracks from the DOM.
export function detachTracks(tracks: any) {
  tracks.forEach(function (track: any) {
    if (track.track) track = track.track;
    if (!track.detach) return;
    track.detach().forEach(function (detachedElement: any) {
      detachedElement.remove();
    });
  });
}
