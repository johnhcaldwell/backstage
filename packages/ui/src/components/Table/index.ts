/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export { Table } from './components/Table';
export { TableRoot } from './components/TableRoot';
export { TableHeader } from './components/TableHeader';
export { TableBody } from './components/TableBody';
export { Column } from './components/Column';
export { Row } from './components/Row';
export { Cell } from './components/Cell';
export { CellText } from './components/CellText';
export { CellProfile } from './components/CellProfile';
export { useTable } from './hooks/useTable';
export { useTableData } from './hooks/useTableData';

export type {
  CellProps,
  CellTextProps,
  CellProfileProps,
  ColumnProps,
  TableProps,
  TableItem,
  ColumnConfig,
  RowConfig,
  RowRenderFn,
  TableSelection,
  SortState,
  NoPagination,
  PagePagination,
  TablePaginationType,
} from './types';
export type {
  UseTableConfig,
  UseTableResult,
  UseTablePagination,
  UseTablePaginationConfig,
  UseTableDataOptions,
  UseTableDataResult,
  UseTableDataCompleteOptions,
  UseTableDataOffsetOptions,
  UseTableDataCursorOptions,
  OffsetParams,
  OffsetResponse,
  CursorParams,
  CursorResponse,
  FilterState,
  SearchState,
  QueryOptions,
  PaginationOptions,
} from './hooks/types';
export type { SortDescriptor } from 'react-stately';

export { TableDefinition } from './definition';
