import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private _repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this._repo.create({ email, password });
    return this._repo.save(user);
  }

  find(email: string) {
    return this._repo.find({ email });
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this._repo.findOne(id);
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return this._repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this._repo.remove(user);
  }
}
