"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    
    // Simulate API call to update profile
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-outfit">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>
        
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-gray-950 font-bold text-3xl uppercase">
            {formData.name.charAt(0) || "U"}
          </div>
          <div>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-900 dark:text-white rounded-xl text-sm font-medium transition-colors border border-gray-200 dark:border-white/10">
              Change Avatar
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">JPG, GIF or PNG. Max size 2MB.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Full Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Email Address</label>
              <input 
                type="email" 
                value={formData.email}
                disabled
                className="w-full bg-gray-100/80 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-500 cursor-not-allowed" 
              />
              <p className="text-xs text-gray-500 dark:text-gray-500">Email cannot be changed directly.</p>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-gray-900 dark:text-white font-medium rounded-xl transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : "Save Changes"}
            </button>
            
            {successMsg && (
              <span className="text-emerald-400 text-sm font-medium animate-fade-in">
                {successMsg}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
