"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AlertDialog, Button } from "@heroui/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
          searchValue: search || undefined
        }
      });
      if (data && data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleBanUser = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await authClient.admin.unbanUser({ userId });
      } else {
        await authClient.admin.banUser({ userId, banReason: "Admin action" });
      }
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user ban status:", error);
    }
  };

  const handleVerifySeller = async (userId, currentVerification) => {
    try {
      await fetch(`${API_URL}/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !currentVerification })
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to verify seller:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await authClient.admin.removeUser({ userId });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-outfit">Manage Users</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Monitor platform users, manage bans, and clean up accounts.</p>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 text-gray-600 dark:border-white/10 text-sm">
                  <th className="pb-4 font-medium px-4">User</th>
                  <th className="pb-4 font-medium px-4">Role</th>
                  <th className="pb-4 font-medium px-4">Status</th>
                  <th className="pb-4 font-medium px-4">Joined</th>
                  <th className="pb-4 font-medium px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="text-gray-800 dark:text-gray-300 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        user.role === 'seller' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                      }`}>
                        {user.role || 'Buyer'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {user.banned ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {user.role !== 'admin' && (
                        <div className="flex justify-end gap-2">
                          {user.role === 'seller' && (
                            user.isVerified ? (
                              <div className="flex items-center gap-1 text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/20">
                                <span className="material-symbols-outlined text-[16px]">verified</span>
                                <span className="text-xs font-semibold">Verified</span>
                              </div>
                            ) : (
                              <AlertDialog>
                                <Button variant="solid" color="primary" size="sm">
                                  Verify
                                </Button>
                                <AlertDialog.Backdrop>
                                  <AlertDialog.Container>
                                    <AlertDialog.Dialog className="sm:max-w-[400px]">
                                      <AlertDialog.CloseTrigger />
                                      <AlertDialog.Header>
                                        <AlertDialog.Icon status="primary" />
                                        <AlertDialog.Heading>Verify Seller?</AlertDialog.Heading>
                                      </AlertDialog.Header>
                                      <AlertDialog.Body>
                                        <p>
                                          Are you sure you want to grant a verification badge to <strong>{user.name}</strong>?
                                        </p>
                                      </AlertDialog.Body>
                                      <AlertDialog.Footer>
                                        <Button slot="close" variant="tertiary">Cancel</Button>
                                        <Button slot="close" color="primary" onPress={() => handleVerifySeller(user.id, user.isVerified)}>
                                          Yes, Verify
                                        </Button>
                                      </AlertDialog.Footer>
                                    </AlertDialog.Dialog>
                                  </AlertDialog.Container>
                                </AlertDialog.Backdrop>
                              </AlertDialog>
                            )
                          )}

                          <AlertDialog>
                            <Button variant={user.banned ? "solid" : "flat"} color={user.banned ? "success" : "warning"} size="sm">
                              {user.banned ? "Unban" : "Ban"}
                            </Button>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Icon status={user.banned ? "success" : "warning"} />
                                    <AlertDialog.Heading>{user.banned ? "Unban User?" : "Ban User?"}</AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <p>
                                      Are you sure you want to {user.banned ? "unban" : "ban"} <strong>{user.name}</strong>?
                                    </p>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close" variant="tertiary">Cancel</Button>
                                    <Button slot="close" color={user.banned ? "success" : "warning"} onPress={() => handleBanUser(user.id, user.banned)}>
                                      Yes, {user.banned ? "Unban" : "Ban"}
                                    </Button>
                                  </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                              </AlertDialog.Container>
                            </AlertDialog.Backdrop>
                          </AlertDialog>

                          <AlertDialog>
                            <Button variant="danger" size="sm">Delete</Button>
                            <AlertDialog.Backdrop>
                              <AlertDialog.Container>
                                <AlertDialog.Dialog className="sm:max-w-[400px]">
                                  <AlertDialog.CloseTrigger />
                                  <AlertDialog.Header>
                                    <AlertDialog.Icon status="danger" />
                                    <AlertDialog.Heading>Delete User Account?</AlertDialog.Heading>
                                  </AlertDialog.Header>
                                  <AlertDialog.Body>
                                    <p>
                                      This will permanently delete <strong>{user.name}</strong> and all of their data. This action cannot be undone.
                                    </p>
                                  </AlertDialog.Body>
                                  <AlertDialog.Footer>
                                    <Button slot="close" variant="tertiary">Cancel</Button>
                                    <Button slot="close" variant="danger" onPress={() => handleDeleteUser(user.id)}>
                                      Yes, Delete
                                    </Button>
                                  </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                              </AlertDialog.Container>
                            </AlertDialog.Backdrop>
                          </AlertDialog>
                        </div>
                      )}
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
