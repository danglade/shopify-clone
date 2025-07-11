'use client'

import * as React from 'react'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'
import {
  addDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
} from 'date-fns'
import { enUS } from 'date-fns/locale';
import { DateRange } from 'react-day-picker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { DateInput } from '@/components/ui/DateInput'

export interface DateRangePickerProps {
  /**
   * The selected date range.
   */
  value?: DateRange
  /**
   * A callback function to handle the date range update.
   */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void
  /**
   * The initial date from which the calendar should be displayed.
   */
  initialDateFrom?: Date | string
  /**
   * The initial date to which the calendar should be displayed.
   */
  initialDateTo?: Date | string
  /**
   * The initial date from which the comparison calendar should be displayed.
   */
  initialCompareFrom?: Date | string
  /**
   * The initial date to which the comparison calendar should be displayed.
   */
  initialCompareTo?: Date | string
  /**
   * The alignment of the popover content.
   */
  align?: 'start' | 'center' | 'end'
  /**
   * The locale to be used for date formatting.
   */
  locale?: string
  /**
   * A boolean indicating whether the compare feature should be shown.
   */
  showCompare?: boolean
}

const formatDate = (date: Date, locale: string = 'en-US'): string => {
  // Hardcoding locale for now to avoid dynamic require
  return format(date, 'LLL d, yyyy', { locale: enUS })
}

