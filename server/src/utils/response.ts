import { Request, Response } from 'express';
import { ServerError } from "./errors"

class RequestResponseClass {
  response?: Response;
  request?: Request;
  statusCode?: number;
  reason?: string;
  data: any;

  setResponse(res: Response) {
    this.response = res;
    return this;
  }

  setRequest(req: Request) {
    this.request = req;
    return this;
  }

  setStatusCode(code: number) {
    this.statusCode = code;
    return this;
  }

  setReason(reason: string) {
    this.reason = reason;
    return this;
  }

  setData<T = any>(data: T) {
    this.data = data;
    return this;
  }

  success(options?: any) {
    if (!this.response) throw new ServerError(500, "Response must be set");
    if (!this.statusCode) throw new ServerError(500, "Status Code must be set");
    if (!this.data) throw new ServerError(500, "Data must be set");
    return this.response.status(this.statusCode).json({
      success: true,
      result: this.data,
      ...options
    })
  }

  failure(options?: any) {
    if (!this.response) throw new ServerError(500, "Response must be set");
    if (!this.statusCode) throw new ServerError(500, "Status Code must be set");
    if (!this.reason) throw new ServerError(500, "Reason must be set");
    return this.response.status(this.statusCode).json({
      success: false,
      error: this.reason,
      ...options
    })
  }
}

export const RequestResponse = new RequestResponseClass();