import React, { useState } from 'react';
import { Card, Button, Tag, Input, Badge } from 'antd';
import { useNavigate } from 'react-router';
import {
  Users,
  BookOpen,
  FlaskConical,
  Calendar,
  Search,
  ArrowRight,
  Clock,
  Sparkles,
  Plus,
  Stethoscope,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  PawPrint,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setSearchQuery } from '@/app/store/slices/repertorizationSlice';
import { ROUTES } from '@/core/config/constants';

interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  prescribedRemedy: string;
  potency: string;
  time: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

const TODAY_CASES: PatientCase[] = [
  {
    id: 'case-1',
    name: 'Arthur Pendelton',
    age: 42,
    gender: 'M',
    chiefComplaint: 'Chronic migraine, worse 10 AM, craving salt, reserved grief',
    prescribedRemedy: 'Natrum Muriaticum',
    potency: '200CH',
    time: '09:30 AM',
    status: 'Completed',
  },
  {
    id: 'case-2',
    name: 'Eleanor Vance',
    age: 29,
    gender: 'F',
    chiefComplaint: 'Dyspepsia with flatulence 4-8 PM, right-sided fullness, anticipatory anxiety',
    prescribedRemedy: 'Lycopodium Clavatum',
    potency: '1M',
    time: '11:00 AM',
    status: 'Completed',
  },
  {
    id: 'case-3',
    name: 'Julian Mercer',
    age: 8,
    gender: 'M',
    chiefComplaint: 'Acute nocturnal high fever, sudden onset from cold wind, fear of dark',
    prescribedRemedy: 'Aconitum Napellus',
    potency: '30CH',
    time: '01:30 PM',
    status: 'In Progress',
  },
  {
    id: 'case-4',
    name: 'Clara Hughes',
    age: 54,
    gender: 'F',
    chiefComplaint: 'Morning joint stiffness, better continuous gentle motion, worse initial movement',
    prescribedRemedy: 'Rhus Toxicodendron',
    potency: '200CH',
    time: '03:15 PM',
    status: 'Upcoming',
  },
];

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const practitioner = useAppSelector((state) => state.session.practitionerName);
  const [quickRubricSearch, setQuickRubricSearch] = useState('');

  const handleRubricSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (quickRubricSearch.trim()) {
      dispatch(setSearchQuery(quickRubricSearch.trim()));
      navigate(ROUTES.REPERTORY);
    }
  };

  const clinicalMetrics = [
    {
      title: "Today's Consultations",
      value: '4 Scheduled',
      sub: '2 completed • 1 in progress',
      icon: Calendar,
      badge: 'Today',
      color: 'text-primary-500',
    },
    {
      title: 'Active Patient Registry',
      value: '142 Patients',
      sub: 'Longitudinal EHR tracking',
      icon: Users,
      badge: 'Registry',
      color: 'text-blue-500',
    },
    {
      title: 'Repertorization Library',
      value: '72,400+ Rubrics',
      sub: 'Kent & Synthesis taxonomy',
      icon: BookOpen,
      badge: '43 Repertories',
      color: 'text-emerald-500',
    },
    {
      title: 'Materia Medica Monograph Bank',
      value: '3,500+ Remedies',
      sub: '800+ verified relationships',
      icon: FlaskConical,
      badge: 'Materia Medica',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Practitioner Clinical Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-primary-500/10 via-surface-card to-surface-card border border-primary-500/20 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Stethoscope className="w-6 h-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Physician Consultation Workspace
            </h1>
            <Badge status="processing" color="var(--color-primary-500)" />
          </div>
          <p className="text-sm text-text-secondary">
            Welcome back, <span className="font-semibold text-text-primary">{practitioner}</span>.
            Your patient records, repertorization grid, and Materia Medica repository are synchronized and ready.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4 mr-1" />}
            onClick={() => navigate(ROUTES.PATIENTS)}
          >
            New Patient Intake
          </Button>
          <Button
            icon={<BookOpen className="w-4 h-4 mr-1 text-primary-500" />}
            onClick={() => navigate(ROUTES.REPERTORY)}
          >
            Open Repertory
          </Button>
        </div>
      </div>

      {/* Clinical Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {clinicalMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card
              key={idx}
              className="border-border-subtle hover:border-primary-500/40 transition-colors shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-xs text-text-muted font-medium">{metric.title}</span>
                  </div>
                  <p className="text-xl font-bold text-text-primary tracking-tight">
                    {metric.value}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">{metric.sub}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-surface-subtle ${metric.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Clinical Action Launchpad & Instant Rubric Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launchpad */}
        <Card
          title={
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span className="font-semibold text-sm text-text-primary">Clinical Quick Actions</span>
            </div>
          }
          className="border-border-subtle shadow-xs lg:col-span-1"
        >
          <div className="space-y-3">
            <div
              onClick={() => navigate(ROUTES.REPERTORY)}
              className="p-3.5 rounded-xl bg-surface-subtle hover:bg-primary-500/10 border border-border-subtle hover:border-primary-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary-500/10 text-primary-500">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                    Repertorization Grid
                  </p>
                  <p className="text-xs text-text-muted">Extract symptoms and calculate similimum</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div
              onClick={() => navigate(ROUTES.MATERIA_MEDICA)}
              className="p-3.5 rounded-xl bg-surface-subtle hover:bg-primary-500/10 border border-border-subtle hover:border-primary-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                    Remedy Comparator
                  </p>
                  <p className="text-xs text-text-muted">Side-by-side keynotes & inimical alerts</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div
              onClick={() => navigate(ROUTES.PATIENTS)}
              className="p-3.5 rounded-xl bg-surface-subtle hover:bg-primary-500/10 border border-border-subtle hover:border-primary-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                    Patient Case Records
                  </p>
                  <p className="text-xs text-text-muted">Past consultations, potency & follow-ups</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div
              onClick={() => navigate(ROUTES.SPECIALTY)}
              className="p-3.5 rounded-xl bg-surface-subtle hover:bg-primary-500/10 border border-border-subtle hover:border-primary-500/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <PawPrint className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors">
                    Specialty & Veterinary
                  </p>
                  <p className="text-xs text-text-muted">Borland, Clarke, Boger, TPB & multi-species</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </Card>

        {/* Global Rubric Search & Daily Clinical Pearl */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          {/* Quick Rubric Search Bar */}
          <Card className="border-border-subtle shadow-xs">
            <h3 className="text-sm font-bold text-text-primary mb-1 flex items-center gap-2">
              <Search className="w-4 h-4 text-primary-500" />
              Direct Repertory Rubric Search
            </h3>
            <p className="text-xs text-text-secondary mb-3">
              Type patient symptoms or modalities to instantly jump to the Repertory rubric hierarchy:
            </p>
            <div className="flex gap-2">
              <Input
                prefix={<Search className="w-4 h-4 text-text-muted mr-1" />}
                placeholder="e.g. anxiety anticipation, fear of dark, flatulence, headache sunrise..."
                value={quickRubricSearch}
                onChange={(e) => setQuickRubricSearch(e.target.value)}
                onPressEnter={handleRubricSearchSubmit}
                size="large"
                className="rounded-xl flex-1 text-sm"
                allowClear
              />
              <Button
                type="primary"
                size="large"
                onClick={handleRubricSearchSubmit}
                className="rounded-xl"
              >
                Search Repertory
              </Button>
            </div>
          </Card>

          {/* Daily Clinical Pearl of the Day */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Clinical Pearl #412 — Dr. William Boericke
                </span>
                <Tag color="gold" className="text-[11px] font-semibold m-0">Verified Tip</Tag>
              </div>
              <p className="text-xs text-text-primary mt-1.5 leading-relaxed">
                <span className="font-semibold">Acute Respiratory Polarity:</span> In acute dry spasmodic coughs after cold air exposure, compare <span className="font-semibold text-amber-800">Spongia Tosta</span> (dry, loud barking cough like sawing dry wood, better warm drinks) with <span className="font-semibold text-amber-800">Aconitum</span> (sudden onset with midnight panic and dry fever) and <span className="font-semibold text-amber-800">Drosera</span> (paroxysms so severe patient must hold the chest).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Active Consultations Queue */}
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-primary-500" />
              <span className="font-semibold text-sm text-text-primary">Today&apos;s Consultation Schedule & Cases</span>
            </div>
            <Tag color="blue" className="text-xs font-medium">4 Patients</Tag>
          </div>
        }
        className="border-border-subtle shadow-xs"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-xs text-text-muted">
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Chief Complaint & Modality</th>
                <th className="pb-3 font-semibold">Prescribed Similimum</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {TODAY_CASES.map((c) => (
                <tr key={c.id} className="hover:bg-surface-subtle/50 transition-colors">
                  <td className="py-3 font-mono text-xs text-text-muted whitespace-nowrap">
                    {c.time}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span className="font-semibold text-text-primary">{c.name}</span>
                    <span className="text-xs text-text-muted ml-2">({c.age} {c.gender})</span>
                  </td>
                  <td className="py-3 text-xs text-text-secondary max-w-md truncate">
                    {c.chiefComplaint}
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <Tag color="cyan" className="font-semibold">
                      {c.prescribedRemedy} {c.potency}
                    </Tag>
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    {c.status === 'Completed' && (
                      <Tag color="success" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" /> Completed
                      </Tag>
                    )}
                    {c.status === 'In Progress' && (
                      <Tag color="processing" className="text-xs animate-pulse">
                        <Clock className="w-3 h-3 inline mr-1" /> In Progress
                      </Tag>
                    )}
                    {c.status === 'Upcoming' && (
                      <Tag color="default" className="text-xs">
                        <AlertCircle className="w-3 h-3 inline mr-1" /> Scheduled
                      </Tag>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardView;
