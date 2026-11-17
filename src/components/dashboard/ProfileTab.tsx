'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle2, Save, Camera } from 'lucide-react';
import { CURRENT_USER } from '@/data/userMockData';
import { SUPPORTED_LOCATIONS } from '@/data/locations';
import { Button } from '@/components/common/Button';

export const ProfileTab: React.FC = () => {
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [phone, setPhone] = useState(CURRENT_USER.phone);
  const [city, setCity] = useState(CURRENT_USER.city);
  const [locality, setLocality] = useState(CURRENT_USER.locality);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 600);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#DBEAFE] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#1E3A8A]">My Profile</h2>
          <p className="text-xs text-slate-500">Manage your personal information and contact preferences</p>
        </div>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Customer Account
        </span>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={CURRENT_USER.avatarUrl}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-50"
            />
            <button
              type="button"
              onClick={() => alert('Photo upload dialog simulated.')}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-transform hover:scale-105"
              aria-label="Change photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E3A8A]">{name}</h4>
            <p className="text-xs text-slate-400">JPG or PNG under 2MB</p>
            <span className="text-[11px] text-blue-600 font-semibold block mt-1">
              Member since {CURRENT_USER.memberSince}
            </span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary City
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
              >
                {SUPPORTED_LOCATIONS.map((loc) => (
                  <option key={loc.city} value={loc.city}>
                    {loc.city}, {loc.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Default Locality / Street Address
            </label>
            <input
              type="text"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            className="font-bold px-6"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

