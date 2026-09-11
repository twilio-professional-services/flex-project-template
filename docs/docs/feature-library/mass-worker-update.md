---
sidebar_label: mass-worker-update
title: Mass Worker Update
---


An admin-only screen that lets a supervisor bulk-add and bulk-remove TaskRouter skills across a filtered set of workers. Available under a new item in the Flex side navigation for users with the `admin` role.

## Flex User Experience

![Mass worker update demo](/img/features/mass-worker-update/mass-worker-update.gif)

The screen has two panes: an admin picks one team, department, and/or skill to identify the affected workers, previews the list, then chooses skills to add and skills to remove — including numeric levels for any skill configured with a min/max ranking. Hitting **Confirm** starts a batched update loop; a lock modal shows live progress and a Cancel button that any admin currently viewing the screen can hit.

## Disclaimer

**This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.**

## Known limitations — read this first


- **In-flight cancel is best-effort.** Cancel writes to the shared Sync Document; the loop re-reads the doc **before dispatching each batch**. A cancel that arrives while a batch is in flight is picked up on the next iteration — every worker in the currently in-flight batch will complete its update first. Latency is therefore bounded by `batch_size` × per-worker update time.
- **No rollback.** Workers that were updated before a Cancel (or a mid-run failure or timeout) keep their new skills. There is no automatic revert.
- **Concurrency is bounded.** The loop dispatches workers in concurrent batches sized by the `batch_size` config value (clamped to `[1, 25]`, default `5`). A value of `1` restores fully sequential behavior. `Promise.allSettled` observes every update in a batch; if any fail, the loop finishes that batch and aborts, matching the pre-batching abort-on-failure policy at batch granularity.

## How it works

The screen has two sections and one lock:

1. **Identify workers.** Choose up to one team, one department, and one skill; workers must match ALL selected filters (AND logic). Click **Identify workers** to run a TaskRouter `workers.list` server-side using a `targetWorkersExpression` such as `team_name == "Blue Team" AND department_name == "Sales" AND routing.skills HAS "spanish"`. The matching workers are shown in a preview table with their current skills.
2. **Choose skills to add and remove.** Two side-by-side checkbox groups populated from the hosted TaskRouter workspace skills (`Manager.getInstance().serviceConfiguration.taskrouter_skills`, deployed from `flex-config/taskrouter_skills.json`). Skills not selected in either list stay untouched on each worker. Add and remove are mutually exclusive per skill.

   **Skill levels.** When a skill's definition has both `minimum` and `maximum` set, the add-side checkbox renders a numeric input next to it, constrained to that range and defaulting to the minimum. Selecting a leveled skill writes the entry to `worker.attributes.routing.levels[skillName]`; removing the skill drops the level entry alongside it. Skills without min/max are added as plain names with no level entry.
3. **Confirm.** The plugin POSTs to `/features/mass-worker-update/flex/execute-update`. The serverless function seeds a shared Sync Document, then loops through the workers: `check cancel flag → update worker → increment progress → heartbeat`. All admins on the screen subscribe to the doc, so a Progress modal appears with live progress and a Cancel button.

### The shared Sync Document

Uniquely-named (`mass_worker_update_state` by default), stored in the account's Flex Sync service. Its payload:

```json
{
  "inProgress": true,
  "startedBy": "WKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "startedAt": 1751212345678,
  "total": 42,
  "processed": 27,
  "cancelled": false,
  "heartbeatAt": 1751212349012,
  "error": null
}
```

Any admin can:

- **Watch progress.** The plugin subscribes to `updated` events on the doc.
- **Cancel.** The plugin writes `{ ...current, cancelled: true }` directly to the doc. The next iteration of the loop sees the flag and bails.
- **Reset stale state.** If the function times out mid-loop the doc will be stuck at `inProgress: true`. When `heartbeatAt` is older than `stale_heartbeat_ms` (default 20s) the modal switches to a **Reset** affordance that hits `POST /reset-state`, an admin-only endpoint that forces `inProgress: false`.

### Portability

Nothing about the coordination is Twilio-Functions-specific. To move the loop to Cloud Run / Lambda / your own worker:

1. Replace the HTTP handler shell in `execute-update.js`.
2. Replace the `Runtime.getFunctions()` requires with your own module imports.
3. Keep the Twilio Node SDK calls (`client.taskrouter.v1.workspaces(...).workers.list()`, `.workers(sid).update()`) and the `client.sync.services(...).documents(...)` calls verbatim.

The Sync Document unique name, schema, and heartbeat/cancel semantics are the migration contract. The Flex plugin never changes.

## Installation

If you have performed [the recommended steps to deploy the template](/getting-started/install-template), or followed the steps to [deploy from your local machine](/building/deployment/local-deployment), the mass-worker-update feature has already been deployed for you.

## Configuration

Feature settings live in `flex-config/ui_attributes.common.json` under `custom_data.features.mass_worker_update`:

| Field | Default | Purpose |
| --- | --- | --- |
| `enabled` | `false` | Toggles the entire feature (SideNav link and view) on or off. |
| `sync_doc_name` | `mass_worker_update_state` | Unique name of the shared Sync Document. One per environment. |
| `stale_heartbeat_ms` | `20000` | If `inProgress` is true but `heartbeatAt` is older than this, the modal shows Reset instead of Cancel. Bump this if you regularly see false-positive Stale states. |
| `max_workers_per_run` | `100` | Client-side guard against the 15s Function timeout. The UI blocks Confirm if the identified worker count exceeds this. |
| `batch_size` | `5` | How many worker updates the serverless loop fires concurrently via `Promise.allSettled`. Clamped to `[1, 25]` on both sides. `1` = fully sequential. Larger values cut wall-time but coarsen cancel latency (cancel takes effect at the next batch boundary, not the next worker). |

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/features/mass-worker-update/flex/identify-workers` | Runs `workers.list` with the built `targetWorkersExpression` and returns a preview array. Admin-only. |
| POST | `/features/mass-worker-update/flex/execute-update` | Seeds the Sync Document and runs the loop. Admin-only. |
| POST | `/features/mass-worker-update/flex/reset-state` | Force-clears the Sync Document (used when the heartbeat is stale). Admin-only. |

There is **no** dedicated cancel endpoint — Cancel is a direct Sync Document write from the browser. This keeps the cancel path identical when the loop later runs on external compute.
