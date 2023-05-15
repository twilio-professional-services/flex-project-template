import * as Flex from '@twilio/flex-ui';
import { CustomizationProvider, PasteCustomCSS, CustomizationProviderProps } from '@twilio-paste/core/customization';

let customPasteElements = {};

export const init = (flex: typeof Flex) => {
  // Currently the method to customize Paste elements in Flex is somewhat clunky.
  // This is correct for now but may improve. See FLEXEXP-772
  flex.setProviders({
    CustomProvider: (RootComponent) => (props) => {
      const pasteProviderProps: CustomizationProviderProps & { style: PasteCustomCSS } = {
        baseTheme: props.theme?.isLight ? 'default' : 'dark',
        theme: props.theme?.tokens,
        style: { minWidth: '100%', height: '100%' },
        elements: { ...customPasteElements },
      };
      return (
        <CustomizationProvider {...pasteProviderProps}>
          <RootComponent {...props} />
        </CustomizationProvider>
      );
    },
  });
};

export const addHook = (flex: typeof Flex, manager: Flex.Manager, feature: string, hook: any) => {
  console.info(`Feature ${feature} registered Paste element hook`);
  customPasteElements = {
    ...customPasteElements,
    ...hook.pasteElementHook,
  };
};
