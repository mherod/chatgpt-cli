// noinspection SpellCheckingInspection

import { OpenAIApi } from "openai";
import { getOpenAIApi } from "./getOpenAIApi";

export type OpenAI = OpenAIApi;

export const openAIApiPromise: Promise<OpenAI> = getOpenAIApi();
