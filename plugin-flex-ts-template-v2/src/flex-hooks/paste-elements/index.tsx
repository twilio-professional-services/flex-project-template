import * as Flex from '@twilio/flex-ui';
import { CustomizationProvider, PasteCustomCSS, CustomizationProviderProps } from "@twilio-paste/core/customization";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  // Currently the method to customize Paste elements in Flex is somewhat clunky.
  // This is correct for now but may improve. See FLEXEXP-772
  flex.setProviders({
    CustomProvider: (RootComponent) => (props) => {
      const pasteProviderProps: CustomizationProviderProps & { style: PasteCustomCSS } = {
        baseTheme: props.theme?.isLight ? "default" : "dark",
        theme: props.theme?.tokens,
        style: { minWidth: "100%", height: "100%" },
        elements: {
          // Callback and Voicemail styling
          C_AND_V_BUTTON_BOX: {
            paddingLeft: "space40",
            paddingRight: "space40", 
            paddingTop: "space40"
          },
          C_AND_V_CONTENT_BOX: {
            paddingBottom: "space40"
          },
          C_AND_V_CONTENT_HEADING: {
            marginBottom: "space0"
          },
          C_AND_V_CONTENT_PARAGRAPH: {
            marginBottom: "space0"
          }
        }
      };

      return (
        <CustomizationProvider {...pasteProviderProps}>
          <RootComponent {...props} />
        </CustomizationProvider>
      );
    }
  });
}

/*
MyExampleElements example file:
import { PasteCustomCSS } from "@twilio-paste/core/customization";

export default {
  MY_COOL_LABEL: {
    fontWeight: 'fontWeightSemibold'
  } as PasteCustomCSS,
  MY_COOL_SELECT: {
    fontWeight: 'fontWeightNormal'
  } as PasteCustomCSS
}
*/