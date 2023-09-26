import React from "react";
import { TranslatableText } from "../TranslatableText";
import { Button } from 'theme-ui';

export const CoreButton = ({
  translatableText = null,
  onClick = () => {},
  text = null,
  style = {}
}) => {
  return (
    <Button
      style={{
        width: "100%",
        cursor: "pointer",
        color: "black",
        marginTop: "20px",
        marginBottom: "20px",
        ...style
      }}
      onClick={onClick}
    >
      {translatableText ? (
        <TranslatableText translatableText={translatableText} />
      ) : (
        <h3 style={{ margin: '0px !important' }}>{text}</h3>
      )}
    </Button>
  );
};
