import {
  DUMMY_NAME_RE,
  buildTwilioClient,
  dummyName,
  loadCredentials,
  loadDummyAttributes,
  parseCount,
  resolveWorkspaceSid,
} from "./common/dummy-workers.mjs";

/**
 * Creates N dummy workers (default 100) named
 * `dummy_worker_<zero-padded-index>` in the Flex TaskRouter workspace, using
 * credentials from flex-config/.env (falling back to serverless-functions/.env
 * for any missing values).
 *
 * Count is taken from the first CLI arg or `--count=N`:
 *   npm run create-dummy-workers -- 1000
 *   npm run create-dummy-workers -- --count=250
 *
 * The available teams, departments, and skills from `flex-config` are spread
 * independently across the created workers (round-robin). Any category with no
 * entries is simply omitted from the worker's attributes.
 *
 * Idempotent-ish: existing dummy workers with the target friendlyName are
 * skipped rather than causing a failure.
 */
const main = async () => {
  const count = parseCount(process.argv.slice(2));
  const { teams, departments, skills } = loadDummyAttributes();
  const credentials = loadCredentials();
  const client = buildTwilioClient(credentials);
  const workspaceSid = await resolveWorkspaceSid(client, credentials.workspaceSid);

  console.log(
    `Creating ${count} dummy worker(s). teams=${teams.length} departments=${departments.length} skills=${skills.length}`,
  );
  if (teams.length === 0) console.log("  → no teams defined; workers will have no team_name");
  if (departments.length === 0) console.log("  → no departments defined; workers will have no department_name");
  if (skills.length === 0) console.log("  → no skills defined; workers will have empty routing.skills");

  const existing = await client.taskrouter.v1
    .workspaces(workspaceSid)
    .workers.list({ limit: Math.max(1000, count * 2) });
  const existingDummyNames = new Set(
    existing.map((w) => w.friendlyName).filter((name) => DUMMY_NAME_RE.test(name)),
  );

  const pick = (list, index) => (list.length === 0 ? undefined : list[index % list.length]);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 1; i <= count; i += 1) {
    const friendlyName = dummyName(i, count);
    if (existingDummyNames.has(friendlyName)) {
      console.log(`skip  ${friendlyName} — already exists`);
      skipped += 1;
      continue;
    }

    const team = pick(teams, i - 1);
    const department = pick(departments, i - 1);
    const skill = pick(skills, i - 1);

    const attributes = {
      full_name: `Dummy Worker ${i}`,
      contact_uri: `client:${friendlyName}`,
      email: `${friendlyName}@example.invalid`,
      roles: ["agent"],
      routing: { skills: skill ? [skill] : [] },
    };
    if (team) attributes.team_name = team;
    if (department) attributes.department_name = department;

    try {
      const worker = await client.taskrouter.v1.workspaces(workspaceSid).workers.create({
        friendlyName,
        attributes: JSON.stringify(attributes),
      });
      created += 1;
      const bits = [team && `team=${team}`, department && `dept=${department}`, skill && `skill=${skill}`]
        .filter(Boolean)
        .join(" ");
      console.log(`ok    ${friendlyName} (${worker.sid})${bits ? "  " + bits : ""}`);
    } catch (error) {
      failed += 1;
      console.error(`fail  ${friendlyName} — ${error.message}`);
    }
  }

  console.log(`\nDone. created=${created}  skipped=${skipped}  failed=${failed}  target=${count}`);
  if (failed > 0) process.exit(1);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
