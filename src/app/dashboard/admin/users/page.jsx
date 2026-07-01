"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AlertDialog, Button } from "@heroui/react";
import { toggleSellerVerification } from "@/lib/api/admin";

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
      await toggleSellerVerification(userId, !currentVerification);
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
      <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Manage Users</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Monitor platform users, manage bans, and clean up accounts.</p>
          </div>
          
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="pl-10 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:zinc-100/50 text-zinc-900 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 dark:text-zinc-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-max">
              <thead>
                <tr className="border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-sm uppercase tracking-wider font-bold">
                  <th className="pb-4 px-4 whitespace-nowrap">User</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Role</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Status</th>
                  <th className="pb-4 px-4 whitespace-nowrap">Joined</th>
                  <th className="pb-4 px-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${
                        user.role === 'admin' ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white' :
                        user.role === 'seller' ? 'bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700' :
                        'bg-transparent text-zinc-600 border-zinc-200 dark:border-zinc-800'
                      }`}>
                        {user.role || 'Buyer'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {user.banned ? (
                        <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-transparent text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 border-dashed line-through">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white border border-zinc-200 dark:border-zinc-700">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {user.role !== 'admin' && (
                        <div className="flex justify-end gap-2">
                          {user.role === 'seller' && (
                            user.isVerified ? (
                              <div className="flex items-center gap-1 text-zinc-900 bg-zinc-100 dark:bg-zinc-800 dark:text-white px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700">
                                <span className="material-symbols-outlined text-[16px]">verified</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
                              </div>
                            ) : (
                              <AlertDialog>
                                <Button className="px-3 min-w-0 h-8 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded transition-colors uppercase tracking-wider">
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
                            <Button className="px-3 min-w-0 h-8 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold text-xs rounded transition-colors uppercase tracking-wider">
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
                            <Button className="px-3 min-w-0 h-8 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded transition-colors uppercase tracking-wider">
                              Delete
                            </Button>
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
