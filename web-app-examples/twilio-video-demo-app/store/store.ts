import * as Video from "twilio-video";
import create from "zustand";

enum RoomStatus {
  NOT_CONNECTED = "NOT_CONNECTED",
  CONNECTED = "CONNECTED",
}

export enum UIStep {
  LANDING_SCREEN = "LANDING_SCREEN",
  PRE_JOIN_SCREEN = "PRE_JOIN_SCREEN",
  VIDEO_ROOM = "VIDEO_ROOM",
  VIDEO_ROOM_DISCONNECT = "VIDEO_ROOM_DISCONNECT",
}

interface LandingPageFormData {
  identity: undefined | string;
  roomName: undefined | string;
}

interface LocalTracks {
  audio: Video.LocalAudioTrack | undefined;
  video: Video.LocalVideoTrack | undefined;
  screen: Video.LocalVideoTrack | undefined;
  data: Video.LocalDataTrack | undefined;
}

interface DisconnectError {
  code: number;
  message: string;
}

interface PermissionsState {
  camera: boolean;
  microphone: boolean;
}

export interface VideoAppState {
  room: Video.Room | null;
  disconnectError: DisconnectError | null;
  status: RoomStatus;
  uiStep: UIStep;
  formData: LandingPageFormData;
  devicePermissions: PermissionsState;
  hasSkippedPermissionCheck: boolean;
  localTracks: LocalTracks;
  localEmoji: string | undefined;
  activeSinkId: undefined | string;
  setActiveSinkId: (deviceId: string) => void;
  setDevicePermissions: (
    device: "camera" | "microphone",
    enabled: boolean
  ) => void;
  setFormData: (data: LandingPageFormData) => void;
  setUIStep: (step: UIStep) => void;
  setActiveRoom: (room: Video.Room) => void;
  setDisconnectError: (code: number, message: string) => void;
  clearActiveRoom: () => void;
  setHasSkippedPermissionCheck: (hasSkipped: boolean) => void;
  setLocalTracks: (
    type: "audio" | "video" | "screen" | "data",
    track: Video.LocalAudioTrack | Video.LocalVideoTrack | Video.LocalDataTrack
  ) => void;
  clearTrack: (type: "audio" | "video" | "screen" | "data") => void;
  setLocalEmoji: (emoji?: string) => void;
  resetState: () => void;
}

export const useVideoStore = create<VideoAppState>()((set, get) => ({
  room: null,
  disconnectError: null,
  status: RoomStatus.NOT_CONNECTED,
  uiStep: UIStep.LANDING_SCREEN,
  formData: {
    identity: undefined,
    roomName: undefined,
  },
  devicePermissions: {
    camera: false,
    microphone: false,
  },
  hasSkippedPermissionCheck: false,
  localEmoji: undefined,
  localTracks: {
    audio: undefined,
    video: undefined,
    screen: undefined,
    data: undefined,
  },
  activeSinkId: undefined,
  setActiveSinkId: (deviceId: string) => set({ activeSinkId: deviceId }),
  setHasSkippedPermissionCheck: (hasSkipped: boolean) =>
    set({ hasSkippedPermissionCheck: hasSkipped }),
  setDevicePermissions: (device: "camera" | "microphone", enabled: boolean) => {
    const currentPermissions = get().devicePermissions;
    if (device === "camera") {
      set({ devicePermissions: { ...currentPermissions, camera: enabled } });
    }
    if (device === "microphone") {
      set({
        devicePermissions: { ...currentPermissions, microphone: enabled },
      });
    }
  },
  setLocalEmoji: (emoji?: string) => set({ localEmoji: emoji ?? undefined }),
  setLocalTracks: (type, track: any) => {
    const currentTracks = get().localTracks;
    if (type === "audio") {
      set({ localTracks: { ...currentTracks, audio: track } });
    }
    if (type === "video") {
      set({ localTracks: { ...currentTracks, video: track } });
    }
    if (type === "screen") {
      set({ localTracks: { ...currentTracks, screen: track } });
    }
    if (type === "data") {
      set({ localTracks: { ...currentTracks, data: track } });
    }
  },
  clearTrack: (type) => {
    const currentTracks = get().localTracks;
    if (type === "video") {
      set({ localTracks: { ...currentTracks, video: undefined } });
    }
    if (type === "audio") {
      set({ localTracks: { ...currentTracks, audio: undefined } });
    }
    if (type === "screen") {
      set({ localTracks: { ...currentTracks, screen: undefined } });
    }
  },
  setFormData: (data: LandingPageFormData) => set({ formData: data }),
  setUIStep: (step: UIStep) => set({ uiStep: step }),
  setActiveRoom: (activeRoom: Video.Room) => set({ room: activeRoom }),
  setDisconnectError: (code: number, message: string) =>
    set({ disconnectError: { code, message } }),
  clearActiveRoom: () =>
    set({
      room: null,
      disconnectError: null,
      hasSkippedPermissionCheck: false,
      localEmoji: undefined,
      devicePermissions: {
        camera: false,
        microphone: false,
      },
      localTracks: {
        audio: undefined,
        video: undefined,
        screen: undefined,
        data: undefined,
      },
    }),
  resetState: () => {
    set({
      room: null,
      disconnectError: null,
      status: RoomStatus.NOT_CONNECTED,
      uiStep: UIStep.LANDING_SCREEN,
      hasSkippedPermissionCheck: false,
      devicePermissions: {
        camera: false,
        microphone: false,
      },
      localEmoji: undefined,
      localTracks: {
        audio: undefined,
        video: undefined,
        screen: undefined,
        data: undefined,
      },
      formData: {
        identity: undefined,
        roomName: undefined,
      },
    });
  },
}));
