import { Between } from "typeorm";
import { AppDataSource } from "../database.config";
import { Appeals, AppealsStatus } from "../entities/appeals.entity";

const appealsRepository = AppDataSource.getRepository(Appeals);

export class AppealsService {
  async createAppeal(title: string, message: string) {
    try {
      const appeal = appealsRepository.create({ title, message });
      return await appealsRepository.save(appeal);
    } catch (error) {
      console.error("Ошибка в создании:", error);
      throw error;
    }
  }

  async setInProgress(id: number) {
    try {
      const appeal = await appealsRepository.findOneBy({ id });
      if (!appeal) throw new Error("Обращение не найдено");
      appeal.status = AppealsStatus.IN_PROGRESS;
      return await appealsRepository.save(appeal);
    } catch (error) {
      console.error("Ошибка в изменнении статуса(в процессеэ)", error);
      throw error;
    }
  }

  async completeAppeal(id: number, resolutionText: string) {
    try {
      const appeal = await appealsRepository.findOneBy({ id });
      if (!appeal) throw new Error("Обращение не найдено");
      appeal.status = AppealsStatus.COMPLETED;
      appeal.resolutionText = resolutionText;
      return await appealsRepository.save(appeal);
    } catch (error) {
      console.error("Ошибка в изменнении статуса(в выполено)", error);
      throw error;
    }
  }

  async cancelAppeals(id: number, reason: string) {
    try {
      const appeal = await appealsRepository.findOneBy({ id });
      if (!appeal) throw new Error("Обращение не найдено");
      appeal.status = AppealsStatus.CANCELED;
      appeal.cancelReason = reason
      return await appealsRepository.save(appeal);
    } catch (error) {
      console.error("Ошибка в изменнении статуса(в отмена)", error);
      throw error;
    }
  }

  async getAppeals(date?: string, from?: string, to?: string) {
    let where: any = {};
    try {
        if (date) {
          const startDate = new Date(date);
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 1);
          where.createdAt = Between(startDate, endDate);
        } else if (from && to) {
          where.createdAt = Between(new Date(from), new Date(to));
        }
        return await appealsRepository.find({ where });
    } catch (error) {
      console.error("Ошибка в вывод всего (фильтр)", error);
      throw error;
    }
  }

  async cancelAllInProgress() {
    try {
      const appeals = await appealsRepository.findBy({ status: AppealsStatus.IN_PROGRESS });
      if (!appeals) throw new Error("Обращение не найдено");
      for (const appeal of appeals) {
        appeal.status = AppealsStatus.CANCELED;
        appeal.cancelReason = "Отмена всех в процессе";
      }
      await appealsRepository.save(appeals);
      return appeals.length;
    } catch (error) {
      console.error("Ошибка в изменнении статуса(в отмена)", error);
      throw error;
    }
  }

}
