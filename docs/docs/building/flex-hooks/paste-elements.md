Use a Paste elements hook to register your own element definitions for usage in your feature's UI built with [Twilio Paste](https://paste.twilio.design/).

```ts
import { PasteCustomCSS } from "@twilio-paste/customization";

export const pasteElementHook = {
  MY_CUSTOM_ELEMENT: {
    paddingLeft: "space40",
    paddingRight: "space40",
    paddingTop: "space40",
  },
  MY_OTHER_ELEMENT: {
    paddingBottom: "space40",
  },
} as { [key: string]: PasteCustomCSS };
```