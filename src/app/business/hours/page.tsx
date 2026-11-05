"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Save, ArrowLeft, CheckCircle2, AlertCircle, Copy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOwnerBusiness, getBusinessHours, saveBusinessHours } from "@/actions/business";
import type { Business, BusinessHours } from "@/types/database.types";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BusinessHoursPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Initialize schedule with standard 9:00 AM - 6:00 PM for weekdays, closed on Sunday
  const [schedule, setSchedule] = useState<
    Array<{ day_of_week: number; open_time: string; close_time: string; is_closed: boolean }>
  >(
    DAY_NAMES.map((_, idx) => ({
      day_of_week: idx,
      open_time: "09:00",
      close_time: "18:00",
      is_closed: idx === 0, // Sunday closed by default
    }))
  );

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        const { business: currentBiz } = await getOwnerBusiness();
        setBusiness(currentBiz);

        if (currentBiz) {
          const hours = await getBusinessHours(currentBiz.id);
          if (hours && hours.length > 0) {
            // Map existing DB hours
            setSchedule((prev) =>
              prev.map((item) => {
                const found = hours.find((h) => h.day_of_week === item.day_of_week);
                return found
                  ? {
                      day_of_week: found.day_of_week,
                      open_time: found.open_time.substring(0, 5),
                      close_time: found.close_time.substring(0, 5),
                      is_closed: found.is_closed,
                    }
                  : item;
              })
            );
          }
        }
      } catch (err) {
        console.error("Error loading hours:", err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const handleDayChange = (
    dayIndex: number,
    field: "open_time" | "close_time" | "is_closed",
    value: any
  ) => {
    setSchedule((prev) =>
      prev.map((item) => (item.day_of_week === dayIndex ? { ...item, [field]: value } : item))
    );
  };

  const copyMondayToWeekdays = () => {
    const monday = schedule.find((s) => s.day_of_week === 1);
    if (!monday) return;

    setSchedule((prev) =>
      prev.map((item) => {
        // Weekdays: Monday (1) through Friday (5)
        if (item.day_of_week >= 1 && item.day_of_week <= 5) {
          return {
            ...item,
            open_time: monday.open_time,
            close_time: monday.close_time,
            is_closed: monday.is_closed,
          };
        }
        return item;
      })
    );
    setFeedback({
      type: "success",
      message: "Copied Monday's hours to all weekdays (Tuesday - Friday).",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await saveBusinessHours(business.id, schedule);
      if (res.success) {
        setFeedback({ type: "success", message: "Operating hours saved successfully!" });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save hours." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-lg" />
        <div className="h-96 bg-gray-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-gray-600">Please create your business profile before setting operating hours.</p>
        <Link href="/business/profile">
          <Button>Create Business Profile</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/business" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Operating Hours</h1>
            <p className="text-sm text-gray-500">
              Set when your business is open for service and phone consultations.
            </p>
          </div>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={copyMondayToWeekdays}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Mon to Weekdays
        </Button>
      </div>

      {feedback && (
        <div
          className={`rounded-xl p-4 flex items-center space-x-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Weekly Schedule</CardTitle>
            <CardDescription>Adjust opening and closing times for each day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedule.map((item) => {
              const dayName = DAY_NAMES[item.day_of_week];
              return (
                <div
                  key={item.day_of_week}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    item.is_closed
                      ? "bg-gray-50/60 border-gray-200 text-gray-400"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <div className="w-32 font-medium text-sm flex items-center space-x-2">
                    <span>{dayName}</span>
                    {item.is_closed && (
                      <span className="text-xs text-rose-500 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                        Closed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 flex-1 sm:justify-end">
                    {!item.is_closed ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={item.open_time}
                          onChange={(e) =>
                            handleDayChange(item.day_of_week, "open_time", e.target.value)
                          }
                          className="h-9 px-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                        <span className="text-gray-400 text-xs">to</span>
                        <input
                          type="time"
                          value={item.close_time}
                          onChange={(e) =>
                            handleDayChange(item.day_of_week, "close_time", e.target.value)
                          }
                          className="h-9 px-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not accepting appointments</span>
                    )}

                    <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer ml-3 select-none">
                      <input
                        type="checkbox"
                        checked={item.is_closed}
                        onChange={(e) =>
                          handleDayChange(item.day_of_week, "is_closed", e.target.checked)
                        }
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <span>Mark Closed</span>
                    </label>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isSaving} className="min-w-[140px]">
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
