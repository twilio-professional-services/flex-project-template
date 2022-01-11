import { createMuiTheme } from "@material-ui/core/styles";

// Need to use this combined with <MuiThemeProvider> component
// This isolates MUI components from styles overridden by Flex
export default createMuiTheme({
  typography: {
    useNextVariants: true
  },
  overrides: {
    MuiTabs: {
      indicator: { backgroundColor: '#ffffff' }
    },
    MUIDataTable: {
      responsiveScrollMaxHeight: {
        maxHeight: '296px !important',
        minHeight: 296
      }
    }
  }
});