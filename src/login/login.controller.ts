import { Controller, Post, Get, Patch, Delete } from '@nestjs/common';
import { LoginService } from './login.service';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { ttl: 60000, limit: 5 } })
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  create() {
    return this.loginService.create();
  }

  @Get()
  findAll() {
    return this.loginService.findAll();
  }

  @Get(':id')
  findOne() {
    return this.loginService.findOne();
  }

  @Patch(':id')
  update() {
    return this.loginService.update();
  }

  @Delete(':id')
  remove() {
    return this.loginService.remove();
  }
}
