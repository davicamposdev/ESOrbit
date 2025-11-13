import { Controller, Get, Param } from '@nestjs/common';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { ListUsersWithCosmeticsUseCase } from '../../application/use-cases/list-users-with-cosmetics.use-case';
import { Public } from '../../../auth/presentation/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly getUserUseCase: GetUserUseCase,
    private readonly listUsersWithCosmeticsUseCase: ListUsersWithCosmeticsUseCase,
  ) {}

  @Public()
  @Get()
  async findAllWithCosmetics() {
    const users = await this.listUsersWithCosmeticsUseCase.execute();
    return { users };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.getUserUseCase.execute(id);
    return { user };
  }
}
