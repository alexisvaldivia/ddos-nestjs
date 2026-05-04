import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  create() {
    return 'This action adds a new login';
  }

  findAll() {
    return `This action returns all login`;
  }

  findOne() {
    return `This action returns a login`;
  }

  update() {
    return `This action updates a login`;
  }

  remove() {
    return `This action removes a login`;
  }
}
