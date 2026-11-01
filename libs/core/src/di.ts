import {
  Class,
  ClassInstance,
  DependencyType,
  PletonDIContainer,
} from "./internal";

export function inject<C extends Class<unknown, []>>(type: C) {
  const dep = PletonDIContainer.instance.get(DependencyType.Injectable, type);
  if (!dep) throw new Error(`Could not find dependency ${type.name}`);

  return dep;
}
