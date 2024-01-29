import { isLocal } from "@/lib/utils";
import api from "../config";
import { Thread } from "@/context/messages";

export default async function getThread(id: string): Promise<Thread> {
  const res = await api.get("/thread/" + id);

  isLocal && console.log(res.data);

  return res.data;
}
