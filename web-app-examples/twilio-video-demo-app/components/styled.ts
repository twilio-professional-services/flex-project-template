import { styled, css } from "@twilio-paste/styling-library";

export const VideoContainer = styled.video(
  css({
    width: "100%",
    height: "100%",
  })
);

export const AvatarContainer = styled.div(
  css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  })
);

export const VideoPreviewContainer = styled.div(
  css({
    position: "relative",
    height: 0,
    overflow: "hidden",
    paddingTop: `${(9 / 16) * 100}%`,
    width: "100%",
    borderRadius: "6px",
  })
);

export const InnerPreviewContainer = styled.div(
  css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  })
);

export const CenterContent = styled.div(
  css({
    paddingX: "space40",
    paddingTop: "space160",
    paddingBottom: "space60",
    width: "100%",
    minHeight: "100vh",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "rgb(45, 46, 45)",
    alignItems: "center",
    alignContent: "center",
    horizontalAlign: "center",
  })
);

export const OverlayEmoji = styled.div(
  css({
    position: "absolute",
    top: 20,
    left: 5,
    padding: "space20",
    zIndex: 60,
    fontSize: "3rem",
  })
);

export const OverlayContent = styled.div(
  css({
    position: "absolute",
    bottom: 0,
    opacity: 0.8,
    padding: "space20",
    backgroundColor: "#FFFFFF",
    zIndex: 60,
    borderRadius: "0px 6px 0px 0px",
  })
);
const CONTAINER_GUTTER = "30px";
export const GridViewContainer = styled.div(
  css({
    height: "calc(100vh - 160px)",
    position: "absolute",
    display: "flex",
    top: CONTAINER_GUTTER,
    right: CONTAINER_GUTTER,
    bottom: CONTAINER_GUTTER,
    left: CONTAINER_GUTTER,
    margin: "0 auto",
    alignContent: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  })
);

const FOCUSED_CONTAINER_GUTTER = "15px";
export const FocusedTrackViewContainer = styled.div(
  css({
    height: "calc(100vh - 160px)",
    position: "absolute",
    display: "flex",
    top: FOCUSED_CONTAINER_GUTTER,
    right: FOCUSED_CONTAINER_GUTTER,
    bottom: FOCUSED_CONTAINER_GUTTER,
    left: FOCUSED_CONTAINER_GUTTER,
    margin: "0 auto",
    alignContent: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  })
);

export const ParticipantListContainer = styled.div(
  css({
    height: "100%",
    display: "flex",
    margin: "0 auto",
    alignContent: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  })
);

export const ActiveVideoRoomContainer = styled.div(
  css({
    width: "100%",
    height: "100vh",
    position: "relative",
    backgroundColor: "rgb(45, 46, 45)",
  })
);

export const WaitingOverlayContainer = styled.div(
  css({
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "rgba(45, 46, 45, 0.5)",
    backdropFilter: "blur(5px)",
    zIndex: 70,
  })
);

export const FooterDiv = styled.div(
  css({
    width: "100%",
    height: "70px",
    backgroundColor: "rgb(246, 246, 246)",
    paddingRight: "14px",
    paddingLeft: "14px",
    position: "absolute",
    bottom: 0,
    zIndex: 80,
  })
);

export const MaxWidthDiv = styled.div(
  css({
    maxWidth: "500px",
    marginTop: "space40",
    minWidth: "350px",
    justifyContent: "center",
  })
);

export const RoomInfoDiv = styled.div(
  css`
    display: block;
    @media only screen and (max-width: 768px) {
      display: none;
    }
  `
);
