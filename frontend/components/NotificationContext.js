"use client";
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "Task Reminder", message: '"Complete wireframe" is due soon', time: new Date(new Date() - 1000 * 60 * 2) },
    { id: 2, type: "Task Completed", message: '"Review design feedback" marked complete', time: new Date(new Date() - 1000 * 60 * 60) },
  ]);

  const addNotification = ({ type, message }) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      time: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}