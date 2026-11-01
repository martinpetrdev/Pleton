import { Reflection } from "../internal";

export const RestPut = (path: string) =>
  Reflection.decorateMethod((set) => {
    set("isRestRoute", true);
    set("restRouteMethod", "put");
    set("restRoutePath", path);
  });
