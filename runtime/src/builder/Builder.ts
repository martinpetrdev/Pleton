import * as fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { Project } from "../runtime/Project";
import { build } from "esbuild";

export class Builder {
  static async buildProject(project: Project): Promise<void> {
    const sources = await this.findSourceFiles(project.projectDirPath);

    // Initializer and app go into one bundle
    await this.buildAppPackage(
      this.getBundleSource(sources),
      project.projectDirPath,
      project.projectBuildInitializerPath,
    );
  }

  private static async findSourceFiles(dir: string): Promise<string[]> {
    const entries: Set<string> = new Set();

    for await (const entry of fs.glob("**/*.ts", {
      cwd: dir,
    })) {
      entries.add(entry);
    }

    return [...entries];
  }

  private static getBundleSource(sources: string[]) {
    return `
${sources.map((s, i) => `import * as m${i} from ${JSON.stringify("./" + s)};`).join("\n")}
import { PletonDiscovery } from "@pleton/core";

const APP = { ${sources.map((_, i) => `m${i}`).join(", ")} };
const discovery = new PletonDiscovery(APP);
const AppClass = discovery.appClass();

const app = new AppClass();
app.init();`;
  }

  private static async buildAppPackage(
    bundleSource: string,
    projectDir: string,
    outputPath: string,
  ) {
    await build({
      stdin: {
        contents: bundleSource,
        resolveDir: projectDir,
        loader: "ts",
      },
      outfile: outputPath,
      bundle: true,
      // Bundle @pleton/* (shipped as raw TS), keep other packages external.
      // Externals are pinned to the file resolved from their importer, since
      // deps of inlined @pleton/* packages aren't visible from the project dir.
      plugins: [
        {
          name: "pleton-externals",
          setup(b) {
            b.onResolve({ filter: /^[^./]/ }, async (args) => {
              if (args.path.startsWith("@pleton/") || args.pluginData) {
                return undefined;
              }
              const r = await b.resolve(args.path, {
                kind: args.kind,
                importer: args.importer,
                resolveDir: args.resolveDir,
                pluginData: true,
              });
              return r.errors.length || r.external
                ? { path: args.path, external: true }
                : { path: pathToFileURL(r.path).href, external: true };
            });
          },
        },
      ],
      platform: "node",
      format: "esm",
      sourcemap: true,
    });
  }
}
