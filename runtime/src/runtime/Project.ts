import * as path from "node:path";
import * as fs from "fs/promises";

export class Project {
  constructor(private readonly _dirPath: string) {}

  public get projectDirPath() {
    return path.resolve(process.cwd(), this._dirPath);
  }

  public get projectBuildDir() {
    return path.join(this.projectDirPath, "build");
  }

  public get projectBuildInitializerPath() {
    return path.join(this.projectDirPath, "build/initializer.mjs");
  }

  public async prepareBuild(): Promise<void> {
    await fs
      .rm(this.projectBuildDir, {
        recursive: true,
        force: true,
      })
      .catch(() => {});

    await fs.mkdir(this.projectBuildDir);
  }
}
