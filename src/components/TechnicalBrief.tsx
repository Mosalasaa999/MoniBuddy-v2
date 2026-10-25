import React from 'react';
import { useApp } from '../context/AppContext';
import {
  WifiOff,
  ShieldCheck,
  Wallet,
  Globe,
  CheckCircle2,
  BookOpen,
  Building2,
  Handshake,
  Landmark
} from 'lucide-react';

export const TechnicalBrief: React.FC = () => {
  const { t } = useApp();

  const capabilities = [
    {
      icon: WifiOff,
      title: t.techCap1Title,
      body: t.techCap1Body
    },
    {
      icon: Wallet,
      title: t.techCap2Title,
      body: t.techCap2Body
    },
    {
      icon: ShieldCheck,
      title: t.techCap3Title,
      body: t.techCap3Body
    },
    {
      icon: Globe,
      title: t.techCap4Title,
      body: t.techCap4Body
    }
  ];

  const sustainabilityPillars = [
    {
      icon: Landmark,
      title: t.sustModel1Title,
      body: t.sustModel1Body
    },
    {
      icon: Handshake,
      title: t.sustModel2Title,
      body: t.sustModel2Body
    },
    {
      icon: Building2,
      title: t.sustModel3Title,
      body: t.sustModel3Body
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white mb-2">
          <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
          <span>{t.techBadge}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          {t.technicalBriefTitle}
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {t.techSubtitle}
        </p>
      </div>

      {/* 4 Core Capabilities Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {capabilities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          );
        })}
      </div>

      {/* Zero-User-Fee Sustainability & Revenue Model */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 sm:p-8 space-y-5">
        <div className="space-y-1.5">
          <h2 className="text-lg font-extrabold text-emerald-950">
            {t.sustainabilityTitle}
          </h2>
          <p className="text-xs text-emerald-900/90 max-w-3xl leading-relaxed">
            {t.sustainabilitySubtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {sustainabilityPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-xs space-y-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Built for Everyday Dignity */}
      <div className="rounded-3xl bg-slate-900 p-6 sm:p-8 text-white space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-emerald-400">{t.dignityTitle}</h2>
          <p className="text-xs text-slate-300">{t.dignitySubtitle}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{t.dignity1Title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.dignity1Body}</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{t.dignity2Title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.dignity2Body}</p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{t.dignity3Title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.dignity3Body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
