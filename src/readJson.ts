import { promises as fsAsync } from "fs";
import destr from "destr";

export async function readJson(keyPath: string): Promise<any> {
  const raw = await fsAsync.readFile(keyPath, "utf8");
  return destr(raw) as any;
}
