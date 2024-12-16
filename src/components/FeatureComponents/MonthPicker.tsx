import {
    add,
    eachMonthOfInterval,
    endOfYear,
    format,
    isEqual,
    isFuture,
    parse,
    startOfMonth,
    startOfToday,
    } from 'date-fns';
import { id } from 'date-fns/locale'; 
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { Button, buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
  
  function getStartOfCurrentMonth() {
    return startOfMonth(startOfToday());
  }
  
  interface MonthPickerProps {
    currentMonth: Date;
    placeholder?: string;
    onMonthChange: (newMonth: Date) => void;
  }
  
  export default function MonthPicker({
    placeholder = "Pilih Bulan",
    currentMonth,
    onMonthChange,
  }: MonthPickerProps) {
    const [currentYear, setCurrentYear] = React.useState(
      format(currentMonth, 'yyyy', { locale: id })
    );
    const firstDayCurrentYear = parse(currentYear, 'yyyy', new Date());
  
    const months = eachMonthOfInterval({
      start: firstDayCurrentYear,
      end: endOfYear(firstDayCurrentYear),
    });
  
    function previousYear() {
      let firstDayNextYear = add(firstDayCurrentYear, { years: -1 });
      setCurrentYear(format(firstDayNextYear, 'yyyy'));
    }
  
    function nextYear() {
      let firstDayNextYear = add(firstDayCurrentYear, { years: 1 });
      setCurrentYear(format(firstDayNextYear, 'yyyy'));
    }
  
    return (
        <div className={cn("grid gap-2")}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full sm:w-[300] font-normal my-2 sm:text-center"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 justify-start text-left" />
                            <span>{placeholder}</span>
                    </Button>
                </PopoverTrigger>
                
                <PopoverContent  className='w-full sm:w-[400px] p-0 z-50'
                // className={cn("w-full sm:w-auto p-0 z-50 bg-white shadow-lg rounded-md border border-slate-200")}
                    align="start">
                    <div className="p-3 my-2 bg-white z-50 bg-white shadow-lg rounded-md border border-slate-200">
                        <div className="flex flex-row space-y-4 sm:flex-col sm:space-x-4 sm:space-y-0">
                            <div className="space-y-4">
                                <div className="relative flex items-center justify-center pt-1">
                                    <div
                                        className="text-sm font-medium"
                                        aria-live="polite"
                                        role="presentation"
                                        id="month-picker"
                                    >
                                        {format(firstDayCurrentYear, 'yyyy')}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            name="previous-year"
                                            aria-label="Go to previous year"
                                            className={cn(
                                                buttonVariants({ variant: 'outline' }),
                                                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                                                'absolute left-1'
                                            )}
                                            type="button"
                                            onClick={previousYear}
                                        >
                                        <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                            name="next-year"
                                            aria-label="Go to next year"
                                            className={cn(
                                                buttonVariants({ variant: 'outline' }),
                                                'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                                                'absolute right-1 disabled:bg-slate-100'
                                            )}
                                            type="button"
                                            disabled={isFuture(add(firstDayCurrentYear, { years: 1 }))}
                                            onClick={nextYear}
                                        >
                                        <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div
                                    className="grid grid-cols-4 gap-2  mt-4"
                                    role="grid"
                                    aria-labelledby="month-picker"
                                >
                                    {months.map((month) => (
                                        <div
                                        key={month.toString()}
                                        className="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md dark:[&:has([aria-selected])]:bg-slate-800"
                                        role="presentation"
                                        >
                                        <button
                                            name="day"
                                            className={cn(
                                            'inline-flex h-9 w-16 items-center justify-center rounded-md p-0 text-sm font-normal ring-offset-white transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100 dark:ring-offset-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus-visible:ring-slate-800',
                                            isEqual(month, currentMonth) &&
                                                'bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50 dark:hover:text-slate-900 dark:focus:bg-slate-50 dark:focus:text-slate-900',
                                            !isEqual(month, currentMonth) &&
                                                isEqual(month, getStartOfCurrentMonth()) &&
                                                'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
                                            )}
                                            disabled={isFuture(month)}
                                            role="gridcell"
                                            tabIndex={-1}
                                            type="button"
                                            onClick={() => onMonthChange(month)}
                                        >
                                            <time dateTime={format(month, 'yyyy-MM-dd')}>
                                                {format(month, 'MMM', { locale: id })}
                                            </time>
                                        </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
        
    );
  }