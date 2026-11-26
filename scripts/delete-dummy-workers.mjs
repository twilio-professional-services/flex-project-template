import {
  DUMMY_NAME_RE,
  buildTwilioClient,
  loadCredentials,
  resolveWorkspaceSid,
} from "./common/dummy-workers.mjs";

/**
 * Deletes every TaskRouter Worker whose friendlyName matches the dummy-worker
 * pattern — either `dummy_worker_NNNN` (current form, any digit count) or
 * `dummy_NNN` (legacy form). Non-matching workers are never touched — the
 * regex is the only safeguard. Uses credentials from flex-config/.env
 * (falling back to serverless-functions/.env for any missing values).
 */
const main = async () => {
  const credentials = loadCredentials();
  const client = buildTwilioClient(credentials);
  const workspaceSid = await resolveWorkspaceSid(client, credentials.workspaceSid);

  // `limit` here is the SDK's implicit page-through cap; the Twilio Node SDK
  // will paginate under the hood. Set high so even large dummy runs return in
  // a single call.
  const allWorkers = await client.taskrouter.v1
    .workspaces(workspaceSid)
    .workers.list({ limit: 100000 });
  const targets = allWorkers.filter((w) => DUMMY_NAME_RE.test(w.friendlyName));

  console.log(
    `Found ${targets.length} dummy worker(s) to delete out of ${allWorkers.length} total in workspace ${workspaceSid}.`,
  );
  if (targets.length === 0) return;

  let deleted = 0;
  let failed = 0;

  for (const worker of targets) {
    try {
      await client.taskrouter.v1.workspaces(workspaceSid).workers(worker.sid).remove();
      deleted += 1;
      console.log(`del   ${worker.friendlyName} (${worker.sid})`);
    } catch (error) {
      failed += 1;
      console.error(`fail  ${worker.friendlyName} (${worker.sid}) — ${error.message}`);
    }
  }

  console.log(`\nDone. deleted=${deleted}  failed=${failed}  found=${targets.length}`);
  if (failed > 0) process.exit(1);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
