import React from "react";
import { useDemoConfigs } from "../../viewModel/useDemoConfigs";
import { TranslatableText } from "../TranslatableText";

export const StorePhone = () => {
  const { phone } = useDemoConfigs();

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TranslatableText translatableText={"callUsAt"} />
      <h3 style={{ marginLeft: 3 }}> {phone}</h3>
    </div>
  );
};
