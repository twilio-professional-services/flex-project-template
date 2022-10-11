import * as Flex from "@twilio/flex-ui";

type ComponentName =
  | "AgentDesktopView"
  | "CallCanvas"
  | "CallCanvasActions"
  | "CRMContainer"
  | "MainHeader"
  | "MessageListItem"
  | "NoTasksCanvas"
  | "ParticipantCanvas"
  | "QueueStats"
  | "SideNav"
  | "TaskCanvasHeader"
  | "TaskCanvasTabs"
  | "TaskListButtons"
  | "TaskOverviewCanvas"
  | "TeamsView"
  | "ViewCollection"
  | "WorkerCanvas"
  | "WorkersDataTable"
  | "WorkerDirectory"
  | "WorkerProfile"
  | "OutboundDialerPanel"
  | "TaskInfoPanel";

type ComponentHandler = (flex: typeof Flex, manager: Flex.Manager) => void;

export type Components = Partial<Record<ComponentName, ComponentHandler[]>>;
