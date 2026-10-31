import { Project } from "./Project";
import { Builder } from "../builder/Builder";
import * as cp from "node:child_process";
import * as process from "node:process";

export class Runtime {
  constructor(private readonly _project: Project) {}

  public async run(): Promise<void> {
    await this._project.prepareBuild();
    await this.build();

    const proc = cp.spawn(
      process.execPath,
      [this._project.projectBuildInitializerPath],
      {
        cwd: this._project.projectBuildDir,
        stdio: ["inherit", "inherit", "inherit"],
      },
    );

    proc.on("exit", (code) => {
      process.exit(code);
    });
  }

  public async build(): Promise<void> {
    await Builder.buildProject(this._project);
  }
}
