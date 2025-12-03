
import React, { useEffect, useState } from 'react';
import { getStats, getAllRequests, getAllTasks, getEmployees, getAllOnboardings, getAllSeparations } from '../services/storage';
import { DashboardStats, HRRequest, OnboardingTask, OnboardingRecord, SeparationRecord } from '../types';
import { Card, CardContent, RequestBadge, Badge } from '../components/UI';
import { Users, Briefcase, FileText, CheckSquare, ArrowRight, LogOut, BarChart2, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <Card className="border-l-4" style={{ borderLeftColor: color }}>
    <CardContent className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-slate-50 text-slate-600`}>
        {icon}
      </div>
    </CardContent>
  </Card>
);

interface ProcessSummary {
  employeeId: number;
  employeeName: string;
  leadHR: string;
  progress: number; // percentage
  totalTasks: number;
  completedTasks: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    openPositions: 0,
    pendingRequests: 0,
    onboardingActive: 0,
    separationActive: 0,
    performanceActive: 0
  });

  const [allRequests, setAllRequests] = useState<HRRequest[]>([]);
  const [employeeLookup, setEmployeeLookup] = useState<Record<number, string>>({});
  
  const [onboardingSummary, setOnboardingSummary] = useState<ProcessSummary[]>([]);
  const [separationSummary, setSeparationSummary] = useState<ProcessSummary[]>([]);
  const [performanceTasks, setPerformanceTasks] = useState<OnboardingTask[]>([]);

  useEffect(() => {
    setStats(getStats());
    
    const requests = getAllRequests();
    const tasks = getAllTasks();
    const employees = getEmployees();
    const onboardingRecords = getAllOnboardings();
    const separationRecords = getAllSeparations();

    // Create lookup
    const lookup: Record<number, string> = {};
    employees.forEach(e => lookup[e.id] = e.name);
    setEmployeeLookup(lookup);

    // Get ALL requests sorted by date
    setAllRequests(requests.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    
    // Sort tasks and categorize
    const sortedTasks = tasks.sort((a,b) => b.id - a.id);
    setPerformanceTasks(sortedTasks.filter(t => t.category === 'Performance'));
    
    // -- Process Onboarding Summary --
    const obTasks = sortedTasks.filter(t => !t.category || t.category === 'Onboarding');
    const obEmpIds = Array.from(new Set(obTasks.map(t => t.employee_id)));
    
    const obSummary: ProcessSummary[] = obEmpIds.map(empId => {
        const empTasks = obTasks.filter(t => t.employee_id === empId);
        const total = empTasks.length;
        const done = empTasks.filter(t => t.status === 'Done').length;
        const record = onboardingRecords.find(r => r.employee_id === empId);
        
        return {
            employeeId: empId,
            employeeName: lookup[empId] || `ID: ${empId}`,
            leadHR: record?.assigned_hr_name || 'Unassigned',
            totalTasks: total,
            completedTasks: done,
            progress: total > 0 ? Math.round((done/total) * 100) : 0
        };
    }).filter(s => s.progress < 100); // Only show active
    setOnboardingSummary(obSummary);

    // -- Process Separation Summary --
    const sepTasks = sortedTasks.filter(t => t.category === 'Separation');
    const sepEmpIds = Array.from(new Set(sepTasks.map(t => t.employee_id)));

    const sepSummary: ProcessSummary[] = sepEmpIds.map(empId => {
        const empTasks = sepTasks.filter(t => t.employee_id === empId);
        const total = empTasks.length;
        const done = empTasks.filter(t => t.status === 'Done').length;
        const record = separationRecords.find(r => r.employee_id === empId);

        return {
            employeeId: empId,
            employeeName: lookup[empId] || `ID: ${empId}`,
            leadHR: record?.assigned_hr_name || 'Unassigned',
            totalTasks: total,
            completedTasks: done,
            progress: total > 0 ? Math.round((done/total) * 100) : 0
        };
    }).filter(s => s.progress < 100); // Only show active
    setSeparationSummary(sepSummary);

  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome to Doha Oasis HR Lifecycle Platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatCard 
          title="Total Employees" 
          value={stats.totalEmployees} 
          icon={<Users size={24} />}
          color="#0ea5e9"
        />
        <StatCard 
          title="Open Positions" 
          value={stats.openPositions} 
          icon={<Briefcase size={24} />}
          color="#22c55e"
        />
        <StatCard 
          title="Active Onboarding" 
          value={stats.onboardingActive} 
          icon={<CheckSquare size={24} />}
          color="#f59e0b"
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pendingRequests} 
          icon={<FileText size={24} />}
          color="#ef4444"
        />
         <StatCard 
          title="Separation Tasks" 
          value={stats.separationActive} 
          icon={<LogOut size={24} />}
          color="#64748b"
        />
        <StatCard 
          title="Active Reviews" 
          value={stats.performanceActive} 
          icon={<BarChart2 size={24} />}
          color="#8b5cf6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All HR Requests */}
        <Card className="flex flex-col max-h-[600px] lg:row-span-2">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-lg font-semibold text-slate-800">All HR Requests</h3>
                <Link to="/requests" className="text-sm text-brand-600 hover:text-brand-700 flex items-center">
                    Manage <ArrowRight size={14} className="ml-1" />
                </Link>
            </div>
            <div className="overflow-y-auto flex-1">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-semibold sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4">Employee</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allRequests.map(r => (
                            <tr key={r.id}>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {employeeLookup[r.employee_id] || `ID: ${r.employee_id}`}
                                </td>
                                <td className="px-6 py-4">{r.request_type}</td>
                                <td className="px-6 py-4"><RequestBadge status={r.status} /></td>
                            </tr>
                        ))}
                        {allRequests.length === 0 && (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>

        <div className="flex flex-col gap-6">
            {/* Active Onboarding Summary */}
            <Card className="flex flex-col max-h-[400px]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-semibold text-slate-800">Active Onboarding</h3>
                    <Link to="/onboarding" className="text-sm text-brand-600 hover:text-brand-700 flex items-center">
                        Manage <ArrowRight size={14} className="ml-1" />
                    </Link>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Lead HR</th>
                                <th className="px-6 py-4">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {onboardingSummary.map(item => (
                                <tr key={item.employeeId}>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {item.employeeName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <UserCheck size={14} className="text-slate-400" />
                                            <span>{item.leadHR}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[120px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium">{item.progress}%</span>
                                                <span className="text-slate-400">{item.completedTasks}/{item.totalTasks}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {onboardingSummary.length === 0 && (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No active onboarding processes.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Active Separation Summary */}
            <Card className="flex flex-col max-h-[400px]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-semibold text-slate-800">Active Separations</h3>
                    <Link to="/separation" className="text-sm text-brand-600 hover:text-brand-700 flex items-center">
                        Manage <ArrowRight size={14} className="ml-1" />
                    </Link>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Assigned HR</th>
                                <th className="px-6 py-4">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {separationSummary.map(item => (
                                <tr key={item.employeeId}>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {item.employeeName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <UserCheck size={14} className="text-slate-400" />
                                            <span>{item.leadHR}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-full max-w-[120px]">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium">{item.progress}%</span>
                                                <span className="text-slate-400">{item.completedTasks}/{item.totalTasks}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div className="bg-slate-500 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {separationSummary.length === 0 && (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No active separation processes.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

             {/* Performance Tasks */}
            <Card className="flex flex-col max-h-[400px]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-semibold text-slate-800">Performance Reviews</h3>
                    <Link to="/performance" className="text-sm text-brand-600 hover:text-brand-700 flex items-center">
                        Manage Reviews <ArrowRight size={14} className="ml-1" />
                    </Link>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Stage</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {performanceTasks.map(t => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {employeeLookup[t.employee_id] || `ID: ${t.employee_id}`}
                                    </td>
                                    <td className="px-6 py-4">{t.name}</td>
                                    <td className="px-6 py-4">
                                        <Badge color={t.status === 'Done' ? 'green' : t.status === 'In Progress' ? 'blue' : 'gray'}>
                                            {t.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {performanceTasks.length === 0 && (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">No active reviews.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
      </div>

       <Card className="bg-gradient-to-br from-brand-600 to-brand-800 text-white border-none mt-6">
          <CardContent>
            <h3 className="text-lg font-bold mb-2">Gemini AI Assistant Active</h3>
            <p className="text-brand-100">
              Your platform is powered by Gemini AI. Use it to automatically generate job descriptions and suggest onboarding checklists.
            </p>
          </CardContent>
        </Card>
    </div>
  );
};

export default Dashboard;
