
import React, { useState, useEffect } from 'react';
import { Employee, OnboardingTask, SeparationRecord } from '../types';
import { 
    getEmployees, 
    getAllSeparationTasks, 
    addTask, 
    updateTask, 
    getHRTeam, 
    getAllSeparations, 
    addSeparation, 
    updateSeparation 
} from '../services/storage';
import { Card, Button, Modal, Badge, Select, Textarea } from '../components/UI';
import { LogOut, Search, CheckCircle, Circle, AlertCircle, ChevronDown, ChevronUp, UserCheck, User } from 'lucide-react';

const SEPARATION_CHECKLIST = [
    "Resignation Letter",
    "Acceptance of Resignation",
    "EOS",
    "TAF",
    "Exit Interview",
    "Task Handover Paper",
    "Clearance Form",
    "Accommodation Clearance",
    "Bank Leaving Employee Notification",
    "IT System",
    "Insurance",
    "QID Cancelation",
    "Sponsorship Transfer",
    "Employment Certificate"
];

const Separation: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [allSeparationTasks, setAllSeparationTasks] = useState<OnboardingTask[]>([]);
    const [separationRecords, setSeparationRecords] = useState<SeparationRecord[]>([]);
    const [activeSeparations, setActiveSeparations] = useState<number[]>([]); 
    const [hrTeam, setHrTeam] = useState<Employee[]>([]);

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmpId, setSelectedEmpId] = useState('');
    const [selectedOperator, setSelectedOperator] = useState<'Doha Oasis' | 'Kien'>('Doha Oasis'); // Operator Filter
    const [assignedHr, setAssignedHr] = useState('');
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Delegation Modal
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<OnboardingTask | null>(null);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setEmployees(getEmployees());
        setHrTeam(getHRTeam());
        
        const tasks = getAllSeparationTasks();
        setAllSeparationTasks(tasks);
        
        const records = getAllSeparations();
        setSeparationRecords(records);
        
        const taskIds = tasks.map(t => t.employee_id);
        const recordIds = records.map(r => r.employee_id);
        const uniqueIds = Array.from(new Set([...taskIds, ...recordIds]));
        setActiveSeparations(uniqueIds);
    };

    const handleInitiateSeparation = () => {
        if (!selectedEmpId) return;
        const empId = parseInt(selectedEmpId);
        
        if (activeSeparations.includes(empId)) {
            alert("Separation process already started for this employee.");
            return;
        }

        addSeparation({
            employee_id: empId,
            assigned_hr_name: assignedHr || 'Unassigned',
            final_settlement_received: false,
            initiated_at: new Date().toISOString()
        });

        SEPARATION_CHECKLIST.forEach(name => 
            addTask({
                employee_id: empId,
                name: name,
                owner: 'HR',
                status: 'Not Started',
                category: 'Separation',
                due_date: new Date().toISOString().split('T')[0]
            })
        );

        refreshData();
        setIsModalOpen(false);
        setExpandedRows([...expandedRows, empId]); 
        setSelectedEmpId('');
        setAssignedHr('');
    };

    const toggleRow = (empId: number) => {
        if (expandedRows.includes(empId)) {
            setExpandedRows(expandedRows.filter(id => id !== empId));
        } else {
            setExpandedRows([...expandedRows, empId]);
        }
    };

    const handleTaskStatusChange = (task: OnboardingTask, e: React.MouseEvent) => {
        e.stopPropagation();
        const nextStatus: OnboardingTask['status'] = task.status === 'Not Started' ? 'In Progress' : task.status === 'In Progress' ? 'Done' : 'Not Started';
        updateTask({ ...task, status: nextStatus });
        refreshData();
    };

    const handleUpdateRecord = (empId: number, changes: Partial<SeparationRecord>) => {
        const record = separationRecords.find(r => r.employee_id === empId);
        if (record) {
            updateSeparation({ ...record, ...changes });
            refreshData();
        } else {
            addSeparation({
                employee_id: empId,
                assigned_hr_name: 'Unassigned',
                final_settlement_received: false,
                initiated_at: new Date().toISOString(),
                ...changes
            });
            refreshData();
        }
    };
    
    // Delegation
    const openTaskDelegation = (task: OnboardingTask, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const saveTaskDelegation = () => {
        if (selectedTask) {
            updateTask(selectedTask);
            setIsTaskModalOpen(false);
            refreshData();
        }
    };

    const getProgress = (empId: number) => {
        const empTasks = allSeparationTasks.filter(t => t.employee_id === empId);
        if (empTasks.length === 0) return 0;
        const done = empTasks.filter(t => t.status === 'Done').length;
        return Math.round((done / empTasks.length) * 100);
    };

    const filteredEmployees = employees.filter(e => activeSeparations.includes(e.id)).filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Separation Module</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <LogOut size={18} className="mr-2" /> Initiate Separation
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search employee in separation..." 
                            className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:ring-brand-500 focus:border-brand-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-12"></th>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Assigned HR</th>
                                <th className="px-6 py-4">Progress</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEmployees.map(emp => {
                                const progress = getProgress(emp.id);
                                const isExpanded = expandedRows.includes(emp.id);
                                const record = separationRecords.find(r => r.employee_id === emp.id);
                                
                                return (
                                    <React.Fragment key={emp.id}>
                                        <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`} onClick={() => toggleRow(emp.id)}>
                                            <td className="px-6 py-4 text-center">
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{emp.name}</td>
                                            <td className="px-6 py-4">{emp.department}</td>
                                            <td className="px-6 py-4">
                                                {record?.assigned_hr_name ? (
                                                     <div className="flex items-center gap-1">
                                                        <UserCheck size={14} className="text-slate-400" />
                                                        <span>{record.assigned_hr_name}</span>
                                                     </div>
                                                ) : <span className="text-slate-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-500" style={{ width: `${progress}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-medium">{progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {record?.final_settlement_received && progress === 100 ? (
                                                    <Badge color="green">Closed</Badge>
                                                ) : progress === 100 ? (
                                                    <Badge color="blue">Pending Settlement</Badge>
                                                ) : (
                                                    <Badge color="yellow">In Progress</Badge>
                                                )}
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan={6} className="px-6 pb-6 pt-0">
                                                    <div className="ml-12 mt-2 space-y-4">
                                                        {/* Process Details Box */}
                                                        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex flex-col">
                                                                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Final Settlement</label>
                                                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                                                        <input 
                                                                            type="checkbox" 
                                                                            className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 border-gray-300"
                                                                            checked={record?.final_settlement_received || false}
                                                                            onChange={(e) => handleUpdateRecord(emp.id, { final_settlement_received: e.target.checked })}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                        <span className={`text-sm font-medium ${record?.final_settlement_received ? 'text-green-700' : 'text-slate-700'}`}>
                                                                            {record?.final_settlement_received ? 'Settlement Received' : 'Not Received Yet'}
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex flex-col w-full md:w-64">
                                                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1">Lead HR Assignee</label>
                                                                <select 
                                                                    className="text-sm rounded border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                                                    value={record?.assigned_hr_name || ''}
                                                                    onChange={(e) => handleUpdateRecord(emp.id, { assigned_hr_name: e.target.value })}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <option value="">-- Unassigned --</option>
                                                                    {hrTeam.map(h => (
                                                                        <option key={h.id} value={h.name}>{h.name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Checklist Box */}
                                                        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                                                                <AlertCircle size={16} className="mr-2 text-brand-600" /> 
                                                                Clearance Checklist
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {allSeparationTasks.filter(t => t.employee_id === emp.id).map(task => (
                                                                    <div 
                                                                        key={task.id} 
                                                                        className={`
                                                                            flex items-center justify-between p-3 rounded border transition-all
                                                                            ${task.status === 'Done' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}
                                                                        `}
                                                                    >
                                                                        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={(e) => handleTaskStatusChange(task, e)}>
                                                                            {task.status === 'Done' ? (
                                                                                <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                                                                            ) : task.status === 'In Progress' ? (
                                                                                <div className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin flex-shrink-0" />
                                                                            ) : (
                                                                                <Circle size={18} className="text-slate-300 flex-shrink-0 hover:text-brand-500" />
                                                                            )}
                                                                            <span className={`text-sm truncate ${task.status === 'Done' ? 'text-green-800 font-medium' : 'text-slate-700'}`}>
                                                                                {task.name}
                                                                            </span>
                                                                        </div>

                                                                        <button 
                                                                            className="p-1 hover:bg-slate-100 rounded-full" 
                                                                            title={`Delegated to: ${task.owner || 'HR'}`}
                                                                            onClick={(e) => openTaskDelegation(task, e)}
                                                                        >
                                                                            {task.owner && task.owner !== 'HR' ? (
                                                                                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold" title={task.owner}>
                                                                                    {task.owner.charAt(0)}
                                                                                </div>
                                                                            ) : (
                                                                                <User size={16} className="text-slate-300 hover:text-slate-500" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                        No active separations found. Click "Initiate Separation" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal title="Initiate Employee Separation" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Select an employee to begin the separation process. This will generate the standard separation checklist.</p>
                    
                    {/* Operator Filter */}
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => { setSelectedOperator('Doha Oasis'); setSelectedEmpId(''); }}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedOperator === 'Doha Oasis' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Doha Oasis
                        </button>
                        <button
                            type="button"
                            onClick={() => { setSelectedOperator('Kien'); setSelectedEmpId(''); }}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedOperator === 'Kien' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Kien
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee ({selectedOperator})</label>
                        <select 
                            className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 text-sm"
                            value={selectedEmpId}
                            onChange={(e) => setSelectedEmpId(e.target.value)}
                        >
                            <option value="">-- Select Employee --</option>
                            {employees
                                .filter(e => e.operator === selectedOperator)
                                .filter(e => !activeSeparations.includes(e.id))
                                .map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Assign HR Staff</label>
                        <select 
                            className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 text-sm"
                            value={assignedHr}
                            onChange={(e) => setAssignedHr(e.target.value)}
                        >
                            <option value="">-- Select HR Rep --</option>
                            {hrTeam.map(h => (
                                <option key={h.id} value={h.name}>{h.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button onClick={handleInitiateSeparation} disabled={!selectedEmpId}>Start Process</Button>
                    </div>
                </div>
            </Modal>

            {/* Task Delegation Modal */}
            {selectedTask && (
                <Modal title="Task Details & Delegation" isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
                    <div className="space-y-4">
                         <div className="p-3 bg-slate-50 rounded border border-slate-200">
                             <h4 className="font-medium text-slate-900">{selectedTask.name}</h4>
                             <p className="text-xs text-slate-500 mt-1">Status: {selectedTask.status}</p>
                         </div>
                         
                         <Select 
                            label="Delegate to HR Staff"
                            options={[
                                {value: 'HR', label: 'General HR Team'},
                                ...hrTeam.map(h => ({ value: h.name, label: h.name }))
                            ]}
                            value={selectedTask.owner}
                            onChange={(e) => setSelectedTask({...selectedTask, owner: e.target.value})}
                         />
                         
                         <Select 
                            label="Status"
                            options={[
                                {value: 'Not Started', label: 'Not Started'},
                                {value: 'In Progress', label: 'In Progress'},
                                {value: 'Done', label: 'Done'},
                            ]}
                            value={selectedTask.status}
                            onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value as any})}
                         />

                        <Textarea 
                            label="Task Comment" 
                            value={selectedTask.comments || ''} 
                            onChange={(e) => setSelectedTask({...selectedTask, comments: e.target.value})} 
                            placeholder="Specific notes for this task..."
                        />
                        
                        <div className="flex justify-end pt-2">
                            <Button onClick={saveTaskDelegation}>Update Task</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Separation;
