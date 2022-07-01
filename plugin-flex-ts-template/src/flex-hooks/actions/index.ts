import * as Flex from '@twilio/flex-ui';
import AcceptTask from './AcceptTask';
import CompleteTask from './CompleteTask';
import HangupCall from './HangupCall';
import HoldParticipant from './HoldParticipant';
import KickParticipant from './KickParticipant';
import MessageListItem from './MessageListItem';
import MonitorCall from './MonitorCall';
import NavigateToView from './NavigateToView';
import RejectTask from './RejectTask';
import SetActivity from './SetActivity';
import SetWorkerActivity from './SetWorkerActivity';
import StartOutboundCall from './StartOutboundCall';
import TransferTask from './TransferTask';
import UnholdParticipant from './UnholdParticipant';
import WrapupTask from './WrapupTask';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  AcceptTask(flex, manager);
  CompleteTask(flex, manager);
  HangupCall(flex, manager);
  HoldParticipant(flex, manager);
  KickParticipant(flex, manager);
  NavigateToView(flex, manager);
  RejectTask(flex, manager);
  SetActivity(flex, manager);
  SetWorkerActivity(flex, manager);
  StartOutboundCall(flex, manager);
  TransferTask(flex, manager);
  UnholdParticipant(flex, manager);
  WrapupTask(flex, manager);
  MessageListItem(flex, manager);
  MonitorCall(flex, manager);
}
