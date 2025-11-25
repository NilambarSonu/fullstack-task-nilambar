"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import Cookies from "js-cookie";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../components/NotificationContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  Settings,
  LogOut,
  Plus,
  Search,
  User,
  Check,
  Trash2
} from "lucide-react";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + "y ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + "mo ago";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + "d ago";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + "h ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + "m ago";
  return "Just now";
};

export default function Dashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const { notifications, addNotification } = useNotifications();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, active: true },
    { id: "tasks", label: "My Tasks", icon: CheckSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "logout", label: "Log out", icon: LogOut },
  ];

  const categories = [
    { name: "Work", count: 12, avatars: 3 },
    { name: "Family", count: 5, avatars: 2 },
    { name: "Health", count: 8, avatars: 1 },
  ];

  const comments = [
    { id: 1, text: "Market research", time: "2 hours ago" },
    { id: 2, text: "Design feedback", time: "4 hours ago" },
    { id: 3, text: "Client meeting notes", time: "1 day ago" },
  ];

  const taskProgress = {
    todayProgress: 75,
    weekProgress: 60,
    monthProgress: 45
  };

  const [categoryProgress] = useState(() =>
    categories.map(() => Math.floor(Math.random() * 100))
  );

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    remaining: tasks.length - tasks.filter(t => t.completed).length,
    percentage: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  };

  const calendarDays = [
    26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8
  ];
  const currentDay = new Date().getDate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const [userRes, tasksRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/tasks"),
        ]);
        setUser(userRes.data);
        setTasks(tasksRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        Cookies.remove("token");
        router.push("/login");
      }
    };
    fetchData();
  }, [router]);

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      const res = await api.post("/tasks", newTask);
      setTasks([res.data, ...tasks]);
      
      addNotification({
        type: "Task Created",
        message: `"${newTask.title}" was created successfully`,
      });

      setNewTask({ title: "", description: "" });
      setShowNewTaskModal(false);
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const updatedTasks = tasks.map((t) => 
        t._id === task._id ? { ...t, completed: !t.completed } : t
      );
      setTasks(updatedTasks);
      await api.put(`/tasks/${task._id}`, { completed: !task.completed });
    } catch (err) {
      console.error("Error updating task", err);
      setTasks(tasks); 
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
        console.error("Error deleting task", err);
    }
  }

  const handleNavigation = useCallback((navId) => {
    if (navId === "logout") {
      logout();
      router.push("/login");
    } else {
      setActiveNav(navId);
    }
  }, [logout, router]);


  if (loading) return <div className="flex items-center justify-center min-h-screen bg-slate-950"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div></div>;

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-white flex relative z-10">
      <div className="w-64 min-h-screen bg-slate-900/60 backdrop-blur-md border-r border-cyan-500/30 hidden lg:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold neon-glow-cyan mb-8">NEXUS</h1>
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeNav === item.id
                    ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-cyan-300"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-slate-900/60 backdrop-blur-md border-b border-cyan-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full bg-slate-800/50 border border-cyan-500/30 rounded-lg px-10 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 ml-4">
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center gap-2 font-medium transition-all duration-300 transform hover:scale-105"
              >
                <Plus size={20} />
                New Task
              </button>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            <div className="lg:col-span-1 xl:col-span-1 bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4">
              <h3 className="text-lg font-bold text-slate-200 mb-4 neon-glow-cyan">Calendar</h3>
              <div className="text-center mb-4">
                <div className="text-xl font-bold text-cyan-300">November 2025</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <div key={day} className="text-slate-400 p-2">{day}</div>
                ))}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md text-center cursor-pointer transition-all duration-200 ${
                      index < 6 ? 'text-slate-600' : 'text-slate-300 hover:bg-slate-800/50'
                    } ${day === currentDay ? 'bg-cyan-500/30 border border-cyan-400/50 text-cyan-300' : ''}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 xl:col-span-2 bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4">
              <h3 className="text-lg font-bold text-slate-200 mb-4 neon-glow-cyan">My Tasks</h3>
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task, index) => (
                  <div
                    key={task._id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      task.completed ? 'bg-slate-800/50' : 'bg-slate-800/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        task.completed
                          ? 'bg-green-500/20 border-green-400'
                          : 'border-cyan-400/50 hover:border-cyan-300'
                      }`}
                    >
                      {task.completed && <CheckSquare size={12} className="text-green-400" />}
                    </button>
                    <span className={`flex-1 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-slate-500">No tasks available</div>
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-1 bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4">
              <h3 className="text-lg font-bold text-slate-200 mb-4 neon-glow-cyan">New Comments</h3>
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-slate-800/30 rounded-lg">
                    <p className="text-slate-200 text-sm">{comment.text}</p>
                    <p className="text-slate-500 text-xs mt-1">{comment.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-1 bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4">
              <h3 className="text-lg font-bold text-slate-200 mb-4 neon-glow-cyan">Categories</h3>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        {Array.from({ length: category.avatars }).map((_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full border-2 border-slate-900"
                          />
                        ))}
                      </div>
                      <span className="text-slate-200">{category.name}</span>
                    </div>
                    <span className="text-cyan-400 font-medium">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 xl:col-span-3 bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-200 mb-6 neon-glow-cyan">Task Progress Analytics</h3>

              <div className="flex items-center justify-center mb-8">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - taskStats.percentage / 100)}`}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--neon-cyan)" />
                        <stop offset="100%" stopColor="var(--neon-purple)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-300 neon-glow-cyan">
                        {taskStats.percentage}%
                      </div>
                      <div className="text-xs text-slate-400">Complete</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Total Tasks</span>
                    <span className="text-white font-bold">{taskStats.total}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div className="bg-cyan-400 h-2 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Completed</span>
                    <span className="text-green-400 font-bold">{taskStats.completed}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${taskStats.percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 text-sm">Remaining</span>
                    <span className="text-purple-400 font-bold">{taskStats.remaining}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(taskStats.remaining / taskStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-slate-300 font-medium text-lg">Progress Breakdown</h5>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200">Today</span>
                    <span className="text-cyan-400 font-medium">{taskProgress.todayProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${taskProgress.todayProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">6 completed</span>
                    <span className="text-xs text-slate-500">8 total</span>
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200">This Week</span>
                    <span className="text-purple-400 font-medium">{taskProgress.weekProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${taskProgress.weekProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">24 completed</span>
                    <span className="text-xs text-slate-500">40 total</span>
                  </div>
                </div>

                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-200">This Month</span>
                    <span className="text-pink-400 font-medium">{taskProgress.monthProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-pink-400 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${taskProgress.monthProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500">54 completed</span>
                    <span className="text-xs text-slate-500">120 total</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {categories.slice(0, 4).map((category, idx) => (
                    <div key={category.name} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-200 font-medium">{category.name}</span>
                        <div className="flex -space-x-1">
                          {Array.from({ length: category.avatars }).map((_, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full border border-slate-700"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${categoryProgress[idx] || 50}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-cyan-400 font-medium">{category.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {showNotifications && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setShowNotifications(false)}>
          <div className="absolute top-16 right-32 w-80 bg-slate-900/95 backdrop-blur-md border border-cyan-500/30 rounded-xl p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-200 mb-4 neon-glow-cyan">Notifications</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No new notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-cyan-300 text-sm font-medium">{notif.type}</h4>
                        <p className="text-slate-300 text-xs mt-1">{notif.message}</p>
                      </div>
                      <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">{timeAgo(notif.time)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="w-full mt-4 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm">
              View All Notifications
            </button>
          </div>
        </div>
      )}

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowNewTaskModal(false)}>
          <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-8 w-full max-w-md shadow-[0_0_50px_rgba(34,211,238,0.15)] relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-6 neon-glow-cyan">Create New Task</h2>
            <form onSubmit={handleSaveTask} className="space-y-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Task Title</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="Enter task title..."
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Enter details..."
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 h-24 resize-none transition-all"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNewTaskModal(false)} className="px-5 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all">Cancel</button>
                <button type="submit" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] font-medium transition-all transform hover:scale-105">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
