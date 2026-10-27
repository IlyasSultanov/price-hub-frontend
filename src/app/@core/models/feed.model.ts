import { FeedStatus } from '@core/enums';

export enum SourceType {
  Upload = 'upload',
  Presigned = 'presigned',
  Http = 'http',
  Ftp = 'ftp',
}

export interface Feed {
  id: string;
  supplier_id: string;
  status: FeedStatus;
  source_type: SourceType;
  original_filename: string | null;
  file_size: number;
  sha256: string;
  rows_total: number;
  rows_ok: number;
  rows_failed: number;
  matched_count: number;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
}

export interface FeedUploadResponse {
  feed: Feed;
  duplicate: boolean;
}
