import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarDays } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import {
  format,
  subDays,
  startOfDay,
  subWeeks,
  subMonths,
  isValid,
} from 'date-fns';

interface IDateFilterProps {
  onDateFilterChange: (start: Date | undefined, end: Date | undefined) => void;
}

const DateFilter = ({ onDateFilterChange }: IDateFilterProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const dateFilterOptions = useMemo(() => {
    return [
      {
        id: 'all',
        label: 'All',
      },
      {
        id: 'day',
        label: 'Last 24h',
      },
      {
        id: 'last-three',
        label: 'Last 3 Days',
      },
      {
        id: 'last-week',
        label: 'Last Week',
      },
      {
        id: 'last-month',
        label: 'Last Month',
      },
      {
        id: 'custom',
        label: 'Custom Range',
      },
    ];
  }, []);
  const handleFilterBtn = useCallback(
    (id: string) => {
      setSelectedFilter(id);
      const todayEnd = startOfDay(new Date());
      let startDate: Date | null = null;
      let endDate: Date | null = todayEnd;

      switch (id) {
        case 'day': {
          startDate = subDays(todayEnd, 1);
          break;
        }
        case 'last-three': {
          startDate = subDays(todayEnd, 3);
          break;
        }
        case 'last-week': {
          startDate = startOfDay(subWeeks(todayEnd, 1));
          break;
        }
        case 'last-month': {
          startDate = startOfDay(subMonths(todayEnd, 1));
          break;
        }
        case 'custom': {
          setShowCalendar(true);
          break;
        }
        default: {
          startDate = null;
          endDate = null;
          break;
        }
      }

      const newRange =
        startDate && endDate ? { from: startDate, to: endDate } : undefined;
      setSelectedRange(newRange);
      onDateFilterChange(newRange?.from, newRange?.to);
      setShowCalendar(false);
    },
    [onDateFilterChange]
  );

  const getButtonStyleByFilter = (filter: string) => {
    return filter === selectedFilter ? 'default' : 'ghost';
  };

  const handleRangeSelect = (rangeData: DateRange | undefined) => {
    setSelectedRange(rangeData);
    if (
      rangeData?.from &&
      rangeData.to &&
      isValid(rangeData.from) &&
      isValid(rangeData.to)
    ) {
      setSelectedFilter('custom');
      onDateFilterChange(startOfDay(rangeData.from), startOfDay(rangeData.to));
      setShowCalendar(false);
    }
  };

  const formatDateRange = () => {
    if (selectedRange?.from && selectedRange?.to) {
      return `${format(selectedRange.from, 'MMM d')} - ${format(selectedRange.to, 'MMM d')}`;
    }
    return 'Custom Range';
  };

  return (
    <div className={'flex items-center my-3'}>
      {dateFilterOptions.map((filter) => (
        <div key={filter.id}>
          {filter.id !== 'custom' ? (
            <Button
              className={
                'px-3 text-sm border border-input rounded-md shadow-md'
              }
              variant={getButtonStyleByFilter(filter.id)}
              onClick={() => handleFilterBtn(filter.id)}
            >
              {filter.label}
            </Button>
          ) : (
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button
                  variant={getButtonStyleByFilter('custom')}
                  size="sm"
                  className="rounded-l-none rounded-r-lg space-x-1 border border-input rounded-md shadow-md"
                >
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end" sideOffset={5}>
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                  <DayPicker
                    mode="range"
                    selected={selectedRange}
                    onSelect={handleRangeSelect}
                    numberOfMonths={2}
                    className="p-2"
                    showOutsideDays
                    fixedWeeks
                    disabled={{ after: new Date() }}
                    toDate={new Date()}
                    classNames={{
                      months:
                        'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                      month: 'space-y-4',
                      caption: 'flex justify-center pt-1 relative items-center',
                      caption_label: 'text-sm font-medium',
                      nav: 'space-x-1 flex items-center',
                      nav_button:
                        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                      nav_button_previous: 'absolute left-1',
                      nav_button_next: 'absolute right-1',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex',
                      head_cell:
                        'text-gray-500 rounded-md w-9 font-normal text-[0.8rem]',
                      row: 'flex w-full mt-2',
                      cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                      day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                      day_selected:
                        'bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white',
                      day_today: 'bg-gray-100',
                      day_outside: 'text-gray-400 opacity-50',
                      day_disabled: 'text-gray-400 opacity-50',
                      day_range_middle:
                        'aria-selected:bg-blue-100 aria-selected:text-white',
                      day_hidden: 'invisible',
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      ))}
    </div>
  );
};

export default DateFilter;
