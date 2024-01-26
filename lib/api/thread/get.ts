import { isLocal } from "@/lib/utils";
import api from "../config";

export default async function getThread(id: string) {
  const res = await api.get("/thread/" + id);

  isLocal && console.log(res.data);

  return res.data;
}
