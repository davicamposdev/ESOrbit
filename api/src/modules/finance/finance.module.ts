import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/database/prisma.module';

import {
  PrismaTransactionRepository,
  PrismaPurchaseRepository,
  PrismaReturnRepository,
  PrismaTransferRepository,
} from './infrastructure/repositories';

import {
  PurchaseCosmeticUseCase,
  PurchaseBundleUseCase,
  ReturnCosmeticUseCase,
  TransferCreditsUseCase,
  ListPurchasesUseCase,
  ListTransfersUseCase,
} from './application/use-cases';

import { FinanceController } from './presentation/controllers';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceController],
  providers: [
    {
      provide: 'ITransactionRepository',
      useClass: PrismaTransactionRepository,
    },
    {
      provide: 'IPurchaseRepository',
      useClass: PrismaPurchaseRepository,
    },
    {
      provide: 'IReturnRepository',
      useClass: PrismaReturnRepository,
    },
    {
      provide: 'ITransferRepository',
      useClass: PrismaTransferRepository,
    },

    PurchaseCosmeticUseCase,
    PurchaseBundleUseCase,
    ReturnCosmeticUseCase,
    TransferCreditsUseCase,
    ListPurchasesUseCase,
    ListTransfersUseCase,
  ],
  exports: [
    PurchaseCosmeticUseCase,
    PurchaseBundleUseCase,
    ReturnCosmeticUseCase,
    TransferCreditsUseCase,
    ListPurchasesUseCase,
    ListTransfersUseCase,
  ],
})
export class FinanceModule {}
