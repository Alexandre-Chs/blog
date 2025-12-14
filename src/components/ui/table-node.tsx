import { PlateElement } from 'platejs/react'
import type { PlateElementProps } from 'platejs/react'

import { cn } from '@/lib/utils'

export function TableElement({ className, ...props }: PlateElementProps) {
  return (
    <div className="my-4 overflow-x-auto">
      <PlateElement
        as="table"
        className={cn('w-full table-fixed border-collapse', 'border border-gray-200 dark:border-gray-700', className)}
        {...props}
      >
        <tbody>{props.children}</tbody>
      </PlateElement>
    </div>
  )
}

export function TableRowElement({ className, ...props }: PlateElementProps) {
  return (
    <PlateElement
      as="tr"
      className={cn(
        'border-b border-gray-200 dark:border-gray-700',
        'hover:bg-gray-50 dark:hover:bg-gray-900/50',
        className,
      )}
      {...props}
    >
      {props.children}
    </PlateElement>
  )
}

export function TableCellElement({ className, ...props }: PlateElementProps) {
  return (
    <PlateElement
      as="td"
      className={cn(
        'border border-gray-200 dark:border-gray-700',
        'p-2 text-left align-top',
        'min-w-[80px]',
        className,
      )}
      {...props}
    >
      {props.children}
    </PlateElement>
  )
}

export function TableCellHeaderElement({ className, ...props }: PlateElementProps) {
  return (
    <PlateElement
      as="th"
      className={cn(
        'border border-gray-200 dark:border-gray-700',
        'bg-gray-100 dark:bg-gray-800',
        'p-2 text-left font-semibold align-top',
        'min-w-[80px]',
        className,
      )}
      {...props}
    >
      {props.children}
    </PlateElement>
  )
}
