import { Reflection } from "../internal";
import { RouteContext } from "../http";

export const RestFormDataBody = (key?: string) =>
  Reflection.decorateParameter((set) => {
    set("resolve", async (ctx: RouteContext) => {
      const body = await ctx.body.getFormData();

      return key ? body.get(key) : body;
    });
  });
