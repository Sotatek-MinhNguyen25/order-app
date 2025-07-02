import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { OrderStatus } from "./order.enum";

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  productName: string;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: OrderStatus
  })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
