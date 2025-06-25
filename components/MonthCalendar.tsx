'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Event {
  date: string;
  description: string;
}

interface MonthCalendarProps {
  year: number;
  month: number; // 0-based (0=January)
  onDateClick: (date: string) => void;
  events: Event[];
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({ year, month, onDateClick, events }) => {
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);

  const weeks: (number | null)[][] = [];
  let currentDay = 1 - firstDayOfMonth;

  while (currentDay <= daysInMonth) {
    const week: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay > 0 && currentDay <= daysInMonth) {
        week.push(currentDay);
      } else {
        week.push(null);
      }
      currentDay++;
    }
    weeks.push(week);
  }

  const getDateString = (day: number) => `${year}-${month + 1}-${day}`;

  return (
    <div className="w-full">
      {/* Days of week header */}
      <div className="grid grid-cols-7 bg-gray-200 dark:bg-gray-700 text-center font-medium">
        {daysOfWeek.map((d) => (
          <div key={d} className="p-2 border border-gray-300 dark:border-gray-600">{d}</div>
        ))}
      </div>

      {/* Date cells */}
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day, di) => (
            <motion.div
              key={di}
              className="h-24 p-1 border border-gray-300 dark:border-gray-600 relative cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 transition"
              onClick={() => day && onDateClick(getDateString(day))}
              whileHover={{ scale: 1.02 }}
            >
              {day && (
                <div className="text-xs font-medium text-gray-800 dark:text-white">{day}</div>
              )}

              {/* Events */}
              <div className="absolute top-5 left-0 right-0 px-1 overflow-hidden">
                {events
                  .filter(e => e.date === getDateString(day!))
                  .map((e, i) => (
                    <div
                      key={i}
                      className="text-[10px] truncate bg-blue-500 text-white rounded px-1 mt-1"
                    >
                      {e.description}
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};
