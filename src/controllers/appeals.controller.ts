import { Request, Response } from "express";
import { AppealsService } from "../services/appeals.service";
import { AppealSchemas } from "../schemas/appeals.schema";

const appealsService = new AppealsService();

export class AppealsControllers {
    async createAppeal(req: Request, res: Response): Promise<void> {
        try {
            const { title, message } = AppealSchemas.create.parse(req.body);
            const result = await appealsService.createAppeal(title, message);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "Некорректные данные" });
        }
    }

    async setInProgress(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw new Error("Некорректный ID");
            const result = await appealsService.setInProgress(id);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async completeAppeal(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { resolutionText } = AppealSchemas.complete.parse(req.body);
            const result = await appealsService.completeAppeal(id, resolutionText);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async cancelAppeals(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { reason } = AppealSchemas.cancel.parse(req.body);
            const result = await appealsService.cancelAppeals(id, reason);
            res.json(result);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    }

    async getAppeals(req: Request, res: Response): Promise<void> {
        try {
            const { date, from, to } = AppealSchemas.query.parse(req.query);
            const result = await appealsService.getAppeals(date, from, to);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при получении обращений" });
        }
    }

    async cancelAllInProgress(_: Request, res: Response): Promise<void> {
        try {
            const result = await appealsService.cancelAllInProgress();
            res.json({ canceled: result });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}
