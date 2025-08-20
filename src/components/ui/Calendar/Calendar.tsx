'use client';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
}) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: date => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn('bg-popover absolute inset-0 opacity-0', defaultClassNames.dropdown),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : '[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5',
          defaultClassNames.caption_label
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal',
          defaultClassNames.weekday
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        week_number_header: cn('w-[--cell-size] select-none', defaultClassNames.week_number_header),
        week_number: cn(
          'text-muted-foreground select-none text-[0.8rem]',
          defaultClassNames.week_number
        ),
        day: cn(
          'group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md',
          defaultClassNames.day
        ),
        range_start: cn('bg-accent rounded-l-md', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('bg-accent rounded-r-md', defaultClassNames.range_end),
        today: cn(
          'bg-gray-800 text-white border-0 font-normal data-[selected=true]:!bg-brand data-[selected=true]:!text-white data-[selected=true]:!border-brand data-[selected=true]:!border-2',
          defaultClassNames.today
        ),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return <ChevronLeftIcon className={cn('size-4', className)} {...props} />;
          }

          if (orientation === 'right') {
            return <ChevronRightIcon className={cn('size-4', className)} {...props} />;
          }

          return <ChevronDownIcon className={cn('size-4', className)} {...props} />;
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <div
      className={modifiers.selected ? 'relative' : ''}
      style={
        modifiers.selected
          ? {
              background: 'var(--brand-primary)',
              borderRadius: '6px',
              padding: '0px',
            }
          : {}
      }
    >
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        data-day={day.date.toLocaleDateString()}
        data-selected-single={
          modifiers.selected &&
          !modifiers.range_start &&
          !modifiers.range_end &&
          !modifiers.range_middle
        }
        data-range-start={modifiers.range_start}
        data-range-end={modifiers.range_end}
        data-range-middle={modifiers.range_middle}
        className={cn(
          // Base styling for unselected dates - black background with visible border
          'bg-black text-white border-2 border-gray-600 hover:!bg-brand/20 hover:!text-brand hover:!border-brand/40 transition-all duration-200',
          // Today styling - subdued background
          modifiers.today && !modifiers.selected && 'bg-gray-800 border-0',
          // Selected date styling - direct conditional with enhanced visibility
          modifiers.selected &&
            '!bg-brand !text-white !border-brand !border-2 !shadow-lg !font-semibold',
          // Selected date styling - brand colors with enhanced visibility
          'data-[selected-single=true]:!bg-brand data-[selected-single=true]:!text-white data-[selected-single=true]:!border-brand data-[selected-single=true]:!border-2 data-[selected-single=true]:!shadow-lg data-[selected-single=true]:!font-semibold',
          // Range styling for brand colors
          'data-[range-middle=true]:!bg-brand/30 data-[range-middle=true]:!text-brand data-[range-middle=true]:!border-brand/50',
          'data-[range-start=true]:!bg-brand data-[range-start=true]:!text-white data-[range-start=true]:!border-brand',
          'data-[range-end=true]:!bg-brand data-[range-end=true]:!text-white data-[range-end=true]:!border-brand',
          // Focus and interaction states - using brand colors
          'group-data-[focused=true]/day:!border-brand group-data-[focused=true]/day:outline group-data-[focused=true]/day:outline-2 group-data-[focused=true]/day:outline-offset-2',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          'flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none',
          'data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md',
          'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10',
          '[&>span]:text-xs [&>span]:opacity-70',
          // Override default button styles
          '!rounded-md',
          // Force selected styling with higher specificity
          modifiers.selected &&
            '!bg-[var(--brand-primary)] !text-white !border-[var(--brand-primary)]',
          defaultClassNames.day,
          className
        )}
        style={
          modifiers.selected
            ? ({
                '--tw-ring-color': 'var(--brand-primary)',
                outlineColor: 'var(--brand-primary)',
                background: 'var(--brand-primary) !important',
                color: '#ffffff !important',
                border: '2px solid var(--brand-primary) !important',
                fontWeight: '600',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              } as React.CSSProperties & { '--tw-ring-color': string })
            : ({
                '--tw-ring-color': 'var(--brand-primary)',
                outlineColor: 'var(--brand-primary)',
              } as React.CSSProperties & { '--tw-ring-color': string })
        }
        {...props}
      />
    </div>
  );
}

export { Calendar, CalendarDayButton };
