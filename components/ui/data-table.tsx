import React, { type ReactNode } from 'react'

type Column<T> = {
  key: keyof T | string
  header: string
  render?: (row: T) => React.ReactNode
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
}: {
  columns: Column<T>[]
  data: T[]
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-foreground/5 text-left">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} className="px-3 py-2 font-medium">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-3 py-4 text-muted-foreground" colSpan={columns.length}>
                No data
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={(row.id ?? idx) as React.Key} className="border-t">
                {columns.map((c) => {
                  const cellKey = String(c.key)
                  const value = c.render
                    ? c.render(row)
                    : typeof c.key === 'string'
                      ? (row as Record<string, unknown>)[c.key]
                      : row[c.key]
                  const rendered = (value ?? null) as ReactNode
                  return (
                    <td key={cellKey} className="px-3 py-2">
                      {rendered}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
