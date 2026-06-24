import React from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { User, Shield, CheckCircle2, XCircle, Clock, Trash2, Power } from 'lucide-react';
import { toast } from 'sonner';

export default function Admin() {
  const { users, autoApprove, toggleAutoApprove, updateUserStatus, deleteUser, user: currentUser } = useAuth();

  const handleStatusChange = (userId: string, status: 'approved' | 'revoked') => {
    updateUserStatus(userId, status);
    toast.success(`User access ${status}`);
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      toast.success('User deleted');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage employee access to the loyalty portal
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Auto-Approve Users</span>
                <span className="text-xs text-muted-foreground">New signups get instant access</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoApprove}
                onClick={toggleAutoApprove}
                className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${autoApprove ? 'bg-primary' : 'bg-input'}`}
              >
                <span className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${autoApprove ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/40">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Employee Management
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Employee</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-foreground capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {user.status === 'approved' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          {user.status === 'pending' && <Clock className="w-4 h-4 text-amber-500" />}
                          {user.status === 'revoked' && <XCircle className="w-4 h-4 text-destructive" />}
                          <span className={`capitalize font-medium
                            ${user.status === 'approved' ? 'text-emerald-500' : ''}
                            ${user.status === 'pending' ? 'text-amber-500' : ''}
                            ${user.status === 'revoked' ? 'text-destructive' : ''}
                          `}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.id !== currentUser?.id && (
                          <div className="flex items-center justify-end gap-2">
                            {user.status !== 'approved' && (
                              <button
                                onClick={() => handleStatusChange(user.id, 'approved')}
                                className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 h-8 px-3 gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                            )}
                            {user.status !== 'revoked' && (
                              <button
                                onClick={() => handleStatusChange(user.id, 'revoked')}
                                className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 h-8 px-3 gap-1.5"
                              >
                                <Power className="w-3.5 h-3.5" />
                                Revoke
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-transparent hover:bg-destructive/10 text-destructive h-8 w-8 p-0 ml-1"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {user.id === currentUser?.id && (
                          <span className="text-xs text-muted-foreground italic">Current user</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No employees found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
