import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { taskService } from "../services/api";
import { 
  Plus, Search, Filter, LogOut, CheckCircle2, Circle, 
  Clock, AlertTriangle, MoreVertical, Trash2, Edit2, Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import TaskModal from "../components/TaskModal";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      const res = await taskService.getTasks({ 
        search, 
        status: statusFilter 
      });
      setTasks(res.data.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data) => {
    try {
      if (selectedTask) {
        await taskService.updateTask(selectedTask._id, data);
      } else {
        await taskService.createTask(data);
      }
      fetchTasks();
    } catch (err) {
      throw err; // Propagate to modal
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(id);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await taskService.updateTask(id, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default: return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "in-progress": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default: return "text-slate-400 bg-slate-800/80 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Navbar omitted for brevity but remains same */}
      <nav className="glass-card border-x-0 border-t-0 rounded-none px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <CheckCircle2 className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight">PrimeTask</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user?.role === "admin" && (
            <Link to="/admin" className="text-indigo-500 font-medium flex items-center gap-1.5 hover:bg-slate-800 px-2 sm:px-3 py-1.5 rounded-lg transition-all">
              <Shield size={16} /> <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          )}
          <div className="h-8 w-[1px] bg-slate-800"></div>
          <button onClick={logout} className="btn btn-outline p-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Workspace Overview</h2>
            <p className="text-slate-400 mt-1 text-sm md:text-base">Efficiently track and manage your assignments</p>
          </div>
          <button 
            onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
            className="btn btn-primary flex items-center justify-center gap-2 px-6 py-3"
          >
            <Plus size={20} /> Create New Task
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="relative col-span-1 sm:col-span-2">
            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchTasks()}
            />
          </div>
          <select 
            className="input-field appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="" className="bg-slate-900">All Statuses</option>
            <option value="pending" className="bg-slate-900">Pending</option>
            <option value="in-progress" className="bg-slate-900">In Progress</option>
            <option value="completed" className="bg-slate-900">Completed</option>
          </select>
        </div>

        {/* Task Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Task Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Priority</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-6 py-8 bg-slate-800/10"></td>
                    </tr>
                  ))
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-200">{task.title}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-[200px]">{task.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block w-full max-w-[140px]">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                            className={`w-full text-xs font-bold py-1.5 px-3 rounded-lg outline-none border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${getStatusStyle(task.status)}`}
                          >
                            <option value="pending" className="bg-slate-900 text-slate-300">Pending</option>
                            <option value="in-progress" className="bg-slate-900 text-amber-500">In Progress</option>
                            <option value="completed" className="bg-slate-900 text-emerald-500">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase font-bold py-1 px-2 rounded border ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(task)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(task._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                      No tasks matched your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedTask(null); }}
        onSubmit={handleCreateTask}
        initialData={selectedTask ? {
          ...selectedTask,
          dueDate: new Date(selectedTask.dueDate).toISOString().split('T')[0]
        } : null}
      />
    </div>
  );
};

export default Dashboard;
