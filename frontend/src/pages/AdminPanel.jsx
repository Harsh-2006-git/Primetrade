import React, { useState, useEffect } from "react";
import { adminService } from "../services/api";
import { 
  Users, Layers, CheckCircle, Clock, 
  BarChart3, ShieldAlert, ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("analytics");
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, tasksRes] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          adminService.getAllTasks()
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
        setAllTasks(tasksRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 font-medium tracking-widest">ESTABLISHING CONNECTION...</p>
    </div>
  );

  const renderAnalytics = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "text-blue-500" },
          { label: "Platform Tasks", value: stats?.totalTasks, icon: Layers, color: "text-indigo-500" },
          { label: "Active Nodes", value: stats?.activeUsers, icon: ShieldAlert, color: "text-amber-500" },
          { label: "Success Rate", value: stats?.totalTasks ? Math.round(((stats?.statusStats?.completed || 0) / stats.totalTasks) * 100) + "%" : "0%", icon: CheckCircle, color: "text-emerald-500" },
        ].map((item, i) => (
          <div key={i} className="glass-card p-5 flex flex-col items-start">
            <div className={`p-2.5 rounded-xl mb-3 bg-slate-900 ${item.color}`}>
              <item.icon size={20} />
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</p>
            <h3 className="text-2xl font-bold">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-l-4 border-indigo-600">
          <h4 className="text-xl font-bold mb-8">Task Distribution</h4>
          <div className="space-y-6">
            {['pending', 'in-progress', 'completed'].map((status) => {
              const count = stats?.statusStats?.[status] || 0;
              const per = stats?.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm font-bold mb-2 uppercase tracking-tighter">
                    <span className="text-slate-400">{status}</span>
                    <span className="text-indigo-400">{count}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${per}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="glass-card p-8 border-l-4 border-amber-500">
          <h4 className="text-xl font-bold mb-8">Priority Insights</h4>
          <div className="space-y-6">
            {['high', 'medium', 'low'].map((priority) => {
              const count = stats?.priorityStats?.[priority] || 0;
              const per = stats?.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0;
              const colors = priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500';
              return (
                <div key={priority}>
                  <div className="flex justify-between text-sm font-bold mb-2 uppercase tracking-tighter">
                    <span className="text-slate-400">{priority}</span>
                    <span className="text-slate-300">{count}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`${colors} h-full rounded-full transition-all duration-1000`} style={{ width: `${per}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">User Identity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Privilege</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Registered On</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-slate-800/20">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-200">{u.fullName}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${u.role === 'admin' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5' : 'border-slate-800 text-slate-500'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAllTasks = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-900 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Task & Creator</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Priority</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {allTasks.map(t => (
                <tr key={t._id} className="hover:bg-slate-800/20">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-200">{t.title}</p>
                    <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-tight">By {t.createdBy?.fullName || 'System'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold capitalize text-slate-400">{t.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      t.priority === 'high' ? 'border-red-500/20 text-red-500' : 'border-blue-500/20 text-blue-500'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {new Date(t.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row text-slate-100 pb-20 md:pb-0">
      {/* Sidebar (Desktop) */}
      <aside className="w-72 border-r border-slate-800/50 hidden md:flex flex-col sticky top-0 h-screen bg-[#03081c]">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl">
              <ShieldAlert className="text-white" size={24} />
            </div>
            <div>
              <span className="text-xl font-bold block leading-none">PRIME</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Administrator</span>
            </div>
          </div>
        </div>

        <nav className="px-4 py-8 flex-1 space-y-1.5">
          {[
            { id: "analytics", label: "Dashboard", icon: BarChart3 },
            { id: "users", label: "Users List", icon: Users },
            { id: "tasks", label: "Global Task Log", icon: Layers },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-sm transition-all group ${
                activeTab === item.id ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} /> {item.label}
              </div>
              <div className={`w-1.5 h-1.5 rounded-full bg-indigo-400 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`}></div>
            </button>
          ))}
        </nav>

        <div className="p-8 bg-slate-900/50">
          <Link to="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-white transition-all font-bold text-sm">
            <ArrowLeft size={18} /> Exit Management
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 md:mb-16">
          <div className="h-2 w-16 md:w-24 bg-indigo-600 rounded-full mb-2 md:mb-4"></div>
          <p className="text-[10px] md:text-xs font-mono text-slate-500 font-bold uppercase tracking-widest">{time} • SECURED CONN</p>
        </header>

        {activeTab === "analytics" && renderAnalytics()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "tasks" && renderAllTasks()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#03081c]/90 backdrop-blur-xl border-t border-slate-800/50 p-2 sm:p-4 flex justify-around items-center z-50">
        {[
          { id: "analytics", label: "Overview", icon: BarChart3 },
          { id: "users", label: "Users", icon: Users },
          { id: "tasks", label: "Global", icon: Layers },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              activeTab === item.id ? "text-indigo-400" : "text-slate-500"
            }`}
          >
            <item.icon size={20} className="mb-1" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
        <div className="w-[1px] h-8 bg-slate-800"></div>
        <Link to="/dashboard" className="flex flex-col items-center justify-center p-2 text-slate-500 rounded-xl transition-all">
          <ArrowLeft size={20} className="mb-1" />
          <span className="text-[10px] font-bold">Exit</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
