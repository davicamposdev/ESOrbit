export interface SyncLogData {
  job: string;
  status: 'running' | 'success' | 'failed';
  message?: string;
  itemsProcessed?: number;
  itemsCreated?: number;
  itemsUpdated?: number;
  duration?: number;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface ISyncLogRepository {
  create(data: SyncLogData): Promise<{ id: string }>;
  update(id: string, data: Partial<SyncLogData>): Promise<void>;
}
