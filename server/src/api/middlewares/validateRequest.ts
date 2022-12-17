import { AnySchema, ValidationError } from "joi";
import { NextFunction, Request, Response } from "express";
import { RequestResponse } from "../../utils/response";

export function validateRequest(bodySchema: AnySchema, paramSchema?: AnySchema, querySchema?: AnySchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all([
        bodySchema.validateAsync(req.body, { abortEarly: false }),
        paramSchema?.validateAsync(req.body, { abortEarly: false }),
        querySchema?.validateAsync(req.body, { abortEarly: false }),
      ])
      return next();
    } catch (err) {
      if (err instanceof ValidationError) {
        const formatedErrors = err.details.map(e => ({ path: e.path[0] + "", message: e.message }));
        return RequestResponse.setResponse(res).setStatusCode(422).setReason("Invalid fileds").failure({
          fields: formatedErrors
        });
      }
      return next(err);
    }
  }
}