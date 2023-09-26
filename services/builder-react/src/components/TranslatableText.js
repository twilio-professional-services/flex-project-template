import React from "react";
import { useTranslations } from "../viewModel/localization";

export const TranslatableText = ({ translatableText }) => {
  return (
    <h3 style={{ textAlign: "center", margin: '10px' }}>
      {useTranslations(translatableText) ??
        `No translation: ${translatableText}`}
    </h3>
  );
};
