import { Injectable, Inject } from '@nestjs/common';
import type { ITransferRepository } from '../../domain/repositories';
import { Transfer } from '../../domain/entities';
import { TransferStatus } from '../../domain/enums';

export interface ListTransfersInput {
  userId: string;
  direction?: 'sent' | 'received' | 'all';
  status?: TransferStatus;
  limit?: number;
  offset?: number;
}

@Injectable()
export class ListTransfersUseCase {
  constructor(
    @Inject('ITransferRepository')
    private readonly transferRepository: ITransferRepository,
  ) {}

  async execute(input: ListTransfersInput): Promise<Transfer[]> {
    return this.transferRepository.findByUserId(input.userId, {
      direction: input.direction || 'all',
      status: input.status,
      limit: input.limit || 50,
      offset: input.offset || 0,
    });
  }
}
