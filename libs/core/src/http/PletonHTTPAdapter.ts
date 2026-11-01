export abstract class PletonHTTPAdapter {
  abstract listen(port: number): Promise<void>;
}
