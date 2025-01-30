import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

export enum StringTemplates {
  FailedToLoadInsightsClient = 'PSFailedToLoadInsightsClient',
  FailedToLoadInsightsData = 'PSFailedToLoadInsightsData',
  XWTFeatureDependencyMissing = 'PSXWTFeatureDependencyMissing',
  PhoneNumberFailedValidationCheckRequest = 'PSPhoneNumberFailedValidationCheckRequest',
  PhoneNumberFailedValidationCheckWithErrors = 'PSPhoneNumberFailedValidationCheckWithErrors',
  ErrorExecutingColdTransfer = 'PSErrorExecutingColdTransfer',
  Queues = 'PSDirectoryQueues',
  External = 'PSDirectoryExternal',
  SearchDirectory = 'PSDirectorySearchDirectory',
  NoItemsFound = 'PSDirectoryNoItemsFound',
  MoreItems = 'PSDirectoryMoreItems',
  NoAgentsAvailable = 'PSDirectoryNoAgentsAvailable',
  NoQueuesAvailable = 'PSDirectoryNoQueuesAvailable',
  ColdTransfer = 'PSDirectoryColdTransfer',
  WarmTransfer = 'PSDirectoryWarmTransfer',
  QueuesFiltered = 'PSDirectoryQueuesFiltered',
  QueueTooltip = 'PSDirectoryQueueTooltip',
  NA = 'PSDirectoryNA',
  CountryDisabled = 'PSDirectoryCountryDisabled',
  HighRiskSpecialNumberDisabled = 'PSDirectoryHighRiskSpecialNumberDisabled',
  UpdateList = 'PSDirectoryUpdateList',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.FailedToLoadInsightsClient]: 'Failed to load real time insights client. All queues are listed',
    [StringTemplates.FailedToLoadInsightsData]: 'Unable to load real time insights data. All queues are listed',
    [StringTemplates.XWTFeatureDependencyMissing]:
      "The Custom Transfer Directory with external transfer is enabled but neither the native 'external warm transfer' feature or the plugins own 'conference' feature are enabled that it depends on.  As a result, warm external transfers for voice calls will be disabled",
    [StringTemplates.PhoneNumberFailedValidationCheckRequest]:
      "Failed to successfully make validation check request for phone number '{{phoneNumber}}'",
    [StringTemplates.PhoneNumberFailedValidationCheckWithErrors]:
      "The phone number '{{phoneNumber}}' failed validation check with the following errors: {{errors}}",
    [StringTemplates.ErrorExecutingColdTransfer]: 'Error attempting to perform cold transfer, {{message}}',
    [StringTemplates.Queues]: 'Queues',
    [StringTemplates.External]: 'External',
    [StringTemplates.SearchDirectory]: 'Search Directory',
    [StringTemplates.NoItemsFound]: 'No items found.',
    [StringTemplates.MoreItems]: 'More items are available using the search field above.',
    [StringTemplates.NoAgentsAvailable]: 'No agents are currently eligible to receive a transfer.',
    [StringTemplates.NoQueuesAvailable]: 'No queues are currently eligible to receive a transfer.',
    [StringTemplates.ColdTransfer]: 'Cold Transfer',
    [StringTemplates.WarmTransfer]: 'Warm Transfer',
    [StringTemplates.QueuesFiltered]: 'Queues may be filtered out due to lack of available workers in queues.',
    [StringTemplates.QueueTooltip]: 'Agents: {{agentsAvailable}}, Tasks in queue: {{tasksInQueue}}',
    [StringTemplates.NA]: 'N/A',
    [StringTemplates.CountryDisabled]: 'Dialing to this country has been disabled.',
    [StringTemplates.HighRiskSpecialNumberDisabled]:
      'This number is considered high-risk and dialing it has been disabled.',
    [StringTemplates.UpdateList]: 'Update list',
  },
  'es-MX': esMX,
  'pt-BR': ptBR,
  th,
  'zh-Hans': zhHans,
  'es-ES': esES,
});
