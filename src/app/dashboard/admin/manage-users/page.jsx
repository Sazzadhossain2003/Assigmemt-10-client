'use client';
import { authClient } from '@/lib/auth-client';
import { api } from '@/lib/reusableApi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaTrashAlt,
  FaUsersCog,
  FaSearch,
  FaShieldAlt,
  FaCrown,
  FaUserShield,
} from 'react-icons/fa';
import { FiMoreVertical, FiMail, FiLayers } from 'react-icons/fi';
import ConfiremDeletModal from '../manage-lessons/ConfiremDeletModal';

const ManageUsersByAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false, type: '', user: null });

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/signin');
    }
  }, [session, isPending, router]);

  const getUsers = async () => {
    try {
      const data = await api.get('/admin/users');
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error.message);
      setLoading(false);
    }
  };

  const handlePromote = async () => {
    const targetUser = modal.user;
    setUsers(prev =>
      prev.map(u => (u._id === targetUser._id ? { ...u, role: 'admin' } : u)),
    );
    setModal({ isOpen: false, type: '', user: null });

    try {
      await api.patch(`/admin/users/role/${targetUser._id}`, {});
      toast.success(`${targetUser.name} is now an Admin!`);
    } catch (err) {
      getUsers();
      toast.error('Failed to promote user.');
    }
  };

  const handleDelete = async () => {
    const targetUser = modal.user;
    setUsers(prev => prev.filter(u => u._id !== targetUser._id));
    setModal({ isOpen: false, type: '', user: null });

    try {
      await api.delete(`/admin/users/${targetUser._id}`);
      toast.success('User removed from system.');
    } catch (err) {
      getUsers();
      toast.error('Deletion failed.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getInitials = name =>
    name ? name.substring(0, 2).toUpperCase() : '??';

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 lg:p-12 bg-[#f8fafc] min-h-screen text-slate-600 font-sans">
      <Toaster position="top-right" />

      <ConfiremDeletModal
        isOpen={modal.isOpen}
        type={modal.type}
        onClose={() => setModal({ isOpen: false, type: '', user: null })}
        onConfirm={modal.type === 'promote' ? handlePromote : handleDelete}
        title={modal.type === 'promote' ? 'Promote User' : 'Delete User'}
        message={
          modal.type === 'promote'
            ? `Grant Admin access to ${modal.user?.name}?`
            : `Are you sure you want to permanently delete ${modal.user?.name}?`
        }
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FaUsersCog className="text-indigo-600" /> User Directory
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Manage user roles, permissions and account status.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-8 py-4">User Details</th>
                <th className="px-8 py-4">Access Level</th>
                <th className="px-8 py-4 text-center">Lessons</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr
                  key={user._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <Link
                      href={`/author-profile/${user._id}`}
                      className="flex items-center gap-4"
                    >
                      <div className="w-11 h-11 rounded-full border border-slate-200 overflow-hidden shrink-0 group-hover:border-indigo-500 transition-all bg-slate-100">
                        {user.image || user.photoURL ? (
                          <Image
                            width={44}
                            height={44}
                            src={user.image || user.photoURL}
                            className="w-full h-full object-cover"
                            alt="user"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                            {getInitials(user.name)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-all">
                            {user.name}
                          </p>
                          {user.isPremium && (
                            <span
                              className="text-amber-500"
                              title="Premium member"
                            >
                              <FaCrown size={12} />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <FiMail size={10} /> {user.email}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`text-[10px] font-bold px-3 py-1 rounded-lg border flex w-fit items-center gap-1.5 ${
                        user.role === 'admin'
                          ? 'bg-indigo-50 border-indigo-100 text-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      {user.role === 'admin' && <FaUserShield size={10} />}
                      {user.role?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="inline-flex items-center gap-1 text-slate-700 font-bold px-3 py-1 bg-slate-100 rounded-full text-xs">
                      <FiLayers className="text-slate-400" size={12} />
                      {user.totalLessons || 0}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() =>
                            setModal({ isOpen: true, type: 'promote', user })
                          }
                          className="text-[10px] font-bold uppercase bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-all rounded-lg shadow-sm shadow-indigo-100"
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        disabled={session?.user?.id === user._id}
                        onClick={() =>
                          setModal({ isOpen: true, type: 'delete', user })
                        }
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-20"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(user => (
            <div
              key={user._id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <Link
                  href={`/author-profile/${user._id}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center">
                    {user.image ? (
                      <Image
                        width={48}
                        height={48}
                        src={user.image}
                        className="rounded-full"
                        alt="img"
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-400">
                        {getInitials(user.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {user.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                </Link>
                <div className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600">
                  {user.role}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="text-xs font-bold text-slate-500">
                  <span className="text-indigo-600 text-base">
                    {user.totalLessons || 0}
                  </span>{' '}
                  Lessons
                </div>
                <div className="flex gap-2">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() =>
                        setModal({ isOpen: true, type: 'promote', user })
                      }
                      className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <FaShieldAlt size={14} />
                    </button>
                  )}
                  <button
                    disabled={session?.user?.id === user._id}
                    onClick={() =>
                      setModal({ isOpen: true, type: 'delete', user })
                    }
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <FaTrashAlt size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageUsersByAdminPage;
