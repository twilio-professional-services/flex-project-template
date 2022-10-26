import { PasteCustomCSS } from "@twilio-paste/customization";

const customPasteElements = {
  C_AND_V_BUTTON_BOX: {
    paddingLeft: "space40",
    paddingRight: "space40",
    paddingTop: "space40",
  },
  C_AND_V_CONTENT_BOX: {
    paddingBottom: "space40",
  },
  C_AND_V_CONTENT_HEADING: {
    marginBottom: "space0",
  },
} as {[key: string]: PasteCustomCSS};

export default customPasteElements;
