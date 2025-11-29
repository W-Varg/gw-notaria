import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';

import { PrismaPg } from '@prisma/adapter-pg'; // Driver Adapter for Postgres

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    super({ adapter: pool, omit: { usuario: { password: true } } });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
