import { Controller, Get, Param } from '@nestjs/common';
import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';

@Controller('users')
export class UsersController {
  constructor(private readonly getUserUseCase: GetUserUseCase) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.getUserUseCase.execute(id);
    return { user };
  }
}
