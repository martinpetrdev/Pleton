import { Reflection } from "../internal";

export const RestPatch = (path: string) =>
  Reflection.decorateMethod((set) => {
    set("isRestRoute", true);
    set("restRouteMethod", "patch");
    set("restRoutePath", path);
  });
