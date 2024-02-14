import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { isCustomColorsEnabled, getCustomColors } from '../../config';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function applyBrandingColors(flex: typeof Flex, manager: Flex.Manager) {
  if (!isCustomColorsEnabled()) {
    return;
  }

  const colors = getCustomColors();
  const themeOverrides = {} as any;

  if (Boolean(colors.main_header_background)) {
    themeOverrides.MainHeader = {
      ...themeOverrides.MainHeader,
      Container: {
        ...themeOverrides.MainHeader?.Container,
        background: colors.main_header_background,
      },
    };
  }

  if (Boolean(colors.side_nav_background)) {
    themeOverrides.SideNav = {
      ...themeOverrides.SideNav,
      Container: {
        ...themeOverrides.SideNav?.Container,
        background: colors.side_nav_background,
      },
      Button: {
        ...themeOverrides.SideNav?.Container,
        background: colors.side_nav_background,
      },
    };
  }

  if (Boolean(colors.side_nav_border)) {
    themeOverrides.SideNav = {
      ...themeOverrides.SideNav,
      Container: {
        ...themeOverrides.SideNav?.Container,
        borderColor: colors.side_nav_border,
      },
    };
  }

  if (Boolean(colors.side_nav_icon)) {
    themeOverrides.SideNav = {
      ...themeOverrides.SideNav,
      Button: {
        ...themeOverrides.SideNav?.Button,
        color: colors.side_nav_icon,
      },
      Icon: {
        ...themeOverrides.SideNav?.Icon,
        color: colors.side_nav_icon,
      },
    };
  }

  if (Boolean(colors.side_nav_selected_icon)) {
    themeOverrides.SideNav = {
      ...themeOverrides.SideNav,
      SelectedIcon: {
        ...themeOverrides.SideNav?.SelectedIcon,
        color: colors.side_nav_selected_icon,
      },
    };
  }

  if (Boolean(colors.side_nav_hover_background)) {
    themeOverrides.SideNav = {
      ...themeOverrides.SideNav,
      Icon: {
        ...themeOverrides.SideNav?.Icon,
        '&:hover': {
          background: colors.side_nav_hover_background,
        },
      },
    };
  }

  manager.updateConfig({
    theme: {
      componentThemeOverrides: themeOverrides,
    },
  });
};
