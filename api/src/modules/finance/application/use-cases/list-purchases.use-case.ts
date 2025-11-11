import { Injectable, Inject } from '@nestjs/common';
import type { IPurchaseRepository } from '../../domain/repositories';
import { Purchase } from '../../domain/entities';
import { PurchaseStatus } from '../../domain/enums';

export interface ListPurchasesInput {
  userId: string;
  status?: PurchaseStatus;
  limit?: number;
  offset?: number;
}

@Injectable()
export class ListPurchasesUseCase {
  constructor(
    @Inject('IPurchaseRepository')
    private readonly purchaseRepository: IPurchaseRepository,
  ) {}

  async execute(input: ListPurchasesInput): Promise<Purchase[]> {
    return this.purchaseRepository.findByUserId(input.userId, {
      status: input.status,
      limit: input.limit || 50,
      offset: input.offset || 0,
    });
  }
}
