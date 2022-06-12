import { pull } from "./mod.ts";
import {
  ICreateTrend,
  setupOctokit,
  sleep,
  upload,
} from "https://raw.githubusercontent.com/siral-id/core/main/mod.ts";

const ghToken = Deno.env.get("GH_TOKEN");
const octokit = setupOctokit(ghToken);

const response = await pull();

const uploadWithRetry = async <T>(
  data: T,
  retryCount = 0,
  maxRetry = 60,
  lastError?: string,
): Promise<void> => {
  if (retryCount > maxRetry) throw new Error(lastError);
  try {
    await upload<T>(
      octokit,
      data,
      "WRITE_TRENDS_TOKOPEDIA",
    );
  } catch (error) {
    await sleep(retryCount);
    await uploadWithRetry(data, retryCount + 1, error);
  }
};

await uploadWithRetry<ICreateTrend[]>(response);

Deno.exit();
