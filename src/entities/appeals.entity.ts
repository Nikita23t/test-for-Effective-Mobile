import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from "typeorm";

export enum AppealsStatus {
  NEW = "Новое",
  IN_PROGRESS = "В работе",
  COMPLETED = "Завершено",
  CANCELED = "Отменено",
}

@Entity()
export class Appeals {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({
    type: "enum",
    enum: AppealsStatus,
    default: AppealsStatus.NEW,
  })
  status: AppealsStatus;

  @Column({ nullable: true })
  resolutionText: string;

  @Column({ nullable: true })
  cancelReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
