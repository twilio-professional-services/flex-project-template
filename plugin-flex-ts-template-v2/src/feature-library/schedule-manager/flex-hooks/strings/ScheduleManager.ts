export enum StringTemplates {
  SCHEDULE_MANAGER_TITLE = 'SchMgrTitle',
  PUBLISH_ABORTED = 'SchMgrPublishAborted',
  PUBLISH_INFLIGHT = 'SchMgrPublishInflight',
  PUBLISH_FAILED_OTHER_UPDATE = 'SchMgrPublishFailedOtherUpdate',
  PUBLISH_FAILED = 'SchMgrPublishFailed',
  PUBLISH_FAILED_ACTIVITY = 'SchMgrPublishFailedActivity',
  PUBLISH_SUCCESS = 'SchMgrPublishSuccess',
  PUBLISH_BUTTON = 'SchMgrPublishButton',
  PUBLISH_DIALOG_TITLE = 'SchMgrPublishDialogTitle',
  PUBLISH_DIALOG_TEXT = 'SchMgrPublishDialogText',
  LOAD_FAILED_TITLE = 'SchMgrLoadFailedTitle',
  LOAD_FAILED_TEXT = 'SchMgrLoadFailedText',
  TAB_SCHEDULES = 'SchMgrTabSchedules',
  TAB_RULES = 'SchMgrTabRules',
  CREATE_SCHEDULE_BUTTON = 'SchMgrCreateScheduleButton',
  CREATE_RULE_BUTTON = 'SchMgrCreateRuleButton',
  OPEN = 'SchMgrStatusOpen',
  CLOSED = 'SchMgrStatusClosed',
  STATUS_PENDING = 'SchMgrStatusPending',
  NAME = 'SchMgrName',
  COLUMN_STATUS = 'SchMgrColumnStatus',
  COLUMN_STATUS_ASOF = 'SchMgrColumnStatusAsOf',
  COLUMN_RULE = 'SchMgrColumnRule',
  RULES = 'SchMgrRules',
  RULES_TEXT = 'SchMgrRulesText',
  TIMEZONE = 'SchMgrTimeZone',
  COLUMN_MANUALLYCLOSED = 'SchMgrColumnManuallyClosed',
  MANUALLYCLOSE = 'SchMgrManuallyClose',
  MANUALLYCLOSE_TEXT = 'SchMgrManuallyCloseText',
  TYPE = 'SchMgrType',
  TIME = 'SchMgrTime',
  DATE = 'SchMgrDate',
  ANY_TIME = 'SchMgrAnyTime',
  ANY_DAY = 'SchMgrAnyDay',
  DATE_FROM = 'SchMgrDateFrom',
  DATE_UNTIL = 'SchMgrDateUntil',
  CLOSED_YES = 'SchMgrClosedYes',
  CLOSED_NO = 'SchMgrClosedNo',
  ERROR_NAME_REQUIRED = 'SchMgrErrorNameRequired',
  ERROR_NAME_UNIQUE = 'SchMgrErrorNameUnique',
  ERROR_TIMEZONE_REQUIRED = 'SchMgrErrorTimeZoneRequired',
  ERROR_REASON_REQUIRED = 'SchMgrErrorReasonRequired',
  ERROR_TIME_REQUIRED = 'SchMgrErrorTimeRequired',
  ERROR_ENDDATE = 'SchMgrErrorEndDate',
  ERROR_ENDTIME = 'SchMgrErrorEndTime',
  ERROR_DATE_REQUIRED = 'SchMgrErrorDateRequired',
  ERROR_DOW_REQUIRED = 'SchMgrErrorDOWRequired',
  ERROR_DOM_REQUIRED = 'SchMgrErrorDOMRequired',
  ERROR_DOM_NUMBER = 'SchMgrErrorDOMNumber',
  ERROR_DOM_RANGE = 'SchMgrErrorDOMRange',
  ERROR_STARTENDDATE_REQUIRED = 'SchMgrErrorStartEndDateRequired',
  ERROR_RULE_REFERENCED = 'SchMgrErrorRuleReferenced',
  NAME_COPY = 'SchMgrNameCopy',
  NEW_SCHEDULE_TITLE = 'SchMgrNewScheduleTitle',
  EDIT_SCHEDULE_TITLE = 'SchMgrEditScheduleTitle',
  NEW_RULE_TITLE = 'SchMgrNewRuleTitle',
  EDIT_RULE_TITLE = 'SchMgrEditRuleTitle',
  ADD_RULE = 'SchMgrAddRule',
  COLUMN_ACTIONS = 'SchMgrColumnActions',
  UP = 'SchMgrUp',
  DOWN = 'SchMgrDown',
  REMOVE_FROM_SCHEDULE = 'SchMgrRemoveFromSchedule',
  SAVE_BUTTON = 'SchMgrSaveButton',
  SAVE_COPY_BUTTON = 'SchMgrSaveCopyButton',
  DELETE_BUTTON = 'SchMgrDeleteButton',
  CLOSED_REASON = 'SchMgrClosedReason',
  CLOSED_REASON_TEXT = 'SchMgrClosedReasonText',
  TIME_SETTINGS_TITLE = 'SchMgrTimeSettingsTitle',
  DATE_SETTINGS_TITLE = 'SchMgrDateSettingsTitle',
  ALL_DAY = 'SchMgrAllDay',
  START_TIME = 'SchMgrStartTime',
  END_TIME = 'SchMgrEndTime',
  RECURRENCE = 'SchMgrRecurrence',
  RECURRENCE_ONCE = 'SchMgrRecurrenceOnce',
  RECURRENCE_DAILY = 'SchMgrRecurrenceDaily',
  RECURRENCE_WEEKLY = 'SchMgrRecurrenceWeekly',
  RECURRENCE_MONTHLY = 'SchMgrRecurrenceMonthly',
  RECURRENCE_YEARLY = 'SchMgrRecurrenceYearly',
  DAY_OF_MONTH = 'SchMgrDayOfMonth',
  DAY_OF_WEEK = 'SchMgrDayOfWeek',
  DOW_MONDAY = 'SchMgrDOWMonday',
  DOW_TUESDAY = 'SchMgrDOWTuesday',
  DOW_WEDNESDAY = 'SchMgrDOWWednesday',
  DOW_THURSDAY = 'SchMgrDOWThursday',
  DOW_FRIDAY = 'SchMgrDOWFriday',
  DOW_SATURDAY = 'SchMgrDOWSaturday',
  DOW_SUNDAY = 'SchMgrDOWSunday',
  MONTH = 'SchMgrMonth',
  MONTH_JAN = 'SchMgrMonthJan',
  MONTH_FEB = 'SchMgrMonthFeb',
  MONTH_MAR = 'SchMgrMonthMar',
  MONTH_APR = 'SchMgrMonthApr',
  MONTH_MAY = 'SchMgrMonthMay',
  MONTH_JUN = 'SchMgrMonthJun',
  MONTH_JUL = 'SchMgrMonthJul',
  MONTH_AUG = 'SchMgrMonthAug',
  MONTH_SEP = 'SchMgrMonthSep',
  MONTH_OCT = 'SchMgrMonthOct',
  MONTH_NOV = 'SchMgrMonthNov',
  MONTH_DEC = 'SchMgrMonthDec',
  RESTRICT_DATE_RANGE = 'SchMgrRestrictDateRange',
  START_DATE = 'SchMgrStartDate',
  END_DATE = 'SchMgrEndDate',
}

