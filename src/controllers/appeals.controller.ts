import { Request, Response } from "express";
import { AppealsService } from "../services/appeals.service";

const appealsService = new AppealsService();

export class AppealsControllers {

    async createAppeal(req: Request, res: Response) {
        try {
            const { title, message } = req.body;
            const result = await appealsService.createAppeal(title, message);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: "Ошибка при создании обращения" });
        }
    };

    async setInProgress(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const result = await appealsService.setInProgress(id);
            res.json(result);
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message || "Ошибка при обновлении статуса" });
        }
    };

    async completeAppeal(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { resolutionText } = req.body;
            const result = await appealsService.completeAppeal(id, resolutionText);
            res.json(result);
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message || "Ошибка при обновлении статуса" });
        }
    }

    async cancelAppeals(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const { reason } = req.body;
            const result = await appealsService.cancelAppeals(id, reason);
            res.json(result);
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message || "Ошибка при обновлении статуса" });
        }
    }

    async getAppeals(req: Request, res: Response) {
        try {
            const { date, from, to } = req.query;
            const result = await appealsService.getAppeals(
                date as string | undefined,
                from as string | undefined,
                to as string | undefined
            );
            res.json(result);
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message || "Ошибка при обновлении статуса" });
        }
    }

    async cancelAllInProgress(_: Request, res: Response) {
        try {
            const result = await appealsService.cancelAllInProgress();
            res.json(result);
        } catch (error) {
            const err = error as Error;
            res.status(404).json({ error: err.message || "Ошибка при обновлении статуса" });
        }
    }


}