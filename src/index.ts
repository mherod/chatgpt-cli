#!/usr/bin/env ts-node
"use strict";

import consola from "consola";
import { Command, Option } from "commander";
import { name, version } from "../package.json";

new Command()
  .name(name)
  .version(version, "-v, --version", "output the current version")
  .addOption(
    new Option("-i, --input [input]", "set input").default("default")
    //
  )
  .parseAsync(process.argv)
  .then(
    (command) => {
      consola.info("Command:", command);
    },
    (err) => {
      consola.error(err);
      process.exit(1);
    }
    //
  );
