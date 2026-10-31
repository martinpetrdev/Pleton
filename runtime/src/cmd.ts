#!/usr/bin/env node

import { Runtime } from "./runtime/Runtime";
import { Project } from "./runtime/Project";

void new Runtime(new Project(process.cwd())).run();
