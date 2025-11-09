import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import {
  ISyncLogRepository,
  SyncLogData,
} from '../../domain/repositories/sync-log.repository.interface.';

@Injectable()
export class PrismaSyncLogRepository implements ISyncLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: SyncLogData): Promise<{ id: string }> {
    const log = await this.prisma.syncLog.create({
      data,
    });
    return { id: log.id };
  }

  async update(id: string, data: Partial<SyncLogData>): Promise<void> {
    await this.prisma.syncLog.update({
      where: { id },
      data,
    });
  }
}
