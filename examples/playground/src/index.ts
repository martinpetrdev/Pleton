import "reflect-metadata";
import {PletonApplication, Application} from "@pleton/core"

@Application
export class Playground extends PletonApplication {
  async run(): Promise<void> {
    console.log("Running playground");
  }
}
