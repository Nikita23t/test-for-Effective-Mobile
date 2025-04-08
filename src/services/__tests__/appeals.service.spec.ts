import { AppDataSource } from "../../database.config";
import { AppealsStatus } from "../../entities/appeals.entity";
import { AppealsService } from "../appeals.service";

jest.mock("../../database.config", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  findBy: jest.fn(),
};

describe("AppealsService", () => {
  let service: AppealsService;

  beforeEach(() => {
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
    service = new AppealsService();
    jest.clearAllMocks();
  });

  it("должен создать обращение", async () => {
    const appealData = { title: "Test", message: "Hello" };
    const savedAppeal = { ...appealData, id: 1 };
    mockRepository.create.mockReturnValue(appealData);
    mockRepository.save.mockResolvedValue(savedAppeal);

    const result = await service.createAppeal("Test", "Hello");

    expect(result).toEqual(savedAppeal);
    expect(mockRepository.create).toHaveBeenCalledWith(appealData);
    expect(mockRepository.save).toHaveBeenCalledWith(appealData);
  });

  it("должен установить статус обращения как IN_PROGRESS", async () => {
    const appeal = { id: 1, status: AppealsStatus.NEW };
    mockRepository.findOneBy.mockResolvedValue(appeal);
    mockRepository.save.mockResolvedValue({ ...appeal, status: AppealsStatus.IN_PROGRESS });

    const result = await service.setInProgress(1);
    expect(result.status).toBe(AppealsStatus.IN_PROGRESS);
  });

  it("должен завершить обращение", async () => {
    const appeal = { id: 1, status: AppealsStatus.NEW };
    mockRepository.findOneBy.mockResolvedValue(appeal);
    mockRepository.save.mockResolvedValue({ ...appeal, status: AppealsStatus.COMPLETED, resolutionText: "Resolved" });

    const result = await service.completeAppeal(1, "Resolved");
    expect(result.status).toBe(AppealsStatus.COMPLETED);
    expect(result.resolutionText).toBe("Resolved");
  });

  it("должен отменить обращение", async () => {
    const appeal = { id: 1, status: AppealsStatus.NEW };
    mockRepository.findOneBy.mockResolvedValue(appeal);
    mockRepository.save.mockResolvedValue({ ...appeal, status: AppealsStatus.CANCELED, cancelReason: "No reason" });

    const result = await service.cancelAppeals(1, "No reason");
    expect(result.status).toBe(AppealsStatus.CANCELED);
    expect(result.cancelReason).toBe("No reason");
  });

  it("должен вернуть обращения по дате", async () => {
    const date = "2025-04-01";
    const mockAppeals = [{ id: 1 }, { id: 2 }];
    mockRepository.find.mockResolvedValue(mockAppeals);

    const result = await service.getAppeals(date);
    expect(result).toEqual(mockAppeals);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it("должен отменить все обращения в процессе", async () => {
    const appeals = [
      { id: 1, status: AppealsStatus.IN_PROGRESS },
      { id: 2, status: AppealsStatus.IN_PROGRESS },
    ];
    mockRepository.findBy.mockResolvedValue(appeals);
    mockRepository.save.mockResolvedValue(appeals);

    const result = await service.cancelAllInProgress();
    expect(result).toBe(2);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Array));
  });

  it("должен успешно отменить все обращения в процессе", async () => {
    const appeals = [
      { id: 1, status: AppealsStatus.IN_PROGRESS },
      { id: 2, status: AppealsStatus.IN_PROGRESS },
    ];
    mockRepository.findBy.mockResolvedValue(appeals);
    mockRepository.save.mockResolvedValue(appeals);

    const result = await service.cancelAllInProgress();
    expect(result).toBe(2);
    expect(mockRepository.save).toHaveBeenCalledWith(appeals);
  });


  
  it("должен выбросить ошибку, если обращение не найдено", async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(service.setInProgress(1)).rejects.toThrow("Обращение не найдено");
  });

  it("должен выбросить ошибку при завершении несуществующего обращения", async () => {
    mockRepository.findOneBy.mockResolvedValue(null);
    await expect(service.completeAppeal(1, "Resolved")).rejects.toThrow("Обращение не найдено");
  });

  it("должен выбросить ошибку при отмене несуществующего обращения", async () => {
    mockRepository.findOneBy.mockResolvedValue(null);
    await expect(service.cancelAppeals(1, "No reason")).rejects.toThrow("Обращение не найдено");
  });

  it("должен выбросить ошибку при отмене всех обращений, если их нет", async () => {
    mockRepository.findBy.mockResolvedValue([]);
    await expect(service.cancelAllInProgress()).rejects.toThrow("Обращения не найдены");
  });

});
