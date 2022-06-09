import { ICreateTrend, pull, serializeResponse, setupOctokit, upload } from "./mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");
const octokit = setupOctokit(ghToken);

const response = await pull();

const serializedData = serializeResponse(response);

await upload<ICreateTrend[]>(octokit, serializedData, "WRITE_TOKOPEDIA_TRENDS");

Deno.exit();
