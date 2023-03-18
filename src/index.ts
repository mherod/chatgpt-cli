#!/usr/bin/env ts-node
"use strict";

import consola from "consola";
import { Command } from "commander";
import { name, version } from "../package.json";
import { openAIApiPromise } from "./whisper";
import destr from "destr";

async function main() {
  const defaultSystemMessage = "Provide concise answers to questions.";
  const defaultPrompt = "Hello world!";
  const command = await new Command()
    .name(name)
    .version(version, "-v, --version", "output the current version")
    .option("-s, --system [system]", "system prompt", defaultSystemMessage)
    .option(
      "-p, --prompt [prompt]",
      "user prompt",
      defaultPrompt
    )
    .option(
      "-t, --temperature [temperature]",
      "Temperature for prompt",
      "0.5"
      //
    )
    .option(
      "-m, --max-tokens [max_tokens]",
      "Max tokens for prompt",
      "100"
      //
    )
    .parseAsync(process.argv);

  const options = command.opts();
  const openAI = await openAIApiPromise;
  const completion = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: options.system || defaultSystemMessage
      },
      {
        role: "user",
        content: options.prompt
      }
    ],
    temperature: destr(options.temperature),
    max_tokens: destr(options.max_tokens) || 100
  });

  const text = completion.data.choices //
    .map((choice) => choice.message) //
    .map((message) => message.content.replace(/\s+/g, " ").trim())
    .join();

  console.log(text);
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
