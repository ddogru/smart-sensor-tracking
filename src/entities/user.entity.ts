// src/entities/user.entity.ts
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from './base';
import { Role } from './role.entity'; // Import the Role entity
import * as bcrypt from 'bcryptjs';

@Entity('user')
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('varchar', { nullable: false, unique: true })
  email: string;

  @Column('varchar', { nullable: false })
  password: string;

  @ManyToOne(() => Role, (role) => role.id, { eager: true })
  role: Role; // Reference to the Role entity

  // Hash password before saving
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10); // Salting password with bcrypt
  }

  // Hash password before updating
  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    // Only hash the password if it has been modified and isn't already hashed
    if (this.password && !this.isPasswordHashed(this.password)) {
      this.password = await bcrypt.hash(this.password, 10); // 10 refers to the salt rounds used by bcrypt
    }
  }

  // Helper method to check if a password is already hashed
  public isPasswordHashed(password: string): boolean {
    return password.startsWith('$2a$'); // bcrypt hashed passwords start with '$2a$'
  }
}
