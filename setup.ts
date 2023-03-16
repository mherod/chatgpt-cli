import { promises as fs } from "node:fs";
import path from "node:path";
import readline from "readline";
import consola from "consola";

interface Input {
  question: string;
  example?: string;
  orDefault?: string;
}

async function readInput(
  {
    question,
    example = "",
    orDefault = ""
  }: Input
  //
): Promise<string> {
  return new Promise((resolve) => {
    const cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const prompt = [
      question?.trim(),
      example ? `(e.g. ${example})` : null,
      orDefault ? `(default: ${orDefault})` : null
    ]
      .filter(Boolean)
      .join(" ");
    cli.question(prompt + ": ", (answer: string) => {
      if (!answer) {
        resolve(orDefault);
      } else {
        resolve(answer);
      }
      cli.close();
    });
  });
}

async function main() {
  const cwd = process.cwd();
  const basename = path.basename(cwd);
  consola.start(`Setting up ${basename}...`);

  await editJson("package.json", async (json) => {
    const beforeName = json.name;
    const beforeIdeaFile = ".idea/" + beforeName + ".iml";
    const afterIdeaFile = ".idea/" + basename + ".iml";
    if (beforeName !== basename) {
      consola.start(`Renaming ${beforeName} to ${basename}...`);
      await fs.copyFile(beforeIdeaFile, afterIdeaFile);
      await fs.rm(beforeIdeaFile);
      consola.success(`Renamed ${beforeName} to ${basename}`);
    }
    json.name = basename;
    json.author ||= process.env.USER;
    if ("prettier" in json.devDependencies) {
      await editJson(
        ".prettierrc",
        () => {
        }
        //
      );
    }
  });
}

function commandNode(fileName: string) {
  return (fileName.endsWith(".ts") ? `ts-node` : `node`) + " " + fileName;
}

async function readJson(fileName: string) {
  try {
    const packageJson = await fs.readFile(
      path.join(
        __dirname,
        fileName
        //
      ),
      "utf8"
      //
    );
    return JSON.parse(packageJson);
  } catch (e) {
    return {};
  }
}

async function writeJson(fileName: string, json: any) {
  await fs.writeFile(
    path.join(
      __dirname,
      fileName
      //
    ),
    JSON.stringify(json, null, 2),
    "utf8"
    //
  );
}

async function editJson(fileName: string, edit: (json: any) => any) {
  consola.start(`Editing ${fileName}...`);
  try {
    const json = await readJson(fileName);
    edit(json);
    await writeJson(fileName, json);
    consola.success(`Edited ${fileName}`);
  } catch (e) {
    consola.error(`Failed to edit ${fileName}`);
  }
}

main().catch(console.error);
