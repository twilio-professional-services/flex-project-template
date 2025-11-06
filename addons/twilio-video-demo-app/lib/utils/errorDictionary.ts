interface DisconnectErrors {
  [key: number]: {
    id: number;
    cause: string;
    solution: string;
  };
}

export const disconnectErrors: DisconnectErrors = {
  53001: {
    id: 53001,
    cause:
      "The client failed to reconnect to Twilio's signaling server after a network disruption or handoff",
    solution: "User should make sure to have a stable internet connection",
  },
  53002: {
    id: 53002,
    cause:
      "The liveliness checks for the connection to Twilio's signaling server failed, or the current session expired",
    solution: "User should rejoin the Room",
  },
  53205: {
    id: 53205,
    cause: "Another client joined the Room with the same identity",
    solution:
      "Your app should make sure each client creates an AccessToken with a unique identity string",
  },
  53405: {
    id: 53405,
    cause:
      "The client failed to re-establish its media connection with the Room after a network disruption or handoff",
    solution:
      "1. User should make sure to have a stable internet connection 2. If the user is behind a firewall, then it should allow media traffic to and from Twilio to go through",
  },
  53118: {
    id: 53118,
    solution: "",
    cause: "The room was ended by the system",
  },
};
