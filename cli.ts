import { fetch, serializeResponse, setupOctokit, upload } from "./mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");
const octokit = setupOctokit(ghToken);

const response = await fetch();

const serializedData = serializeResponse(response);

await upload(octokit, serializedData);

Deno.exit();
