import { PletonHTTPAdapter } from "./PletonHTTPAdapter";

export class PletonHTTP {
  private _adapter: PletonHTTPAdapter | null = null;

  constructor() {}

  public useAdapter(adapter: PletonHTTPAdapter) {
    this._adapter = adapter;
  }

  private get adapter() {
    if (!this._adapter)
      throw new Error("No adapter set, please call this.http.useAdapter(...);");

    return this._adapter;
  }

  public async listen(port: number): Promise<void> {
    await this.adapter.listen(port);
  }
}
