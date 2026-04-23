import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Mail, Lock, AlertCircle, Shield, X } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userResponse = await login({ email, password });
      const role = userResponse?.role || "user";
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = () => {
    setEmail("admin@primetask.com");
    setPassword("Admin@123");
    setShowDemoModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617] relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
      
      <div className="w-full max-w-md glass-card p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="bg-indigo-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-indigo-500" size={32} />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">Authentication Portal</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl mb-6 flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="email"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input
                type="password"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-indigo-500/50 transition-all text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-800/50 space-y-4">
          <button 
            onClick={() => setShowDemoModal(true)}
            className="w-full py-3 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.95]"
          >
            <Shield size={16} className="text-indigo-500" /> Administrative Session
          </button>
          
          <p className="text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-500 hover:underline font-bold">Join Workspace</Link>
          </p>
        </div>
      </div>

      {/* Demo Credentials Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#0b0f1a] border border-white/10 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowDemoModal(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <div className="bg-indigo-600/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-indigo-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">System Credentials</h3>
              <p className="text-sm text-slate-500 mt-2">Use the following to bypass security</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Email</p>
                <p className="text-sm font-mono text-indigo-400">admin@primetask.com</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Password</p>
                <p className="text-sm font-mono text-indigo-400">Admin@123</p>
              </div>
            </div>

            <button 
              onClick={fillDemoCreds}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
            >
              Populate & Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
