import { Reflection } from "../internal";

export const Version = (version: string) =>
  Reflection.decorateClass((set) => {
    set("version", version);
  });
