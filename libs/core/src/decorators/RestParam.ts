import { Reflection } from "../internal";
import { RouteContext } from "../http";

export const RestParam = (key: string) =>
  Reflection.decorateParameter((set) => {
    set("resolve", (ctx: RouteContext) => ctx.params[key]);
  });
