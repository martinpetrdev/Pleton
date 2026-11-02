import { Class, Reflection } from "../internal";
import { IGuard } from "../types";

export const UseRestGuard = (guard: Class<IGuard, []>) =>
  Reflection.decorateClass((set, get) => {
    const existingGuards =
      (get("restGuards") as Set<Class<IGuard, []>>) ?? new Set();

    existingGuards.add(guard);
    set("restGuards", existingGuards);
  });
