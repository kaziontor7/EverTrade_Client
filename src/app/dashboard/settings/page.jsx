"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "@heroui/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.danger("Image size must be less than 2MB");
      return;
    }

    setIsUploading(true);
    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMG_API}`, {
        method: "POST",
        body: imageFormData,
      });
      const result = await response.json();
      
      if (result.success) {
        const imageUrl = result.data.display_url;
        setFormData(prev => ({ ...prev, image: imageUrl }));
        
        // Auto-save the image to the backend profile immediately
        const { error } = await authClient.updateUser({
          image: imageUrl
        });

        if (!error) {
          toast.success("Avatar updated successfully!");
        } else {
          toast.danger("Avatar uploaded, but failed to save to profile.");
        }
      } else {
        toast.danger("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.danger("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.danger("Name cannot be empty");
      return;
    }

    setIsSaving(true);
    
    try {
      const { data, error } = await authClient.updateUser({
        name: formData.name,
        image: formData.image,
      });

      console.log("UPDATE USER RESPONSE:", { data, error });

      if (!error) {
        toast.success("Profile updated successfully!");
      } else {
        toast.danger(error.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.danger("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
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
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-gray-950 font-bold text-3xl uppercase overflow-hidden relative group">
            {formData.image ? (
              <img src={formData.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              formData.name.charAt(0) || "U"
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-900 dark:text-white rounded-xl text-sm font-medium transition-colors border border-gray-200 dark:border-white/10 disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Change Avatar"}
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
          </div>
        </form>
      </div>
    </div>
  );
}
