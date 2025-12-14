import type { SlateElementProps } from 'platejs'
import { SlateElement } from 'platejs'

import { cn } from '@/lib/utils'

export function TableElementStatic({ className, ...props }: SlateElementProps) {
  return (
    <div className="my-4 overflow-x-auto">
      <SlateElement
        as="table"
        className={cn('w-full table-fixed border-collapse', 'border border-gray-200 dark:border-gray-700', className)}
        {...props}
      >
        <tbody>{props.children}</tbody>
      </SlateElement>
    </div>
  )
}

export function TableRowElementStatic({ className, ...props }: SlateElementProps) {
  return (
    <SlateElement as="tr" className={cn('border-b border-gray-200 dark:border-gray-700', className)} {...props}>
      {props.children}
    </SlateElement>
  )
}

export function TableCellElementStatic({ className, ...props }: SlateElementProps) {
  return (
    <SlateElement
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
    </SlateElement>
  )
}

export function TableCellHeaderElementStatic({ className, ...props }: SlateElementProps) {
  return (
    <SlateElement
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
    </SlateElement>
  )
}
