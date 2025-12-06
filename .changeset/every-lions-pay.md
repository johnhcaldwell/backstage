---
'@backstage/ui': minor
---

**BREAKING**: Redesigned Table component with unified `useTableData` hook API.

- The `Table` component is now a high-level orchestrator; the previous `Table` (React Aria wrapper) is renamed to `TableRoot`
- `TablePagination` props redesigned: `pageSize`, `hasNextPage`, `hasPreviousPage`, `onNextPage`, `onPreviousPage` are now required; `rowCount` renamed to `totalCount`; `setOffset`/`setPageSize` removed
- `useTable` hook is deprecated in favor of `useTableData`

New features include unified pagination modes (complete, offset, cursor), debounced query changes, stale data preservation during reloads, and row selection with toggle/replace behaviors.

**Migration guide:**

Option A (recommended): Migrate to the new `useTableData` hook and high-level `Table`:

```diff
-const { data, paginationProps } = useTable({ data: items, pagination: {...} });
+const { tableProps } = useTableData({
+  mode: 'complete',
+  getData: () => items,
+});

-<Table aria-label="My table">
-  <TableHeader>...</TableHeader>
-  <TableBody items={data}>...</TableBody>
-</Table>
-<TablePagination {...paginationProps} />
+<Table
+  {...tableProps}
+  columnConfig={columns}
+  rowHeaderColumn="name"
+/>
```

Option B: Keep using `useTable` (deprecated) with updated components:

1. Rename `Table` to `TableRoot`:

```diff
-import { Table } from '@backstage/ui';
+import { TableRoot } from '@backstage/ui';

-<Table aria-label="My table" {...props}>
+<TableRoot aria-label="My table" {...props}>
```

2. Update `TablePagination` props:

```diff
<TablePagination
-  rowCount={100}
-  setOffset={setOffset}
-  setPageSize={setPageSize}
+  pageSize={20}
+  totalCount={100}
+  hasNextPage={offset + pageSize < totalCount}
+  hasPreviousPage={offset > 0}
+  onNextPage={handleNext}
+  onPreviousPage={handlePrevious}
/>
```

Affected components: Table, TableRoot, TablePagination
