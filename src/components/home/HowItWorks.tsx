import React from 'react';
import { Search, Compass, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Search for a Service',
      description:
        'Choose your city, type the service you need—from AC repair and salon visits to banquet halls and doctors.',
      icon: Search,
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Explore Local Businesses',
      description:
        'Compare transparent service rate cards, verified badges, customer reviews, operational hours, and photo galleries.',
      icon: Compass,
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'Contact the Right Provider',
      description:
        'Connect directly via direct phone call, instant WhatsApp chat, or request a free quote online with zero commission.',
      icon: PhoneCall,
      badge: 'Step 3',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Simple, Transparent, Free
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E3A8A] tracking-tight">
            How It Works
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-2">
            Get your home or business requirement sorted in three effortless steps.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 border-t-2 border-dashed border-blue-200 -z-0 -translate-y-8" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative z-10 bg-[#EFF6FF] rounded-3xl p-6 sm:p-8 border border-[#DBEAFE] text-center flex flex-col items-center hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-400 transition-all duration-300 group hover:-translate-y-1.5"
              >
                {/* Step badge */}
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>

                <span className="text-[11px] font-black tracking-widest uppercase text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-200 mb-3">
                  {item.badge}
                </span>

                <h3 className="text-lg md:text-xl font-bold text-[#1E3A8A] mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1E3A8A] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
          >
            <span>Start Exploring Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

