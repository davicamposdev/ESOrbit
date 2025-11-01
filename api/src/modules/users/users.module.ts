import { Module } from '@nestjs/common';

// Presentation
import { UsersController } from './presentation/controllers/users.controller';

// Application
import { GetUserUseCase } from './application/use-cases/get-user.use-case';

// Infrastructure
import { UsersRepository } from './infrastructure/repositories/users.repository';

@Module({
  controllers: [UsersController],
  providers: [
    // Repositories
    { provide: 'IUsersRepository', useClass: UsersRepository },
    UsersRepository,

    // Use Cases
    GetUserUseCase,
  ],
})
export class UsersModule {}
