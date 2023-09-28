import { Builder } from '@builder.io/react';

const getDemoConfigs = () => {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    locale: Builder.isEditing ? "default" : urlParams.get("locale") ?? "",
    phone: Builder.isEditing
      ? "+1800-BUILDER-EDITOR"
      : urlParams.get("phone") ?? "",
    email: Builder.isEditing
      ? "builder_editor@fake.com"
      : urlParams.get("personaEmail") ?? "",
    userName: Builder.isEditing
      ? "Builder Editor"
      : urlParams.get("personaName") ?? "",
  };
};

export const useDemoConfigs = () => {
  return getDemoConfigs();
};