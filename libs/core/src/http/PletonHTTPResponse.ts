export enum HTTPStatusCode {
  Ok = 200,
  NotFound = 404,
  InternalServerError = 500,
}

const HTTPStatusName: {
  [key in HTTPStatusCode]: string;
} = {
  [HTTPStatusCode.NotFound]: "NOT_FOUND",
  [HTTPStatusCode.Ok]: "OK",
  [HTTPStatusCode.InternalServerError]: "INTERNAL_SERVER_ERROR",
};

export class PletonHTTPResponse<T> {
  constructor(
    public readonly statusCode: number,
    public readonly data: T,
  ) {}

  public get isJSON() {
    return typeof this.data === "object";
  }

  public get isText() {
    return (
      typeof this.data === "string" ||
      typeof this.data === "number" ||
      typeof this.data === "boolean"
    );
  }

  public get isUnknown() {
    return !this.isJSON && !this.isText;
  }
}

export class PletonHTTPError extends Error {
  constructor(
    private readonly _message: string,
    private readonly _statusCode: HTTPStatusCode,
  ) {
    super(_message);
  }

  public get statusCode() {
    return this._statusCode;
  }

  public get response() {
    return new PletonHTTPResponse(this.statusCode, {
      statusCode: this.statusCode,
      error: HTTPStatusName[this.statusCode],
      message: this._message,
    });
  }
}
