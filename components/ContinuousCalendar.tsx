'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface ContinuousCalendarProps {
  onClick?: (_day:number, _month: number, _year: number) => void;
  events?: string[];  // array of 'YYYY-MM-DD'
}

export const ContinuousCalendar: React.FC<ContinuousCalendarProps> = ({ onClick, events = [] }) => {
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const monthOptions = monthNames.map((month, index) => ({ name: month, value: `${index}` }));

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const scrollToDay = (monthIndex: number, dayIndex: number) => {
    const targetDayIndex = dayRefs.current.findIndex(
      (ref) => ref && ref.getAttribute('data-month') === `${monthIndex}` && ref.getAttribute('data-day') === `${dayIndex}`,
    );
    const targetElement = dayRefs.current[targetDayIndex];
    if (targetDayIndex !== -1 && targetElement) {
      const container = document.querySelector('.calendar-container');
      const elementRect = targetElement.getBoundingClientRect();
      const offsetFactor = window.matchMedia('(min-width: 1536px)').matches ? 3 : 2.5;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offset = elementRect.top - containerRect.top - (containerRect.height / offsetFactor) + (elementRect.height / 2);
        container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
      }
    }
  };

  const handlePrevYear = () => setYear((prevYear) => prevYear - 1);
  const handleNextYear = () => setYear((prevYear) => prevYear + 1);
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(event.target.value, 10);
    setSelectedMonth(monthIndex);
    scrollToDay(monthIndex, 1);
  };

  const handleTodayClick = () => {
    setYear(today.getFullYear());
    scrollToDay(today.getMonth(), today.getDate());
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    if (onClick) {
      onClick(day, month, year);
    }
  };

  const hasEvent = (day: number, month: number, year: number) =>
    events.includes(`${year}-${month + 1}-${day}`);

  const generateCalendar = useMemo(() => {
    const daysInYear = (): { month: number; day: number }[] => {
      const days = [];
      const startDayOfWeek = new Date(year, 0, 1).getDay();
      if (startDayOfWeek < 6) {
        for (let i = 0; i < startDayOfWeek; i++) {
          days.push({ month: -1, day: 32 - startDayOfWeek + i });
        }
      }
      for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          days.push({ month, day });
        }
      }
      const remaining = 7 - (days.length % 7);
      if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
          days.push({ month: 0, day: i });
        }
      }
      return days;
    };

    const calendarDays = daysInYear();
    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }

    return calendarWeeks.map((week, weekIndex) => (
      <div className="flex w-full" key={`week-${weekIndex}`}>
        {week.map(({ month, day }, dayIndex) => {
          const index = weekIndex * 7 + dayIndex;
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isNewMonth = index === 0 || calendarDays[index - 1].month !== month;

          return (
            <div
              key={`${month}-${day}`}
              ref={(el) => { dayRefs.current[index] = el; }}
              data-month={month}
              data-day={day}
              onClick={() => handleDayClick(day, month, year)}
              className={`relative z-10 m-[-0.5px] group aspect-square w-full grow cursor-pointer rounded-xl border 
                ${darkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-slate-200 bg-white text-slate-800'}
                hover:z-20 hover:border-cyan-400 transition-all duration-200`}
            >
              <span className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs
                ${isToday ? 'bg-blue-500 text-white' : 'text-slate-400'} sm:size-6 sm:text-sm`}>
                {day}
              </span>
              {isNewMonth && month >= 0 && (
                <span className="absolute bottom-1 left-1 text-xs font-semibold opacity-60">
                  {monthNames[month]}
                </span>
              )}
              {hasEvent(day, month, year) && month >= 0 && (
                <span className="absolute bottom-1 right-1 block h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              )}
            </div>
          );
        })}
      </div>
    ));
  }, [year, events, darkMode]);

  useEffect(() => {
    const container = document.querySelector('.calendar-container');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = parseInt(entry.target.getAttribute('data-month')!, 10);
            if (!isNaN(month)) setSelectedMonth(month);
          }
        });
      },
      { root: container, threshold: 0 }
    );
    dayRefs.current.forEach((ref) => {
      if (ref && ref.getAttribute('data-day') === '15') {
        observer.observe(ref);
      }
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`calendar-container max-h-full overflow-y-scroll rounded-t-2xl pb-10 shadow-xl no-scrollbar
      ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-slate-800'}`}>
      <div className="sticky top-0 z-50 w-full rounded-t-2xl px-5 pt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Select name="month" value={`${selectedMonth}`} options={monthOptions} onChange={handleMonthChange} />
            <button onClick={handleTodayClick} className="rounded px-3 py-1.5 text-sm border hover:bg-blue-100 dark:hover:bg-gray-800">
              Today
            </button>
            <button onClick={toggleDarkMode} className="rounded px-3 py-1.5 text-sm border hover:bg-blue-100 dark:hover:bg-gray-800">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevYear} className="rounded-full border p-1 hover:bg-blue-100 dark:hover:bg-gray-800">
              ←
            </button>
            <span className="text-lg font-semibold">{year}</span>
            <button onClick={handleNextYear} className="rounded-full border p-1 hover:bg-blue-100 dark:hover:bg-gray-800">
              →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-slate-500 dark:text-slate-400 text-sm font-medium border-b">
          {daysOfWeek.map((day, i) => (
            <div key={i} className="py-2">{day}</div>
          ))}
        </div>
      </div>
      <div className="w-full px-5 pt-4">{generateCalendar}</div>
    </div>
  );
};

// Reuse your Select component as-is
export interface SelectProps {
  name: string;
  value: string;
  label?: string;
  options: { name: string; value: string }[];
  onChange: (_event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const Select = ({ name, value, label, options, onChange, className }: SelectProps) => (
  <div className={`relative ${className}`}>
    {label && <label htmlFor={name} className="block mb-1">{label}</label>}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="cursor-pointer rounded border border-gray-300 bg-white text-sm py-1.5 pl-2 pr-6 dark:bg-gray-900 dark:text-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.name}</option>
      ))}
    </select>
    <span className="absolute right-1 top-2 pointer-events-none">▼</span>
  </div>
);
