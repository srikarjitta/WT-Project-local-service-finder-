"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Save,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Zap,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBusiness, type DaySchedule } from "@/context/BusinessContext";

export default function BusinessHoursPage() {
  const { hours, business, updateHours, updateProfile } = useBusiness();
  const [schedule, setSchedule] = useState<DaySchedule[]>([...hours]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDayChange = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    setSchedule((prev) =>
      prev.map((item) => (item.dayIndex === dayIndex ? { ...item, [field]: value } : item))
    );
  };

  const copyMondayToWeekdays = () => {
    const monday = schedule.find((s) => s.dayIndex === 1);
    if (!monday) return;

    setSchedule((prev) =>
      prev.map((item) => {
        if (item.dayIndex >= 1 && item.dayIndex <= 5) {
          return {
            ...item,
            isOpen: monday.isOpen,
            openTime: monday.openTime,
            closeTime: monday.closeTime,
            isSplitShift: monday.isSplitShift,
            eveningOpenTime: monday.eveningOpenTime,
            eveningCloseTime: monday.eveningCloseTime,
          };
        }
        return item;
      })
    );
    showToast("Copied Monday hours to all weekdays (Tuesday - Friday)!");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHours(schedule);
    showToast("Operating hours saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Operating Hours & Availability</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Set standard working hours and 24/7 emergency dispatch availability.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={copyMondayToWeekdays}>
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy Mon to Weekdays
          </Button>
          <Button onClick={handleSave} className="shadow-sm">
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Hours
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex items-center space-x-3 text-emerald-900 animate-in fade-in duration-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 24/7 Emergency Service Banner */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-white p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">24/7 Emergency On-Call Dispatch</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Highlights your business in late-night and weekend urgent searches with an "Emergency Available" badge.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const next = !business.amenities.hasEmergencyService;
            updateProfile({
              amenities: { ...business.amenities, hasEmergencyService: next },
            });
            showToast(next ? "Emergency 24x7 service enabled!" : "Emergency 24x7 service disabled.");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            business.amenities.hasEmergencyService
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          {business.amenities.hasEmergencyService ? "✓ Active 24/7" : "Enable 24/7 Service"}
        </button>
      </div>

      {/* 7-Day Schedule Matrix */}
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Weekly Operating Schedule</CardTitle>
            <CardDescription className="text-xs">
              Displayed on your profile with real-time "Open Now" or "Closed" indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {schedule.map((item) => (
              <div
                key={item.dayIndex}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  item.isOpen
                    ? "bg-white border-slate-200"
                    : "bg-slate-50/70 border-slate-200 text-slate-400"
                }`}
              >
                <div className="w-32 font-bold text-sm flex items-center space-x-2">
                  <span>{item.day}</span>
                  {!item.isOpen && (
                    <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                      Closed
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center space-x-3 flex-1 sm:justify-end">
                  {item.isOpen ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={item.openTime}
                        onChange={(e) => handleDayChange(item.dayIndex, "openTime", e.target.value)}
                        className="h-9 px-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        required
                      />
                      <span className="text-slate-400 text-xs">to</span>
                      <input
                        type="time"
                        value={item.closeTime}
                        onChange={(e) => handleDayChange(item.dayIndex, "closeTime", e.target.value)}
                        className="h-9 px-2.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        required
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Closed for appointments</span>
                  )}

                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer ml-3 select-none">
                    <input
                      type="checkbox"
                      checked={item.isOpen}
                      onChange={(e) => handleDayChange(item.dayIndex, "isOpen", e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>Open</span>
                  </label>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <Button type="submit" className="min-w-[140px]">
                <Save className="h-4 w-4 mr-2" />
                Save Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
