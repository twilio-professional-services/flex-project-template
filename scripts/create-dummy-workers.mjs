import {
  DUMMY_NAME_RE,
  TOTAL_DUMMY_WORKERS,
  buildTwilioClient,
  dummyName,
  loadCredentials,
  loadTeams,
  resolveWorkspaceSid,
} from "./common/dummy-workers.mjs";

/**
 * Creates 100 workers named dummy_001..dummy_100 in the Flex TaskRouter
 * workspace. Teams from flex-config/ui_attributes.common.json are assigned
 * round-robin. Uses credentials from flex-config/.env (falling back to
 * serverless-functions/.env for any missing values).
 *
 * Idempotent-ish: if a worker with the target friendlyName already exists,
 * the script logs and skips it rather than failing.
 */
const main = async () => {
  const credentials = loadCredentials();
  const client = buildTwilioClient(credentials);
  const workspaceSid = await resolveWorkspaceSid(client, credentials.workspaceSid);
  const teams = loadTeams();

  console.log(
    `Creating ${TOTAL_DUMMY_WORKERS} dummy workers across ${teams.length} team(s): ${teams.join(", ")}`,
  );

  // Fetch existing dummy workers up-front so we can skip duplicates without
  // a create-then-error round-trip for each one.
  const existing = await client.taskrouter.v1
    .workspaces(workspaceSid)
    .workers.list({ limit: 1000 });
  const existingDummyNames = new Set(
    existing.map((w) => w.friendlyName).filter((name) => DUMMY_NAME_RE.test(name)),
  );

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 1; i <= TOTAL_DUMMY_WORKERS; i += 1) {
    const friendlyName = dummyName(i);
    if (existingDummyNames.has(friendlyName)) {
      console.log(`skip  ${friendlyName} — already exists`);
      skipped += 1;
      continue;
    }

    const team = teams[(i - 1) % teams.length];
    const attributes = {
      full_name: `Dummy ${String(i).padStart(3, "0")}`,
      contact_uri: `client:${friendlyName}`,
      email: `${friendlyName}@example.invalid`,
      roles: ["agent"],
      team_name: team,
      routing: { skills: [] },
    };

    try {
      const worker = await client.taskrouter.v1.workspaces(workspaceSid).workers.create({
        friendlyName,
        attributes: JSON.stringify(attributes),
      });
      created += 1;
      console.log(`ok    ${friendlyName} (${worker.sid}) team=${team}`);
    } catch (error) {
      failed += 1;
      console.error(`fail  ${friendlyName} — ${error.message}`);
    }
  }

  console.log(`\nDone. created=${created}  skipped=${skipped}  failed=${failed}  target=${TOTAL_DUMMY_WORKERS}`);
  if (failed > 0) process.exit(1);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
