import { Reflection } from "../internal";
import { RouteContext } from "../http";

export const RestQuery = (key: string) =>
  Reflection.decorateParameter((set) => {
    set("resolve", (ctx: RouteContext) => ctx.query[key]);
  });
