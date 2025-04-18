import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    status?: number;
    errors?: any;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`[ERROR] ${req.method} ${req.url}`, err);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        message: err.message || "Ошибка сервера",
        errors: err.errors || null,
    });
};
