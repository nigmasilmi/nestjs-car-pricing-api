import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // see if the email is already in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    // hash the password
    // generate salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and pw
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // join the hashed with the salt
    const result = salt + '.' + hash.toString('hex');
    // create new user and save
    const user = await this.usersService.create(email, result);
    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    // find user with email
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // find stored pass
    const storedPass = user.password;
    //split
    const [salt, storedHash] = storedPass.split('.');
    // hash the pass input
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // compare with the splitted part of interest
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
