// TODO: Use DEFAULT_VIDEO_CONSTRAINTS
export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints["video"] = {
  width: 1280,
  height: 720,
  frameRate: 24,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = "TwilioVideoApp-selectedAudioInput";
export const SELECTED_AUDIO_OUTPUT_KEY = "TwilioVideoApp-selectedAudioOutput";
export const SELECTED_VIDEO_INPUT_KEY = "TwilioVideoApp-selectedVideoInput";

export const GALLERY_VIEW_ASPECT_RATIO = 9 / 16; // 16:9
export const GALLERY_VIEW_MARGIN = 4;

// List of possible issues to select in post-video room survey
export const ROOM_ISSUES_FEEDBACK_OPTIONS = [
  "Couldn't hear",
  "Others couldn't hear",
  "Video was low quality",
  "Video froze or was choppy",
  "Couldn't see participants",
  "Sound didn't match video",
  "Participants couldn't see me",
  "Other issue",
];

// Static strings of text used throughout the application
export const TEXT_COPY = {
  ROOM_NAME_INPUT_DISABLED: "Room name was auto-populated by invite URL",
  ROOM_NAME_INPUT_ENABLED:
    "To join a video room manually, please enter the room name.",
  PERMISSIONS_CHECK_WARNING:
    "To actively participate in the video call, this application will need permission to access your camera and microphone. After acknowledgement, the browser will request permission.",
  HELP_TEXT_PRELIGHT_PASSED: "Click to join the video room!",
  HELP_TEXT_PRELIGHT_INFLIGHT: "Please wait while we check your connection...",
  HELP_TEXT_PRELIGHT_FAILED:
    "Failed connectivity checks to Twilio Cloud - please check your network connection.",
  CONFIGURE_SETTINGS_HEADER: "Audio & Video Settings",
  CONFIGURE_SETTINGS_DESCRIPTION: "Configure your audio and video settings",
  WAITING_FOR_PARTICIPANTS_HEADER: "Waiting for other participants to join...",
  LEAVE_ROOM_CONFIRMATION_HEADER: "Leave Room?",
  LEAVE_ROOM_CONFIRMATION_DESCRIPTION:
    "Are you sure you want to leave the video room?",
  DISCONNECT_HEADER:
    "You have disconnected from the room.",
  DISCONNECT_ERROR_HEADER:
    "You were disconnected from the room due to an error:",
  SURVEY_COLLECTION_HEADER: "Survey / Experience Collection",
  SURVEY_COLLECTION_DESCRIPTION:
    "Use this state of the application to gather post video room surveys (gauge the overall experience, issues faced, etc.)",
};
