import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async saveToken(userId: number, token: string): Promise<void> {
    await this.userRepository.update(userId, { token });
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.update(userId, { token: null });
  }

  async findUserByToken(token: string): Promise<User | null> {
    return this.userRepository.findOneBy({ token });
  }
  async findUser(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }
}
