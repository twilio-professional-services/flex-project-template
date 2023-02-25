import * as Flex from "@twilio/flex-ui";

type ComponentNames =
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
  | "TaskInfoPanel"
  | "SupervisorTaskCanvasHeader";

type ComponentHandler = (flex: typeof Flex, manager: Flex.Manager) => void;

export type Components = Partial<Record<ComponentNames, ComponentHandler[]>>;
