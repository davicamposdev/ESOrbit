import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/database/prisma.module';

// Infrastructure - Repositories
import {
  PrismaTransactionRepository,
  PrismaPurchaseRepository,
  PrismaReturnRepository,
  PrismaTransferRepository,
} from './infrastructure/repositories';

// Application - Use Cases
import {
  PurchaseCosmeticUseCase,
  PurchaseBundleUseCase,
  ReturnCosmeticUseCase,
  TransferCreditsUseCase,
  ListPurchasesUseCase,
  ListTransfersUseCase,
} from './application/use-cases';

// Presentation - Controllers
import { FinanceController } from './presentation/controllers';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceController],
  providers: [
    // Repositories
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

    // Use Cases
    PurchaseCosmeticUseCase,
    PurchaseBundleUseCase,
    ReturnCosmeticUseCase,
    TransferCreditsUseCase,
    ListPurchasesUseCase,
    ListTransfersUseCase,
  ],
  exports: [
    // Exporta os use cases para outros módulos se necessário
    PurchaseCosmeticUseCase,
    PurchaseBundleUseCase,
    ReturnCosmeticUseCase,
    TransferCreditsUseCase,
    ListPurchasesUseCase,
    ListTransfersUseCase,
  ],
})
export class FinanceModule {}
