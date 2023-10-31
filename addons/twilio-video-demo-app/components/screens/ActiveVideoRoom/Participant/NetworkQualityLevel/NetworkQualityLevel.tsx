import { Participant } from "twilio-video";
import { styled, css } from "@twilio-paste/styling-library";

import useParticipantNetworkQualityLevel from "../../../../../lib/hooks/useParticipantNetworkQuality";

const STEP = 3;
const BARS_ARRAY = [0, 1, 2, 3, 4];

const OuterContainer = styled.div(
  css({
    width: "1.5em",
    height: "1.5em",
    padding: "0.9em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  })
);

const InnerContainer = styled.div(
  css({
    display: "flex",
    alignItems: "flex-end",
    "& div": {
      width: "2px",
      marginRight: "1px",
      "&:not(:last-child)": {
        borderRight: "none",
      },
    },
  })
);

export default function NetworkQualityLevel({
  participant,
}: {
  participant: Participant;
}) {
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);

  if (networkQualityLevel === null) return null;

  return (
    <OuterContainer>
      <InnerContainer>
        {BARS_ARRAY.map((level) => (
          <div
            key={level}
            style={{
              height: `${STEP * (level + 1)}px`,
              background:
                networkQualityLevel > level
                  ? "rgba(0, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.2)",
            }}
          />
        ))}
      </InnerContainer>
    </OuterContainer>
  );
}
