import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { LoginService } from './login.service';
import { Throttle } from '@nestjs/throttler';

type TBody = {
  password: string;
};

const ipRecords = new Map<
  string | undefined,
  {
    attempts: number;
    blockedUntil: number | null;
  }
>();

@Throttle({ default: { ttl: 60000, limit: 5 } })
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  create(@Body() body: TBody, @Req() req: Request) {
    const ip = req.ip;
    const now = Date.now();

    // Validar que body existe
    if (!body || !body.password) {
      throw new HttpException('Password requerido', HttpStatus.BAD_REQUEST);
    }

    const record = ipRecords.get(ip) ?? {
      attempts: 0,
      blockedUntil: 0,
    };

    // Si el bloqueo persiste, se manda un msj
    if (record.blockedUntil && record.blockedUntil > now) {
      const retryIn = (record.blockedUntil - now) / 1000;
      throw new HttpException(
        {
          msg: 'IP Bloqueada',
          retry: `Intente en ${retryIn.toFixed(0)} segundos.`,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (record.blockedUntil && now >= record.blockedUntil) {
      record.blockedUntil = null;
    }

    const isValid = body.password === 'asereje';

    if (!isValid) {
      record.attempts += 1;

      if (record.attempts > 3) {
        record.blockedUntil = now + 12000;
        ipRecords.set(ip, record);
        throw new HttpException(
          'IP Bloqueada 120 segundos',
          HttpStatus.FORBIDDEN,
        );
      }

      ipRecords.set(ip, record);
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    ipRecords.delete(ip);
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
