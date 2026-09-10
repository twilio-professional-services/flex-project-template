import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Twilio from "twilio";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

/** Names for created dummy workers: dummy_001 .. dummy_100. */
export const TOTAL_DUMMY_WORKERS = 100;
export const DUMMY_NAME_RE = /^dummy_\d{3}$/;
export const dummyName = (n) => `dummy_${String(n).padStart(3, "0")}`;

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
 * Reads the teams list from flex-config/ui_attributes.common.json.
 */
export const loadTeams = () => {
  const configPath = path.join(REPO_ROOT, "flex-config", "ui_attributes.common.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const teams = config?.custom_data?.common?.teams;
  if (!Array.isArray(teams) || teams.length === 0) {
    throw new Error("No teams found under custom_data.common.teams in flex-config/ui_attributes.common.json.");
  }
  return teams;
};
