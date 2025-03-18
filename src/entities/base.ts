import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class Base {
  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
