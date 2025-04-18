import { z } from "zod";

export class AppealSchemas {
    static create = z.object({
        title: z.string().min(1, "Заголовок обязателен"),
        message: z.string().min(1, "Сообщение обязательно"),
    });

    static complete = z.object({
        resolutionText: z.string().min(1, "Решение обязательно"),
    });

    static cancel = z.object({
        reason: z.string().min(1, "Причина отмены обязательна"),
    });

    static idParam = z.object({
        id: z.string().regex(/^\d+$/, "ID должен быть числом"),
    });

    static query = z.object({
        date: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
    });
}
