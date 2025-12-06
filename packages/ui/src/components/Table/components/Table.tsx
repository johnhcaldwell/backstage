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

import type { Key } from 'react-aria-components';
import { TableRoot } from './TableRoot';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { Row } from './Row';
import { Column } from './Column';
import { TablePagination } from '../../TablePagination';
import type { TableProps, TableItem, RowConfig, RowRenderFn } from '../types';
import { Fragment, useMemo } from 'react';

function isRowRenderFn<T extends TableItem>(
  rowConfig: RowConfig<T> | RowRenderFn<T> | undefined,
): rowConfig is RowRenderFn<T> {
  return typeof rowConfig === 'function';
}

function useDisabledRows<T extends TableItem>({
  data,
  rowConfig,
}: Pick<TableProps<T>, 'data' | 'rowConfig'>): Set<Key> | undefined {
  return useMemo(() => {
    if (!data || typeof rowConfig === 'function' || !rowConfig?.getIsDisabled) {
      return;
    }

    return data.reduce<Set<Key>>((set, item) => {
      const isDisabled = rowConfig.getIsDisabled?.(item);
      if (isDisabled) {
        set.add(String(item.id));
      }
      return set;
    }, new Set<Key>());
  }, [data, rowConfig]);
}

/** @public */
export function Table<T extends TableItem>({
  columnConfig,
  rowHeaderColumn,
  data,
  loading = false,
  isStale = false,
  error,
  pagination,
  sort,
  rowConfig,
  selection,
  emptyState,
}: TableProps<T>) {
  if (process.env.NODE_ENV === 'development') {
    const columnIds = columnConfig.map(col => col.id);
    if (!columnIds.includes(rowHeaderColumn)) {
      console.warn(
        `rowHeaderColumn "${rowHeaderColumn}" does not match any column id. Available columns: ${columnIds.join(
          ', ',
        )}`,
      );
    }
  }

  const visibleColumns = useMemo(
    () => columnConfig.filter(col => !col.isHidden),
    [columnConfig],
  );
  const disabledRows = useDisabledRows({ data, rowConfig });

  const {
    mode: selectionMode,
    selected: selectedKeys,
    behavior: selectionBehavior,
    onSelectionChange,
  } = selection || {};

  if (loading && !data) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <TableRoot
        selectionMode={selectionMode}
        selectionBehavior={selectionBehavior}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        sortDescriptor={sort?.descriptor ?? undefined}
        onSortChange={sort?.onSortChange}
        disabledKeys={disabledRows}
        stale={isStale}
      >
        <TableHeader columns={visibleColumns}>
          {column =>
            column.header ? (
              <>{column.header()}</>
            ) : (
              <Column
                id={column.id}
                isRowHeader={column.id === rowHeaderColumn}
                allowsSorting={column.isSortable}
              >
                {column.label}
              </Column>
            )
          }
        </TableHeader>
        <TableBody
          items={data}
          renderEmptyState={emptyState ? () => emptyState : undefined}
        >
          {item => {
            const itemIndex = data?.indexOf(item) ?? -1;

            if (isRowRenderFn(rowConfig)) {
              return rowConfig({
                item,
                index: itemIndex,
              });
            }

            return (
              <Row
                id={String(item.id)}
                columns={visibleColumns}
                href={rowConfig?.getHref?.(item)}
                onAction={
                  rowConfig?.onClick
                    ? () => rowConfig?.onClick?.(item)
                    : undefined
                }
              >
                {column => (
                  <Fragment key={column.id}>{column.cell(item)}</Fragment>
                )}
              </Row>
            );
          }}
        </TableBody>
      </TableRoot>
      {pagination.type === 'page' && (
        <TablePagination
          pageSize={pagination.pageSize}
          offset={pagination.offset}
          totalCount={pagination.totalCount}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
          onNextPage={pagination.onNextPage}
          onPreviousPage={pagination.onPreviousPage}
          onPageSizeChange={pagination.onPageSizeChange}
          showPageSizeOptions={pagination.showPageSizeOptions}
          getLabel={pagination.getLabel}
        />
      )}
    </div>
  );
}
