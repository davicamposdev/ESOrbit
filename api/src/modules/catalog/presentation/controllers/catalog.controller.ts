import { Controller, Get, Post, Query, Body, Inject } from '@nestjs/common';
import { SyncCosmeticsUseCase } from '../../application/use-cases/sync-cosmetics.use-case';
import { SyncNewCosmeticsUseCase } from '../../application/use-cases/sync-new-cosmetics.use-case';
import { SyncShopCosmeticsUseCase } from '../../application/use-cases/sync-shop-cosmetics.use-case';
import { ListCosmeticsUseCase } from '../../application/use-cases/list-cosmetics.use-case';
import { ListBundlesUseCase } from '../../application/use-cases/list-bundles.use-case';
import type { ISyncLogRepository } from '../../domain/repositories/sync-log.repository.interface.';
import { ListCosmeticsDto } from '../dtos/list-cosmetics.dto';
import { ListBundlesDto } from '../dtos/list-bundles.dto';
import { SyncCosmeticsDto } from '../dtos/sync-cosmetics.dto';
import { Public } from 'src/modules/auth/presentation/decorators/public.decorator';

@Public()
@Controller('catalog')
export class CatalogController {
  constructor(
    @Inject('ISyncLogRepository')
    private readonly syncLogRepository: ISyncLogRepository,
    private readonly syncCosmeticsUseCase: SyncCosmeticsUseCase,
    private readonly syncNewCosmeticsUseCase: SyncNewCosmeticsUseCase,
    private readonly syncShopCosmeticsUseCase: SyncShopCosmeticsUseCase,
    private readonly listCosmeticsUseCase: ListCosmeticsUseCase,
    private readonly listBundlesUseCase: ListBundlesUseCase,
  ) {}