export default {
  [StringTemplates.SCHEDULE_MANAGER_TITLE]: 'Schedule Manager',
  [StringTemplates.PUBLISH_ABORTED]: 'The schedule publish was aborted. Your changes may not have been saved.',
  [StringTemplates.PUBLISH_INFLIGHT]: 'Another schedule publish is in progress. Publishing now will overwrite other changes.',
  [StringTemplates.PUBLISH_FAILED_OTHER_UPDATE]: 'Schedule was updated by someone else and cannot be published. Please reload and try again.',
  [StringTemplates.PUBLISH_FAILED]: 'Schedule publish failed.',
  [StringTemplates.PUBLISH_FAILED_ACTIVITY]: 'Switch to a non-available activity to publish.',
  [StringTemplates.PUBLISH_SUCCESS]: 'Successfully published schedules.',
  [StringTemplates.PUBLISH_BUTTON]: 'Publish Schedules',
  [StringTemplates.PUBLISH_DIALOG_TITLE]: 'Publishing schedules',
  [StringTemplates.PUBLISH_DIALOG_TEXT]: 'This may take a few moments, please wait...',
  [StringTemplates.LOAD_FAILED_TITLE]: 'Failed to load schedules',
  [StringTemplates.LOAD_FAILED_TEXT]: 'Please reload and try again.',
  [StringTemplates.TAB_SCHEDULES]: 'Schedules',
  [StringTemplates.TAB_RULES]: 'Rules',
  [StringTemplates.CREATE_SCHEDULE_BUTTON]: 'Create Schedule',
  [StringTemplates.CREATE_RULE_BUTTON]: 'Create Rule',
  [StringTemplates.OPEN]: 'Open',
  [StringTemplates.CLOSED]: 'Closed',
  [StringTemplates.STATUS_PENDING]: 'Pending Publish',
  [StringTemplates.NAME]: 'Name',
  [StringTemplates.COLUMN_STATUS]: 'Status',
  [StringTemplates.COLUMN_STATUS_ASOF]: 'as of',
  [StringTemplates.COLUMN_RULE]: 'Rule',
  [StringTemplates.RULES]: 'Rules',
  [StringTemplates.RULES_TEXT]: 'If an open rule matches and no closed rules match, the schedule is open. If a closed rule matches, the topmost match in the list is used.',
  [StringTemplates.TIMEZONE]: 'Time zone',
  [StringTemplates.COLUMN_MANUALLYCLOSED]: 'Manually closed',
  [StringTemplates.MANUALLYCLOSE]: 'Manually close',
  [StringTemplates.MANUALLYCLOSE_TEXT]: 'Overrides all selected rules',
  [StringTemplates.TYPE]: 'Type',
  [StringTemplates.TIME]: 'Time',
  [StringTemplates.DATE]: 'Date',
  [StringTemplates.ANY_TIME]: 'any time',
  [StringTemplates.ANY_DAY]: 'any day',
  [StringTemplates.DATE_FROM]: 'from',
  [StringTemplates.DATE_UNTIL]: 'until',
  [StringTemplates.CLOSED_YES]: 'Yes',
  [StringTemplates.CLOSED_NO]: 'No',
  [StringTemplates.ERROR_NAME_REQUIRED]: 'Name is a required field.',
  [StringTemplates.ERROR_NAME_UNIQUE]: 'Name must be unique.',
  [StringTemplates.ERROR_TIMEZONE_REQUIRED]: 'Time zone is a required field.',
  [StringTemplates.ERROR_REASON_REQUIRED]: 'Closed reason is a required field for closed rules.',
  [StringTemplates.ERROR_TIME_REQUIRED]: 'Both start and end time are required fields for non-all-day rules.',
  [StringTemplates.ERROR_ENDDATE]: 'End date must be after start date.',
  [StringTemplates.ERROR_ENDTIME]: 'End time must be later than start time.',
  [StringTemplates.ERROR_DATE_REQUIRED]: 'Date is a required field.',
  [StringTemplates.ERROR_DOW_REQUIRED]: 'At least one day of week must be selected.',
  [StringTemplates.ERROR_DOM_REQUIRED]: 'Day of month is a required field.',
  [StringTemplates.ERROR_DOM_NUMBER]: 'Day of month must be a number.',
  [StringTemplates.ERROR_DOM_RANGE]: 'Day of month must be between 1 and 31.',
  [StringTemplates.ERROR_STARTENDDATE_REQUIRED]: 'Start and/or end date is required when restricting the date range.',
  [StringTemplates.ERROR_RULE_REFERENCED]: 'Cannot delete rule because it is referenced in these schedules:',
  [StringTemplates.NAME_COPY]: 'copy',
  [StringTemplates.NEW_SCHEDULE_TITLE]: 'New Schedule',
  [StringTemplates.EDIT_SCHEDULE_TITLE]: 'Edit Schedule',
  [StringTemplates.NEW_RULE_TITLE]: 'New Rule',
  [StringTemplates.EDIT_RULE_TITLE]: 'Edit Rule',
  [StringTemplates.ADD_RULE]: 'Add rule',
  [StringTemplates.COLUMN_ACTIONS]: 'Actions',
  [StringTemplates.UP]: 'Up',
  [StringTemplates.DOWN]: 'Down',
  [StringTemplates.REMOVE_FROM_SCHEDULE]: 'Remove from schedule',
  [StringTemplates.SAVE_BUTTON]: 'Save',
  [StringTemplates.SAVE_COPY_BUTTON]: 'Save & Copy',
  [StringTemplates.DELETE_BUTTON]: 'Delete',
  [StringTemplates.CLOSED_REASON]: 'Closed reason',
  [StringTemplates.CLOSED_REASON_TEXT]: 'This value will be provided to your application when the rule matches.',
  [StringTemplates.TIME_SETTINGS_TITLE]: 'Time Settings',
  [StringTemplates.DATE_SETTINGS_TITLE]: 'Date Settings',
  [StringTemplates.ALL_DAY]: 'All day',
  [StringTemplates.START_TIME]: 'Start time',
  [StringTemplates.END_TIME]: 'End time',
  [StringTemplates.RECURRENCE]: 'Recurrence',
  [StringTemplates.RECURRENCE_ONCE]: 'One time',
  [StringTemplates.RECURRENCE_DAILY]: 'Daily',
  [StringTemplates.RECURRENCE_WEEKLY]: 'Weekly',
  [StringTemplates.RECURRENCE_MONTHLY]: 'Monthly',
  [StringTemplates.RECURRENCE_YEARLY]: 'Yearly',
  [StringTemplates.DAY_OF_MONTH]: 'Day of month',
  [StringTemplates.DAY_OF_WEEK]: 'Day of week',
  [StringTemplates.DOW_MONDAY]: 'Monday',
  [StringTemplates.DOW_TUESDAY]: 'Tuesday',
  [StringTemplates.DOW_WEDNESDAY]: 'Wednesday',
  [StringTemplates.DOW_THURSDAY]: 'Thursday',
  [StringTemplates.DOW_FRIDAY]: 'Friday',
  [StringTemplates.DOW_SATURDAY]: 'Saturday',
  [StringTemplates.DOW_SUNDAY]: 'Sunday',
  [StringTemplates.MONTH]: 'Month',
  [StringTemplates.MONTH_JAN]: 'January',
  [StringTemplates.MONTH_FEB]: 'February',
  [StringTemplates.MONTH_MAR]: 'March',
  [StringTemplates.MONTH_APR]: 'April',
  [StringTemplates.MONTH_MAY]: 'May',
  [StringTemplates.MONTH_JUN]: 'June',
  [StringTemplates.MONTH_JUL]: 'July',
  [StringTemplates.MONTH_AUG]: 'August',
  [StringTemplates.MONTH_SEP]: 'September',
  [StringTemplates.MONTH_OCT]: 'October',
  [StringTemplates.MONTH_NOV]: 'November',
  [StringTemplates.MONTH_DEC]: 'December',
  [StringTemplates.RESTRICT_DATE_RANGE]: 'Restrict date range',
  [StringTemplates.START_DATE]: 'Start date',
  [StringTemplates.END_DATE]: 'End date',
};