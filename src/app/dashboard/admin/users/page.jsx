"use client";

import { useEffect, useState } from "react";
import { mockApi } from "@/services/mockApi";

export default function AdminUsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await mockApi.getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleVerify = async (userId) => {
    try {
      const updatedUser = await mockApi.verifySeller(userId);
      setUsers(users.map(u => u._id === userId ? updatedUser : u));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm("Are you sure you want to ban/delete this user?")) {
      try {
        await mockApi.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/40 to-gray-900 border border-emerald-500/20 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white font-outfit">
          User Management
        </h1>
        <p className="text-gray-400 mt-2">Manage buyers, verify sellers, and moderate accounts.</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-4 font-medium">User</th>
                  <th className="pb-4 font-medium">Email</th>
                  <th className="pb-4 font-medium">Role</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user._id} className="text-gray-300 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-lime-400 rounded-full flex items-center justify-center text-gray-950 font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-400">{user.email}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        user.role === 'seller' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      } border`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4">
                      {user.role === 'seller' ? (
                        user.isVerified ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Pending
                          </span>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.role === 'seller' && !user.isVerified && (
                          <button 
                            onClick={() => handleVerify(user._id)}
                            className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium transition-colors border border-emerald-500/20"
                          >
                            Verify
                          </button>
                        )}
                        {user.role !== 'admin' && (
                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/20"
                          >
                            Ban
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
