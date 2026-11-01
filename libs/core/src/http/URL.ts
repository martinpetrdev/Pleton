export function joinURLPaths(a: string, b: string) {
  a = fixURLPath(a);
  b = fixURLPath(b);

  if (a === "/") return b;
  if (b === "/") return a;

  return fixURLPath(a + b);
}

export function fixURLPath(a: string) {
  if (!a.startsWith("/")) a = `/${a}`;
  if (a.endsWith("/") && a.length > 1) a = a.substring(0, a.length - 1);

  return a;
}
