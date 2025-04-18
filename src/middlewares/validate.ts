import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";

type Location = "body" | "query" | "params";

export const validate = (schema: ZodSchema, location: Location = "body"): RequestHandler => {
  return (req, res, next) => {
    try {
      req[location] = schema.parse(req[location]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next({
          status: 400,
          message: "Ошибка валидации",
          errors: error.flatten()
        });
      }
      next(error);
    }
  };
};
