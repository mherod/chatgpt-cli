#!/usr/bin/env ts-node
"use strict";

import consola from "consola";
import { Command } from "commander";
import { name, version } from "../package.json";
import { openAIApiPromise } from "./whisper";
import destr from "destr";
import { readInput } from "./readInput";


async function main() {
  const defaultSystemMessage = "Provide concise answers to questions.";
  const defaultPrompt = "Hello world!";
  const defaultTemperature = 0.5;
  const defaultMaxTokens = 150;
  const command = await new Command()
    .name(name)
    .version(version, "-v, --version", "output the current version")
    .option("-s, --system [system]", "system prompt", defaultSystemMessage)
    .option(
      "-p, --prompt [prompt]",
      "user prompt"
    )
    .option(
      "-t, --temperature [temperature]",
      "Temperature for prompt",
      `${defaultTemperature}`
      //
    )
    .option(
      "-m, --max-tokens [max_tokens]",
      "Max tokens for prompt",
      `${defaultMaxTokens}`
      //
    )
    .parseAsync(process.argv);

  const options = command.opts();
  const openAI = await openAIApiPromise;
  const userMessage = options.prompt || (await readInput({
    question: "Prompt: ",
    example: defaultPrompt,
    orDefault: defaultPrompt
  }));
  const completion = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: options.system || defaultSystemMessage
      },
      {
        role: "user",
        content: userMessage || defaultPrompt
      }
    ],
    temperature: destr(options.temperature) || defaultTemperature,
    max_tokens: destr(options.max_tokens) || defaultMaxTokens
  });

  const text = completion.data.choices //
    .map((choice) => choice.message) //
    .map((message) => message.content.trim())
    // .map((message) => message.content.replace(/\s+/g, " ").trim())
    .join("\n");

  console.log(text);
}

main().catch((error) => {
  consola.error(error);
  process.exit(1);
});
