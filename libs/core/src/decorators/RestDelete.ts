import { Reflection } from "../internal";

export const RestDelete = (path: string) =>
  Reflection.decorateMethod((set) => {
    set("isRestRoute", true);
    set("restRouteMethod", "delete");
    set("restRoutePath", path);
  });