const PRESETS = [
  { name: 'today', label: 'Today' },
  { name: 'yesterday', label: 'Yesterday' },
  { name: 'last7', label: 'Last 7 days' },
  { name: 'last14', label: 'Last 14 days' },
  { name: 'last30', label: 'Last 30 days' },
  { name: 'thisMonth', label: 'This Month' },
  { name: 'lastMonth', label: 'Last Month' },
]

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value: range,
  onUpdate,
  initialDateFrom,
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  align = 'end',
  showCompare = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const [rangeState, setRangeState] = React.useState<DateRange | undefined>(
    range ?? {
      from: initialDateFrom ? new Date(initialDateFrom) : undefined,
      to: initialDateTo ? new Date(initialDateTo) : undefined,
    },
  )
  const [rangeCompare, setRangeCompare] = React.useState<DateRange | undefined>(
    {
      from: initialCompareFrom ? new Date(initialCompareFrom) : undefined,
      to: initialCompareTo ? new Date(initialCompareTo) : undefined,
    },
  )

  // Refs to store the input values
  const [fromValue, setFromValue] = React.useState<string>(
    rangeState?.from ? formatDate(rangeState.from) : '',
  )
  const [toValue, setToValue] = React.useState<string>(
    rangeState?.to ? formatDate(rangeState.to) : '',
  )
  const [fromCompareValue, setFromCompareValue] = React.useState<string>(
    rangeCompare?.from ? formatDate(rangeCompare.from) : '',
  )
  const [toCompareValue, setToCompareValue] = React.useState<string>(
    rangeCompare?.to ? formatDate(rangeCompare.to) : '',
  )

  const [isSmallScreen, setIsSmallScreen] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < 960 : false,
  )

  React.useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 960)
    }

    window.addEventListener('resize', handleResize)

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getPresetRange = (presetName: string): DateRange => {
    const today = new Date()
    const yesterday = addDays(today, -1)
    const last7 = addDays(today, -7)
    const last14 = addDays(today, -14)
    const last30 = addDays(today, -30)
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    )
    const lastMonthEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    )

    switch (presetName) {
      case 'today':
        return { from: today, to: today }
      case 'yesterday':
        return { from: yesterday, to: yesterday }
      case 'last7':
        return { from: last7, to: today }
      case 'last14':
        return { from: last14, to: today }
      case 'last30':
        return { from: last30, to: today }
      case 'thisMonth':
        return { from: thisMonthStart, to: today }
      case 'lastMonth':
        return { from: lastMonthStart, to: lastMonthEnd }
      default:
        throw new Error(`Unknown preset: ${presetName}`)
    }
  }

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset)
    setRangeState(range)
    if (range.from) {
      setFromValue(formatDate(range.from))
    } else {
      setFromValue('')
    }
    if (range.to) {
      setToValue(formatDate(range.to))
    } else {
      setToValue('')
    }
  }

  const checkAndSetDate = (date: Date, side: 'from' | 'to'): void => {
    if (!rangeState) {
      setRangeState({ from: date, to: date })
      setFromValue(formatDate(date))
      setToValue(formatDate(date))
      return
    }

    const { from, to } = rangeState

    if (side === 'from') {
      if (!to || isBefore(date, to)) {
        setRangeState({ from: date, to })
        setFromValue(formatDate(date))
      }
    } else {
      if (!from || isAfter(date, from)) {
        setRangeState({ from, to: date })
        setToValue(formatDate(date))
      }
    }
  }

  const checkAndSetDateCompare = (date: Date, side: 'from' | 'to'): void => {
    if (!rangeCompare) {
      setRangeCompare({ from: date, to: date })
      setFromCompareValue(formatDate(date))
      setToCompareValue(formatDate(date))
      return
    }

    const { from, to } = rangeCompare

    if (side === 'from') {
      if (!to || isBefore(date, to)) {
        setRangeCompare({ from: date, to })
        setFromCompareValue(formatDate(date))
      }
    } else {
      if (!from || isAfter(date, from)) {
        setRangeCompare({ from, to: date })
        setToCompareValue(formatDate(date))
      }
    }
  }
  const [isCompare, setIsCompare] = React.useState(false)

  const TriggerButton = () => (
    <Button
      size={'sm'}
      variant="outline"
      className="w-full justify-start text-left font-normal"
      onClick={() => {
        setIsOpen(!isOpen)
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <div className="py-1">
            <div>
              {rangeState?.from ? formatDate(rangeState.from) : 'Start Date'}
              {' - '}
              {rangeState?.to ? formatDate(rangeState.to) : 'End Date'}
            </div>
          </div>
        </div>
        <div className="pr-1">
          {isOpen ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </div>
      </div>
    </Button>
  )

  const CompareTriggerButton = () => (
    <Button
      size={'sm'}
      variant="outline"
      className="w-full justify-start text-left font-normal"
      onClick={() => {
        setIsOpen(!isOpen)
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <div className="py-1">
            <div>
              <>
                {rangeCompare?.from
                  ? formatDate(rangeCompare.from)
                  : 'Start Date'}
                {' - '}
                {rangeCompare?.to ? formatDate(rangeCompare.to) : 'End Date'}
              </>
            </div>
          </div>
        </div>
        <div className="pr-1">
          {isOpen ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </div>
      </div>
    </Button>
  )

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          if (onUpdate && rangeState?.from) {
            onUpdate({ range: rangeState, rangeCompare })
          }
        }
        setIsOpen(open)
      }}
    >
      <PopoverTrigger asChild>
        <div className="flex items-center">
          <CalendarIcon className="mr-2" />
          <TriggerButton />
        </div>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto">
        <div className="flex py-2">
          <div className="flex">
            <div className="flex flex-col">
              <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                {showCompare && (
                  <div className="flex items-center space-x-2 pr-4 py-1">
                    <Switch
                      id="compare"
                      checked={isCompare}
                      onCheckedChange={setIsCompare}
                    />
                    <Label htmlFor="compare">Compare</Label>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <DateInput
                      value={fromValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFromValue(e.target.value)
                      }}
                      onBlur={() => {
                        checkAndSetDate(new Date(fromValue), 'from')
                      }}
                    />
                    <div className="py-1">-</div>
                    <DateInput
                      value={toValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setToValue(e.target.value)
                      }}
                      onBlur={() => {
                        checkAndSetDate(new Date(toValue), 'to')
                      }}
                    />
                  </div>
                  {isCompare && (
                    <div className="flex gap-2">
                      <DateInput
                        value={fromCompareValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFromCompareValue(e.target.value)
                        }}
                        onBlur={() => {
                          checkAndSetDateCompare(
                            new Date(fromCompareValue),
                            'from',
                          )
                        }}
                      />
                      <div className="py-1">-</div>
                      <DateInput
                        value={toCompareValue}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setToCompareValue(e.target.value)
                        }}
                        onBlur={() => {
                          checkAndSetDateCompare(
                            new Date(toCompareValue),
                            'to',
                          )
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isSmallScreen && (
                <Select
                  defaultValue={PRESETS[5].name}
                  onValueChange={(value) => {
                    setPreset(value)
                  }}
                >
                  <SelectTrigger className="w-[180px] mx-auto mb-2">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div>
                <Calendar
                  mode="range"
                  onSelect={(
                    newRange: DateRange | undefined,
                  ): void => {
                    if (newRange) {
                      setRangeState(newRange)
                      if (newRange.from) setFromValue(formatDate(newRange.from))
                      if (newRange.to) setToValue(formatDate(newRange.to))
                    }
                  }}
                  selected={rangeState}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  defaultMonth={
                    rangeState?.from
                      ? rangeState.from
                      : initialDateFrom
                        ? new Date(initialDateFrom)
                        : new Date()
                  }
                  disabled={{ before: new Date('1900-01-01') }}
                  modifiers={{
                    compare: (date: Date): boolean => {
                      if (!rangeCompare?.from) return false
                      if (rangeCompare.to) {
                        return (
                          isAfter(date, rangeCompare.from) &&
                          isBefore(date, rangeCompare.to)
                        )
                      }
                      return isSameDay(date, rangeCompare.from)
                    },
                  }}
                  modifiersClassNames={{
                    compare:
                      'bg-destructive-foreground text-destructive border-destructive-foreground/50',
                  }}
                />

                {isCompare && (
                  <Calendar
                    mode="range"
                    onSelect={(
                      newRange: DateRange | undefined,
                    ): void => {
                      if (newRange) {
                        setRangeCompare(newRange)
                        if (newRange.from)
                          setFromCompareValue(formatDate(newRange.from))
                        if (newRange.to)
                          setToCompareValue(formatDate(newRange.to))
                      }
                    }}
                    selected={rangeCompare}
                    numberOfMonths={isSmallScreen ? 1 : 2}
                    defaultMonth={
                      rangeCompare?.from
                        ? rangeCompare.from
                        : initialCompareFrom
                          ? new Date(initialCompareFrom)
                          : rangeState?.from
                            ? rangeState.from
                            : initialDateFrom
                              ? new Date(initialDateFrom)
                              : new Date()
                    }
                    disabled={{ before: new Date('1900-01-01') }}
                  />
                )}
              </div>
            </div>
          </div>
          {!isSmallScreen && (
            <div className="flex flex-col items-end gap-1 pr-2 pl-6 pb-6">
              <div className="flex w-full flex-col items-end gap-1 pr-2 pl-6 pb-6">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setPreset(preset.name)
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 py-2 pr-4">
          <Button
            onClick={() => {
              setIsOpen(false)
            }}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false)
              if (onUpdate && rangeState?.from) {
                onUpdate({ range: rangeState, rangeCompare })
              }
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}