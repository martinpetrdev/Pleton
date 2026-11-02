export enum HTTPStatusCode {
  Ok = 200,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

const HTTPStatusName: {
  [key in HTTPStatusCode]: string;
} = {
  [HTTPStatusCode.Ok]: "OK",
  [HTTPStatusCode.Unauthorized]: "UNAUTHORIZED",
  [HTTPStatusCode.Forbidden]: "FORBIDDEN",
  [HTTPStatusCode.NotFound]: "NOT_FOUND",
  [HTTPStatusCode.InternalServerError]: "INTERNAL_SERVER_ERROR",
};

export class PletonHTTPResponse<T> {
  constructor(
    public readonly statusCode: number,
    public readonly data: T,
    public readonly type?: "html",
  ) {}

  public get isHTML() {
    return this.type === "html";
  }

  public get isJSON() {
    return !this.type && typeof this.data === "object";
  }

  public get isText() {
    return (
      !this.type &&
      (typeof this.data === "string" ||
        typeof this.data === "number" ||
        typeof this.data === "boolean")
    );
  }

  public get isUnknown() {
    return !this.isJSON && !this.isText && !this.isHTML;
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

export class OkResponse<T> extends PletonHTTPResponse<T> {
  constructor(data: T, type?: "html") {
    super(HTTPStatusCode.Ok, data, type);
  }
}
