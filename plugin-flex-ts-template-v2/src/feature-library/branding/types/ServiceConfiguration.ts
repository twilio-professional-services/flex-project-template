export default interface BrandingConfig {
  enabled: boolean;
  custom_logo_url: string;
  use_custom_colors: boolean;
  custom_colors: {
    main_header_background: string;
    side_nav_background: string;
    side_nav_border: string;
    side_nav_icon: string;
    side_nav_selected_icon: string;
    side_nav_hover_background: string;
  };
  component_theme_overrides: any;
}