  @Get('cosmetics')
  async listCosmetics(@Query() dto: ListCosmeticsDto) {
    const result = await this.listCosmeticsUseCase.execute(dto);

    return {
      data: result.items.map((cosmetic) => ({
        id: cosmetic.id,
        externalId: cosmetic.externalId,
        name: cosmetic.name,
        type: cosmetic.type,
        rarity: cosmetic.rarity,
        imageUrl: cosmetic.imageUrl,
        addedAt: cosmetic.addedAt,
        isNew: cosmetic.isNew,
        isAvailable: cosmetic.isAvailable,
        basePrice: cosmetic.basePrice,
        currentPrice: cosmetic.currentPrice,
        onSale: cosmetic.onSale,
        isBundle: cosmetic.isBundle,
        childrenCount: cosmetic.childrenExternalIds.length,
      })),
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
      },
    };
  }

  @Get('bundles')
  async listBundles(@Query() dto: ListBundlesDto) {
    const result = await this.listBundlesUseCase.execute(dto);

    return {
      data: result.items.map(({ bundle, cosmetics }) => {
        const mainCosmetic =
          cosmetics.find((c) => c.type === 'outfit') || cosmetics[0];

        return {
          id: bundle.id,
          externalId: bundle.externalId,
          name: bundle.name,
          cosmetic: mainCosmetic
            ? {
                id: mainCosmetic.id,
                externalId: mainCosmetic.externalId,
                name: mainCosmetic.name,
                type: mainCosmetic.type,
                rarity: mainCosmetic.rarity,
                imageUrl: mainCosmetic.imageUrl,
                isAvailable: mainCosmetic.isAvailable,
                basePrice: mainCosmetic.basePrice,
                currentPrice: mainCosmetic.currentPrice,
                onSale: mainCosmetic.onSale,
                isNew: mainCosmetic.isNew,
                addedAt: mainCosmetic.addedAt,
              }
            : null,
          items: cosmetics.map((cosmetic) => ({
            id: cosmetic.id,
            externalId: cosmetic.externalId,
            name: cosmetic.name,
            type: cosmetic.type,
            rarity: cosmetic.rarity,
            imageUrl: cosmetic.imageUrl,
            basePrice: cosmetic.basePrice,
            currentPrice: cosmetic.currentPrice,
            isAvailable: cosmetic.isAvailable,
          })),
        };
      }),
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
      },
    };
  }

  @Post('sync/all')
  async syncAllCosmetics(@Body() dto: SyncCosmeticsDto) {
    const startedAt = new Date();
    const startTime = Date.now();

    const { id: logId } = await this.syncLogRepository.create({
      job: 'sync-all-manual',
      status: 'running',
      message: 'Sincronização manual iniciada',
      startedAt,
    });

    try {
      const result = await this.syncCosmeticsUseCase.execute(dto.language);
      const duration = Date.now() - startTime;

      await this.syncLogRepository.update(logId, {
        status: 'success',
        message: 'Sincronização manual concluída com sucesso',
        itemsProcessed: result.itemsProcessed,
        itemsCreated: result.itemsCreated,
        itemsUpdated: result.itemsUpdated,
        duration,
        finishedAt: new Date(),
      });

      return {
        message: 'Cosmetics synchronized successfully',
        data: result,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.syncLogRepository.update(logId, {
        status: 'failed',
        message: `Erro: ${error.message}`,
        duration,
        finishedAt: new Date(),
      });
      throw error;
    }
  }

  @Post('sync/new')
  async syncNewCosmetics(@Body() dto: SyncCosmeticsDto) {
    const startedAt = new Date();
    const startTime = Date.now();

    const { id: logId } = await this.syncLogRepository.create({
      job: 'sync-new-manual',
      status: 'running',
      message: 'Sincronização manual de novos cosméticos iniciada',
      startedAt,
    });

    try {
      const result = await this.syncNewCosmeticsUseCase.execute(dto.language);
      const duration = Date.now() - startTime;

      await this.syncLogRepository.update(logId, {
        status: 'success',
        message:
          'Sincronização manual de novos cosméticos concluída com sucesso',
        itemsProcessed: result.itemsProcessed,
        itemsCreated: result.itemsCreated,
        itemsUpdated: result.itemsUpdated,
        duration,
        finishedAt: new Date(),
      });

      return {
        message: 'New cosmetics synchronized successfully',
        data: result,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.syncLogRepository.update(logId, {
        status: 'failed',
        message: `Erro: ${error.message}`,
        duration,
        finishedAt: new Date(),
      });
      throw error;
    }
  }

  @Post('sync/shop')
  async syncShopCosmetics(@Body() dto: SyncCosmeticsDto) {
    const startedAt = new Date();
    const startTime = Date.now();

    const { id: logId } = await this.syncLogRepository.create({
      job: 'sync-shop-manual',
      status: 'running',
      message: 'Sincronização manual da loja iniciada',
      startedAt,
    });

    try {
      const result = await this.syncShopCosmeticsUseCase.execute(dto.language);
      const duration = Date.now() - startTime;

      await this.syncLogRepository.update(logId, {
        status: 'success',
        message: 'Sincronização manual da loja concluída com sucesso',
        itemsProcessed: result.itemsProcessed,
        itemsCreated: result.itemsCreated,
        itemsUpdated: result.itemsUpdated,
        duration,
        finishedAt: new Date(),
      });

      return {
        message: 'Shop cosmetics synchronized successfully',
        data: result,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.syncLogRepository.update(logId, {
        status: 'failed',
        message: `Erro: ${error.message}`,
        duration,
        finishedAt: new Date(),
      });
      throw error;
    }
  }

  @Post('sync/full')
  async syncFullDatabase(@Body() dto: SyncCosmeticsDto) {
    const startedAt = new Date();
    const startTime = Date.now();

    const { id: logId } = await this.syncLogRepository.create({
      job: 'full-catalog-sync-manual',
      status: 'running',
      message: 'Sincronização completa manual iniciada',
      startedAt,
    });

    try {
      const [allResult, newResult, shopResult] = await Promise.all([
        this.syncCosmeticsUseCase.execute(dto.language),
        this.syncNewCosmeticsUseCase.execute(dto.language),
        this.syncShopCosmeticsUseCase.execute(dto.language),
      ]);

      const duration = Date.now() - startTime;
      const totalProcessed =
        allResult.itemsProcessed +
        newResult.itemsProcessed +
        shopResult.itemsProcessed;
      const totalCreated =
        allResult.itemsCreated +
        newResult.itemsCreated +
        shopResult.itemsCreated;
      const totalUpdated =
        allResult.itemsUpdated +
        newResult.itemsUpdated +
        shopResult.itemsUpdated;

      await this.syncLogRepository.update(logId, {
        status: 'success',
        message: 'Sincronização completa manual concluída com sucesso',
        itemsProcessed: totalProcessed,
        itemsCreated: totalCreated,
        itemsUpdated: totalUpdated,
        duration,
        finishedAt: new Date(),
      });

      return {
        message: 'Full database synchronization completed successfully',
        data: {
          all: allResult,
          new: newResult,
          shop: shopResult,
          totalDuration: duration,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      await this.syncLogRepository.update(logId, {
        status: 'failed',
        message: `Erro: ${error.message}`,
        duration,
        finishedAt: new Date(),
      });
      throw error;
    }
  }
}
