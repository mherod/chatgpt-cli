import readline from "readline";

interface Input {
  question: string;
  example?: string;
  orDefault?: string;
}

export async function readInput(
  {
    question,
    example = "",
    orDefault = ""
  }: Input
  //
): Promise<string> {
  return new Promise((resolve) => {
    const input = process.stdin;
    const isTTY = input.isTTY;
    if (!isTTY) {
      let answer = "";
      input.on("data", (data) => {
        answer += data;
      });
      input.on("end", () => {
        resolve(answer);
      });
      return;
    }

    const cli = readline.createInterface({
      input: input,
      output: process.stdout
    });
    const prompt = [
      question?.trim(),
      example ? `(e.g. ${example})` : null,
      orDefault ? `(default: ${orDefault})` : null
    ]
      .filter(Boolean)
      .join(" ");
    cli.question(isTTY ? prompt : "", (answer: string) => {
      if (!answer) {
        resolve(orDefault);
      } else {
        resolve(answer);
      }
      cli.close();
    });
  });
}
