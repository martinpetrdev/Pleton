import { Reflection } from "../internal";

export const Injectable = Reflection.decorateClass((set) => {
  set("isInjectable", true);
});
