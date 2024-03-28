---
title: Audit logging
---

Location: `plugin-flex-ts-template-v2/src/utils/helpers/AuditHelper.ts`

When users make configuration changes, it can be difficult afterwards to track who made the change and identify what changed. `AuditHelper.ts` exports a `saveAuditEvent` function which will save an audit event to a Sync list named after the provided `feature` parameter. The individual audit events will be saved with a TTL using the `audit_log_ttl` [common configuration](configuration#common-configuration) property, which by default is two weeks. Each audit event will include a timestamp, as well as the name of the currently logged in worker.

Audit logs can be viewed within the Twilio Console > Sync > Services > Default Service > Lists. You may also retrieve them via [the Sync List APIs](https://www.twilio.com/docs/sync/api/list-resource).

When calling the `saveAuditEvent` function, the following parameters are required:

- **`feature`**: The name of the feature saving the audit log. The audit log will be saved to a Sync list named `AuditLog_feature`.
- **`event`**: A string describing the event being logged, which will be included in the audit log.

You may also optionally provide these parameters as well:

- **`oldValue`**: For events representing a configuration change, this can be an object representing the original configuration to be included in the audit log.
- **`newValue`**: For events representing a configuration change, this can be an object representing the updated configuration to be included in the audit log.

For examples of how to use the audit logger, see the following features:
- **admin-ui**: `plugin-flex-ts-template-v2/src/feature-library/admin-ui/utils/helpers.ts`