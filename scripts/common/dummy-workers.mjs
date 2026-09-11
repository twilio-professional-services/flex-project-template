import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Twilio from "twilio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

/**
 * Default worker count when the CLI doesn't override it.
 */
export const DEFAULT_DUMMY_COUNT = 100;

/**
 * Matches any dummy worker friendlyName produced by this script — both the
 * current form (`dummy_worker_N...`, any digit count) and the earlier form
 * (`dummy_NNN`) so a delete run cleans up leftover workers from either
 * version. This regex is the ONLY safeguard for the delete script — keep it
 * strict.
 */
export const DUMMY_NAME_RE = /^dummy_(?:worker_)?\d+$/;

/**
 * Zero-padded worker name at the width needed for the requested `count` so
 * that names sort lexically. Example: count=1000 → `dummy_worker_0001`.
 */
export const dummyName = (n, count) => {
  const width = Math.max(3, String(Math.max(1, count)).length);
  return `dummy_worker_${String(n).padStart(width, "0")}`;
};

/**
 * Parses the `count` argv value (positional first arg or `--count=N`).
 * Returns DEFAULT_DUMMY_COUNT when nothing is provided; throws on invalid
 * input so the CLI fails loudly instead of silently creating nothing.
 */
export const parseCount = (argv) => {
  const flag = argv.find((arg) => arg.startsWith("--count="))?.split("=")[1];
  const positional = argv.find((arg) => !arg.startsWith("--"));
  const raw = flag ?? positional;
  if (raw === undefined) return DEFAULT_DUMMY_COUNT;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(
      `Invalid worker count: ${raw}. Pass a positive integer, e.g. \`npm run create-dummy-workers -- 250\`.`,
    );
  }
  return parsed;
};

/**
 * Parses a .env file into a { KEY: VALUE } object. Supports `#` comments,
 * blank lines, `KEY=value` and `KEY="quoted value"`. Missing files return {}.
 */
const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf8");
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
};

/**
 * Loads Twilio credentials + workspace SID. Prefers flex-config/.env (as the
 * user requested), but falls back to serverless-functions/.env for any keys
 * missing there (in practice: TWILIO_FLEX_WORKSPACE_SID, and AUTH_TOKEN if
 * only API keys are present in flex-config).
 */
export const loadCredentials = () => {
  const flexConfigEnv = parseEnvFile(path.join(REPO_ROOT, "flex-config", ".env"));
  const serverlessEnv = parseEnvFile(path.join(REPO_ROOT, "serverless-functions", ".env"));

  const accountSid =
    flexConfigEnv.TWILIO_ACCOUNT_SID ||
    flexConfigEnv.ACCOUNT_SID ||
    serverlessEnv.ACCOUNT_SID;
  const authToken = flexConfigEnv.AUTH_TOKEN || serverlessEnv.AUTH_TOKEN;
  const apiKey = flexConfigEnv.TWILIO_API_KEY;
  const apiSecret = flexConfigEnv.TWILIO_API_SECRET;
  const workspaceSid =
    flexConfigEnv.TWILIO_FLEX_WORKSPACE_SID || serverlessEnv.TWILIO_FLEX_WORKSPACE_SID;

  if (!accountSid) {
    throw new Error(
      "No Twilio account SID found. Set TWILIO_ACCOUNT_SID in flex-config/.env or ACCOUNT_SID in serverless-functions/.env.",
    );
  }
  if (!authToken && !(apiKey && apiSecret)) {
    throw new Error(
      "No Twilio credentials found. Set either AUTH_TOKEN or TWILIO_API_KEY + TWILIO_API_SECRET in flex-config/.env (falling back to serverless-functions/.env).",
    );
  }

  return { accountSid, authToken, apiKey, apiSecret, workspaceSid };
};

/**
 * Builds an authenticated Twilio client. Prefers API key/secret when present
 * (matches flex-config/.env), otherwise account SID + auth token.
 */
export const buildTwilioClient = ({ accountSid, authToken, apiKey, apiSecret }) => {
  if (apiKey && apiSecret) {
    return Twilio(apiKey, apiSecret, { accountSid });
  }
  return Twilio(accountSid, authToken);
};

/**
 * Returns the TaskRouter workspace SID to operate on. Uses the env value if
 * provided; otherwise auto-discovers by listing workspaces and preferring the
 * one named "Flex Task Assignment".
 */
export const resolveWorkspaceSid = async (client, envWorkspaceSid) => {
  if (envWorkspaceSid) return envWorkspaceSid;
  const workspaces = await client.taskrouter.v1.workspaces.list({ limit: 20 });
  if (workspaces.length === 0) throw new Error("No TaskRouter workspaces found on this account.");
  const flexWorkspace = workspaces.find((w) => w.friendlyName === "Flex Task Assignment");
  const chosen = flexWorkspace || workspaces[0];
  console.log(
    `Auto-discovered workspace ${chosen.sid} (${chosen.friendlyName}). Set TWILIO_FLEX_WORKSPACE_SID to skip this lookup.`,
  );
  return chosen.sid;
};

/**
 * Reads the teams, departments, and skills lists that will be spread across
 * the created dummy workers. Each may be empty — the create script treats
 * missing categories by simply not setting that attribute on the worker.
 *
 * - Teams and departments come from `flex-config/ui_attributes.common.json`
 *   under `custom_data.common`.
 * - Skills come from `flex-config/taskrouter_skills.json`.
 */
export const loadDummyAttributes = () => {
  const uiPath = path.join(REPO_ROOT, "flex-config", "ui_attributes.common.json");
  const uiConfig = JSON.parse(fs.readFileSync(uiPath, "utf8"));
  const common = uiConfig?.custom_data?.common ?? {};
  const teams = Array.isArray(common.teams) ? common.teams.filter((s) => typeof s === "string") : [];
  const departments = Array.isArray(common.departments)
    ? common.departments.filter((s) => typeof s === "string")
    : [];

  const skillsPath = path.join(REPO_ROOT, "flex-config", "taskrouter_skills.json");
  let skills = [];
  if (fs.existsSync(skillsPath)) {
    const skillsJson = JSON.parse(fs.readFileSync(skillsPath, "utf8"));
    if (Array.isArray(skillsJson)) {
      skills = skillsJson
        .map((entry) => (entry && typeof entry.name === "string" ? entry.name : null))
        .filter(Boolean);
    }
  }

  return { teams, departments, skills };
};
