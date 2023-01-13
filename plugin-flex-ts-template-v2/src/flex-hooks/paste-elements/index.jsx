import { CustomizationProvider } from "@twilio-paste/core/customization";
import featurePasteElements from "../../feature-library/*/flex-hooks/paste-elements/*";

export default (flex, manager) => {
  let customPasteElements = {};
  
  featurePasteElements.forEach((file) => {
    customPasteElements = {
      ...customPasteElements,
      ...file.default
    }
  });
  
  // Currently the method to customize Paste elements in Flex is somewhat clunky.
  // This is correct for now but may improve. See FLEXEXP-772
  flex.setProviders({
    CustomProvider: (RootComponent) => (props) => {
      const pasteProviderProps = {
        baseTheme: props.theme?.isLight ? "default" : "dark",
        theme: props.theme?.tokens,
        style: { minWidth: "100%", height: "100%" },
        elements: { ...customPasteElements }
      }
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
  },
  MY_COOL_SELECT: {
    fontWeight: 'fontWeightNormal'
  }
} as {[key: string]: PasteCustomCSS}
*/