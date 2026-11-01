import { Reflection } from "../internal";

export const RestGet = (path: string) =>
  Reflection.decorateMethod((set) => {
    set("isRestRoute", true);
    set("restRouteMethod", "get");
    set("restRoutePath", path);
  });
