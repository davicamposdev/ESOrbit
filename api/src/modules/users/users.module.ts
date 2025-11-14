import { Module } from '@nestjs/common';

import { UsersController } from './presentation/controllers/users.controller';

import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { ListUsersWithCosmeticsUseCase } from './application/use-cases/list-users-with-cosmetics.use-case';

import { UsersRepository } from './infrastructure/repositories/users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: 'IUsersRepository', useClass: UsersRepository },
    UsersRepository,

    GetUserUseCase,
    ListUsersWithCosmeticsUseCase,
  ],
})
export class UsersModule {}
