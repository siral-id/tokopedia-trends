import { pull } from "./mod.ts";
import {
  ICreateTrend,
  setupOctokit,
  upload,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");
const octokit = setupOctokit(ghToken);

const response = await pull();

await upload<ICreateTrend[]>(octokit, response, "WRITE_TOKOPEDIA_TRENDS");

Deno.exit();
