import React from 'react';
import { useAuth } from "oidc-react";

export const UserAvatar = ({ showName }) => {
  const auth = useAuth();
  const personaName = auth?.userData?.profile?.persona_name;

  const avatarUrl = new URL("https://api.dicebear.com/6.x/initials/svg");
  avatarUrl.searchParams.set("seed", personaName);

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        style={{
          margin: 0,
          minWidth: 30,
          minHeight: 30,
          height: "calc(100% - 20px)",
        }}
        src={avatarUrl.href}
        alt="avatar"
      />

      {showName && (
        <h3
          style={{
            margin: "0 0 0 0px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {personaName}
        </h3>
      )}
    </div>
  );
};
