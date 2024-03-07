import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import api from "../config";

export default async function getRun(threadId: string, runId: string) {
  const res = await api.get(`/thread/${threadId}/run/${runId}`);

  return res.data as Run;
}
