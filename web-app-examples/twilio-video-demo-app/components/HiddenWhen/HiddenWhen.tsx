import { styled, css } from "@twilio-paste/styling-library";
import React from "react";

interface HiddenWhenProps {
  children: any;
}

/*
    WORK IN PROGRESS - Mobile responsive
*/
export default function HiddenWhen({ children }: HiddenWhenProps) {
  const ConditionallyHiddenDiv = styled.div(
    css({
      "@media screen and (min-width: 400px)": {
        display: "none",
      },
    })
  );

  return <ConditionallyHiddenDiv>{children}</ConditionallyHiddenDiv>;
}
