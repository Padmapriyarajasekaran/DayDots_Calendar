'use client';

import React, { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/styles/calendar.css';
import { motion } from "framer-motion";
import { Sun, Moon, Trash2 } from "lucide-react";
import { useTheme } from '@/app/ThemeProvider';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DemoWrapper() {
  const { darkMode, toggleDarkMode } = useTheme();

  const today = new Date();
  const [events, setEvents] = useState<{ date: string; description: string; completed: boolean }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState("");
  const [currentDate, setCurrentDate] = useState<Date>(today);

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleAddEvent = () => {
    if (!newEvent.trim() || !selectedDate) return;
    setEvents(prev => [...prev, { date: selectedDate, description: newEvent, completed: false }]);
    setNewEvent("");
  };

  const handleDeleteEvent = (index: number) => {
    setEvents(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCompleted = (index: number) => {
    setEvents(prev => prev.map((e, i) => i === index ? { ...e, completed: !e.completed } : e));
  };

  return (
    <div className={`relative flex h-screen w-full flex-col items-center justify-start p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow"
      >
        {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-700" />}
      </button>

      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-400 animate-gradient-x opacity-40 pointer-events-none" />

            <h1
        className="text-4xl font-bold mb-6"
        style={{ fontFamily: '"Chewy", cursive', fontWeight: 400, fontStyle: 'normal' }}
      >
        📅 DayDots Calendar
      </h1>


      <motion.div
        className="w-full max-w-5xl overflow-auto rounded-xl bg-white dark:bg-gray-800 shadow-lg p-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Calendar
          onClickDay={(value: Date) => setSelectedDate(formatDate(value))}
          value={currentDate}
          defaultActiveStartDate={today}
          className={`${darkMode ? 'dark-calendar' : ''}`}
          formatShortWeekday={(locale, date) =>
            ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
          }
          tileContent={({ date }) => {
            const dateStr = formatDate(date);
            const dayEvents = events.filter(e => e.date === dateStr);

            return (
              <div className="mt-1 flex flex-col items-start space-y-1">
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className={`text-xs rounded px-1 py-0.5 ${event.completed ? 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-200 line-through' : 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-200'}`}
                  >
                    {event.description}
                  </div>
                ))}
              </div>
            );
          }}
        />
      </motion.div>

      {/* Dialog for adding/viewing events */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Events for {selectedDate}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="Add event description"
              />
              <Button onClick={handleAddEvent}>Add</Button>
            </div>

            <div className="max-h-48 overflow-auto space-y-1">
              {events
                .map((e, idx) => ({ ...e, index: idx }))
                .filter(e => e.date === selectedDate)
                .map((event) => (
                  <div
                    key={event.index}
                    className="flex items-center justify-between p-2 rounded border dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={event.completed}
                        onChange={() => toggleCompleted(event.index)}
                      />
                      <span className={`${event.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                        {event.description}
                      </span>
                    </div>
                    <button onClick={() => handleDeleteEvent(event.index)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDate(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}