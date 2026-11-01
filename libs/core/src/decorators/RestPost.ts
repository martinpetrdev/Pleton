import { Reflection } from "../internal";

export const RestPost = (path: string) =>
  Reflection.decorateMethod((set) => {
    set("isRestRoute", true);
    set("restRouteMethod", "post");
    set("restRoutePath", path);
  });
