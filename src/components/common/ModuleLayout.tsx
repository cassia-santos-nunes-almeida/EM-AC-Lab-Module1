import { useState, type ReactNode } from 'react';
import { Monitor, BookOpen, GraduationCap } from 'lucide-react';
import { Tabs } from '@/components/common/Tabs';
import { ModuleAssessment } from '@/components/common/ModuleAssessment';
import { ModuleNavigation } from '@/components/common/ModuleNavigation';

interface ModuleLayoutProps {
  moduleId: string;
  simulation: ReactNode;
  theory: ReactNode;
}

const TABS = [
  { id: 'simulation', label: 'Simulation', icon: <Monitor size={14} /> },
  { id: 'theory', label: 'Theory', icon: <BookOpen size={14} /> },
  { id: 'practice', label: 'Practice', icon: <GraduationCap size={14} /> },
];

export function ModuleLayout({ moduleId, simulation, theory }: ModuleLayoutProps) {
  const [activeTab, setActiveTab] = useState('simulation');

  return (
    <div className="space-y-4">
      <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <div
        id="panel-simulation"
        role="tabpanel"
        aria-labelledby="tab-simulation"
        className={activeTab === 'simulation' ? '' : 'hidden'}
      >
        {simulation}
      </div>

      <div
        id="panel-theory"
        role="tabpanel"
        aria-labelledby="tab-theory"
        className={activeTab === 'theory' ? '' : 'hidden'}
      >
        {theory}
      </div>

      <div
        id="panel-practice"
        role="tabpanel"
        aria-labelledby="tab-practice"
        className={activeTab === 'practice' ? '' : 'hidden'}
      >
        <ModuleAssessment moduleId={moduleId} />
      </div>

      <ModuleNavigation currentModuleId={moduleId} />
    </div>
  );
}
