import { Between } from "typeorm";
import { AppDataSource } from "../database.config";
import { Appeals, AppealsStatus } from "../entities/appeals.entity";

export class AppealsService {
  private appealsRepository = AppDataSource.getRepository(Appeals);

  createAppeal(title: string, message: string) {
    const appeal = this.appealsRepository.create({ title, message });
    return this.appealsRepository.save(appeal);
  }

  async setInProgress(id: number) {
    const appeal = await this.appealsRepository.findOneBy({ id });
    if (!appeal) throw new Error("Обращение не найдено");
    appeal.status = AppealsStatus.IN_PROGRESS;
    return this.appealsRepository.save(appeal);
  }

  async completeAppeal(id: number, resolutionText: string) {
    const appeal = await this.appealsRepository.findOneBy({ id });
    if (!appeal) throw new Error("Обращение не найдено");
    appeal.status = AppealsStatus.COMPLETED;
    appeal.resolutionText = resolutionText;
    return this.appealsRepository.save(appeal);
  }

  async cancelAppeals(id: number, reason: string) {
    const appeal = await this.appealsRepository.findOneBy({ id });
    if (!appeal) throw new Error("Обращение не найдено");
    appeal.status = AppealsStatus.CANCELED;
    appeal.cancelReason = reason;
    return this.appealsRepository.save(appeal);
  }

  async getAppeals(date?: string, from?: string, to?: string) {
    const where: Record<string, any> = {};
    if (date) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(start.getDate() + 1);
      where.createdAt = Between(start, end);
    } else if (from && to) {
      where.createdAt = Between(new Date(from), new Date(to));
    }
    return this.appealsRepository.find({ where });
  }

  async cancelAllInProgress() {
    const appeals = await this.appealsRepository.findBy({ status: AppealsStatus.IN_PROGRESS });
    if (!appeals.length) throw new Error("Нет обращений в процессе");
    const updated = appeals.map(a => {
      a.status = AppealsStatus.CANCELED;
      a.cancelReason = "Отменено администратором";
      return a;
    });
    await this.appealsRepository.save(updated);
    return updated.length;
  }
}
