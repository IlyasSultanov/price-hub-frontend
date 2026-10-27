import { FeedFormat } from '@core/enums';

/** Mirrors ALLOWED_FIELDS in app/schemas/mapping_profiles.py. */
export const MAPPABLE_FIELDS = [
  'external_sku',
  'barcode',
  'mfr_article',
  'brand',
  'title',
  'description',
  'category_raw',
  'price',
  'old_price',
  'currency',
  'stock',
  'available',
] as const;
export type MappableField = (typeof MAPPABLE_FIELDS)[number];

/** Mirrors REQUIRED_FIELDS — a profile can't be saved without mapping these. */
export const REQUIRED_FIELDS: MappableField[] = ['external_sku', 'title', 'price'];

/** Mirrors TRANSFORMS in app/parsers/transforms.py. */
export const AVAILABLE_TRANSFORMS = [
  'strip',
  'lower',
  'upper',
  'title',
  'remove_non_alnum',
  'strip_thousands_space',
  'comma_to_dot',
  'to_decimal',
  'validate_ean13',
  'stock_from_text',
  'cell_as_text',
] as const;
export type TransformName = (typeof AVAILABLE_TRANSFORMS)[number];

export type OnNegativeStock = 'reject_row' | 'set_zero' | 'keep';
export type OnDuplicateSku = 'last_wins' | 'first_wins' | 'reject_row';
export type ServiceRowHeuristic = 'only_first_column_filled';

export interface ReaderOpts {
  encoding: string;
  delimiter: string;
  quotechar: string;
  header_row: number;
  skip_blank_lines: boolean;
}

export interface MappingRules {
  on_negative_stock?: OnNegativeStock | null;
  on_duplicate_sku?: OnDuplicateSku | null;
  service_row_heuristic?: ServiceRowHeuristic | null;
  stock_text_map?: Record<string, number>;
  skip_row_if_title_matches?: string | null;
}

export interface CreateMappingProfileRequest {
  format: FeedFormat;
  supplier_id: string;
  column_map: Partial<Record<MappableField, string>>;
  transforms: Partial<Record<MappableField, TransformName[]>>;
  reader_opts: ReaderOpts;
  rules: MappingRules;
}

export interface MappingProfile {
  id: string;
  supplier_id: string;
  format: FeedFormat;
  version: number;
  column_map: Partial<Record<MappableField, string>>;
  transforms: Partial<Record<MappableField, TransformName[]>>;
  reader_opts: ReaderOpts;
  rules: MappingRules;
  is_active: boolean;
  created_at: string;
}

export const DEFAULT_READER_OPTS: ReaderOpts = {
  encoding: 'utf-8',
  delimiter: ',',
  quotechar: '"',
  header_row: 0,
  skip_blank_lines: true,
};
