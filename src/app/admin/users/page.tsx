"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  UserPlus,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  MoreVertical,
  Filter,
  Download,
} from "lucide-react";
import { useAdmin, AdminUser, UserRole } from "@/context/AdminContext";
import { Modal } from "@/components/ui/modal";
import { adminCreateUser } from "@/actions/admin";

export default function AdminUsersPage() {
  const { users, toggleUserActive, updateUserRole, addNewUser } = useAdmin();

  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Create User modal
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer" as UserRole,
    locality: "",
    city: "Bengaluru",
    isActive: true,
    avatarColor: "bg-blue-600 text-white",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (activeFilter === "active" && !u.isActive) return false;
      if (activeFilter === "inactive" && u.isActive) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          u.city.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [users, roleFilter, activeFilter, searchQuery]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email) return;

    try {
      await adminCreateUser({
        email: newUserData.email,
        fullName: newUserData.name,
        phone: newUserData.phone,
        role: newUserData.role,
      });
    } catch (err) {
      console.warn("Could not create user via admin server action:", err);
    }

    addNewUser({
      ...newUserData,
      avatarColor:
        newUserData.role === "admin"
          ? "bg-purple-600 text-white"
          : newUserData.role === "business_owner"
          ? "bg-indigo-600 text-white"
          : "bg-blue-600 text-white",
    });

    setAddUserModalOpen(false);
    setNewUserData({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      locality: "",
      city: "Bengaluru",
      isActive: true,
      avatarColor: "bg-blue-600 text-white",
    });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. HEADER ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#1E3A8A] font-sans">
              User & Account Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-blue-200">
              {users.length} registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Oversee customer profiles, service provider credentials, and platform administrator roles.
          </p>
        </div>

        <button
          onClick={() => setAddUserModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white font-bold text-xs shadow-xs hover:brightness-110 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add User</span>
        </button>
      </div>

      {/* ── 2. ROLE TABS ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        {[
          { key: "all", label: "All Accounts", count: users.length },
          {
            key: "customer",
            label: "Customers",
            count: users.filter((u) => u.role === "customer").length,
          },
          {
            key: "business_owner",
            label: "Business Owners",
            count: users.filter((u) => u.role === "business_owner").length,
          },
          {
            key: "admin",
            label: "Administrators",
            count: users.filter((u) => u.role === "admin").length,
          },
        ].map((tab) => {
          const isActive = roleFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#1E3A8A] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 3. SEARCH & FILTERS ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, phone or city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-400 focus:outline-none text-slate-800 placeholder-slate-400 text-xs"
          />
        </div>

        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-none text-xs cursor-pointer self-end sm:self-auto"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive / Suspended</option>
        </select>
      </div>

      {/* ── 4. USERS DATA TABLE ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">User & Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Activity & Association</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No users match your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User & Contact */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${u.avatarColor}`}
                        >
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                          <div className="text-[10px] text-slate-400">{u.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : u.role === "business_owner"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {u.role === "admin" && <Shield className="w-3 h-3" />}
                        {u.role.replace("_", " ")}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{u.locality || "—"}</div>
                      <div className="text-[11px] text-slate-500">{u.city}</div>
                    </td>

                    {/* Activity & Association */}
                    <td className="px-4 py-3.5">
                      {u.associatedBusinessName ? (
                        <div className="font-semibold text-slate-800 truncate max-w-[180px]">
                          {u.associatedBusinessName}
                        </div>
                      ) : (
                        <div className="text-slate-500">
                          {u.totalEnquiriesOrBookings} enquiries placed
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400">
                        Active: {u.lastActive}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => toggleUserActive(u.id)}
                        className={`font-bold transition-colors cursor-pointer ${
                          u.isActive
                            ? "text-rose-600 hover:text-rose-800"
                            : "text-emerald-600 hover:text-emerald-800"
                        }`}
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>

                      {u.role !== "admin" && (
                        <button
                          onClick={() => {
                            const newRole: UserRole =
                              u.role === "customer" ? "business_owner" : "customer";
                            updateUserRole(u.id, newRole);
                          }}
                          className="text-[#2563EB] hover:underline font-semibold cursor-pointer"
                        >
                          Switch Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. ADD USER MODAL ───────────────────────────────────────────── */}
      {addUserModalOpen && (
        <Modal
          isOpen={addUserModalOpen}
          onClose={() => setAddUserModalOpen(false)}
          title="Create New User Account"
          description="Provision a new verified customer, business owner or administrative user"
        >
          <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                placeholder="e.g. Alok Sharma"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="alok@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Account Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, role: e.target.value as UserRole })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="customer">Customer</option>
                  <option value="business_owner">Business Owner</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Metro City</label>
                <select
                  value={newUserData.city}
                  onChange={(e) => setNewUserData({ ...newUserData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Locality / Neighborhood</label>
              <input
                type="text"
                value={newUserData.locality}
                onChange={(e) => setNewUserData({ ...newUserData, locality: e.target.value })}
                placeholder="e.g. Koramangala or Safdarjung"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAddUserModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white font-bold transition-all shadow-xs cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

