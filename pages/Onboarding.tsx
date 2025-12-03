
import React, { useState, useEffect } from 'react';
import { Employee, OnboardingTask, OnboardingRecord } from '../types';
import { 
    getEmployees, 
    getAllTasks, 
    addTask, 
    updateTask,
    getHRTeam,
    getAllOnboardings,
    addOnboarding,
    updateOnboarding
} from '../services/storage';
import { Card, Button, Modal, Badge, Textarea, Select } from '../components/UI';
import { CheckSquare, Search, CheckCircle, Circle, AlertCircle, ChevronDown, ChevronUp, UserPlus, UserCheck, MessageSquare, User } from 'lucide-react';

const ONBOARDING_CHECKLIST = [
    "Uniform Issuance", 
    "Laundry", 
    "Canteen Access", 
    "Accommodation Allocation", 
    "HR Orientation", 
    "Facility Tour",
    "Open Bank Account",
    "ID Card Issuance",
    "Quest Barcode Setup",
    "Weekly Meal Plan",
    "Food Handler Certificate",
    "Transportation",
    "IT Assets Request",
    "IT Email Creation",
    "Oasys HR System Access",
    "Share Folder Access",
    "Doha Oasis Whatsapp Group",
    "Private Medical Insurance",
    "Hamad Card",
    "Name Tag",
    "Office Telephone",
    "Stationary",
    "Welcome Card",
    "Door Access",
    "Parking Allocation",
    "Doha Oasis Buddy",
    "HR Check",
    "Confirmation of Employment"
];

const Onboarding: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [hrTeam, setHrTeam] = useState<Employee[]>([]);
    const [allOnboardingTasks, setAllOnboardingTasks] = useState<OnboardingTask[]>([]);
    const [onboardingRecords, setOnboardingRecords] = useState<OnboardingRecord[]>([]);
    const [activeOnboardings, setActiveOnboardings] = useState<number[]>([]); 

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmpId, setSelectedEmpId] = useState('');
    const [selectedOperator, setSelectedOperator] = useState<'Doha Oasis' | 'Kien'>('Doha Oasis'); // Operator Filter
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Comments Modal
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<OnboardingRecord | null>(null);
    const [commentText, setCommentText] = useState('');
    
    // Delegation / Task Edit Modal
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<OnboardingTask | null>(null);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setEmployees(getEmployees());
        setHrTeam(getHRTeam());
        
        const tasks = getAllTasks().filter(t => !t.category || t.category === 'Onboarding');
        setAllOnboardingTasks(tasks);
        
        const records = getAllOnboardings();
        setOnboardingRecords(records);
        
        const taskIds = tasks.map(t => t.employee_id);
        const uniqueIds = Array.from(new Set(taskIds));
        setActiveOnboardings(uniqueIds);
    };

    const handleInitiateOnboarding = () => {
        if (!selectedEmpId) return;
        const empId = parseInt(selectedEmpId);
        
        // Check if record exists, if not create one
        if (!onboardingRecords.find(r => r.employee_id === empId)) {
            addOnboarding({
                employee_id: empId,
                assigned_hr_name: 'Unassigned',
                comments: '',
                initiated_at: new Date().toISOString()
            });
        }
        
        // Add tasks that don't exist yet
        const existingTasks = allOnboardingTasks.filter(t => t.employee_id === empId).map(t => t.name);
        ONBOARDING_CHECKLIST.forEach(name => {
            if (!existingTasks.includes(name)) {
                addTask({
                    employee_id: empId,
                    name: name,
                    owner: 'HR', // Default
                    status: 'Not Started',
                    category: 'Onboarding',
                    due_date: new Date().toISOString().split('T')[0]
                });
            }
        });

        refreshData();
        setIsModalOpen(false);
        setExpandedRows([...expandedRows, empId]); 
        setSelectedEmpId('');
    };

    const toggleRow = (empId: number) => {
        if (expandedRows.includes(empId)) {
            setExpandedRows(expandedRows.filter(id => id !== empId));
        } else {
            setExpandedRows([...expandedRows, empId]);
        }
    };

    const handleUpdateRecord = (empId: number, changes: Partial<OnboardingRecord>) => {
        const record = onboardingRecords.find(r => r.employee_id === empId);
        if (record) {
            updateOnboarding({ ...record, ...changes });
        } else {
             addOnboarding({
                employee_id: empId,
                assigned_hr_name: 'Unassigned',
                comments: '',
                initiated_at: new Date().toISOString(),
                ...changes
            });
        }
        refreshData();
    };

    // Open comments modal
    const openComments = (empId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const record = onboardingRecords.find(r => r.employee_id === empId);
        const initialRecord = record || { 
            id: 0, employee_id: empId, assigned_hr_name: 'Unassigned', comments: '', initiated_at: '' 
        } as OnboardingRecord;
        
        setCurrentRecord(initialRecord);
        setCommentText(initialRecord.comments || '');
        setIsCommentsModalOpen(true);
    };

    const saveComments = () => {
        if (currentRecord) {
            handleUpdateRecord(currentRecord.employee_id, { comments: commentText });
            setIsCommentsModalOpen(false);
        }
    };

    // Task Delegation
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

    // Quick Toggle Status
    const toggleTaskStatus = (task: OnboardingTask, e: React.MouseEvent) => {
        e.stopPropagation();
        const nextStatus = task.status === 'Not Started' ? 'In Progress' : task.status === 'In Progress' ? 'Done' : 'Not Started';
        updateTask({ ...task, status: nextStatus });
        refreshData();
    };

    const getProgress = (empId: number) => {
        const empTasks = allOnboardingTasks.filter(t => t.employee_id === empId);
        if (empTasks.length === 0) return 0;
        const done = empTasks.filter(t => t.status === 'Done').length;
        return Math.round((done / empTasks.length) * 100);
    };

    const filteredEmployees = employees.filter(e => activeOnboardings.includes(e.id)).filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Onboarding Module</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={18} className="mr-2" /> Initiate Onboarding
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search employee in onboarding..." 
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
                                <th className="px-6 py-4">Lead HR</th>
                                <th className="px-6 py-4">Progress</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredEmployees.map(emp => {
                                const progress = getProgress(emp.id);
                                const isExpanded = expandedRows.includes(emp.id);
                                const record = onboardingRecords.find(r => r.employee_id === emp.id);
                                
                                return (
                                    <React.Fragment key={emp.id}>
                                        <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`} onClick={() => toggleRow(emp.id)}>
                                            <td className="px-6 py-4 text-center">
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{emp.name}</td>
                                            <td className="px-6 py-4">{emp.department}</td>
                                            <td className="px-6 py-4">
                                                 <div 
                                                    className="flex items-center gap-2 hover:bg-slate-200 p-1 rounded -ml-1 cursor-pointer transition-colors w-fit"
                                                    onClick={(e) => e.stopPropagation()}
                                                 >
                                                    <UserCheck size={14} className="text-slate-500" />
                                                    <select 
                                                        className="text-sm bg-transparent border-none p-0 focus:ring-0 cursor-pointer text-slate-700 font-medium"
                                                        value={record?.assigned_hr_name || ''}
                                                        onChange={(e) => handleUpdateRecord(emp.id, { assigned_hr_name: e.target.value })}
                                                    >
                                                        <option value="">Unassigned</option>
                                                        {hrTeam.map(h => (
                                                            <option key={h.id} value={h.name}>{h.name}</option>
                                                        ))}
                                                    </select>
                                                 </div>
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
                                                <Button size="sm" variant="ghost" onClick={(e) => openComments(emp.id, e)}>
                                                    <MessageSquare size={16} className={`mr-1 ${record?.comments ? 'text-brand-600' : 'text-slate-400'}`} />
                                                    {record?.comments ? 'Edit Comments' : 'Add Comment'}
                                                </Button>
                                            </td>
                                        </tr>
                                        {isExpanded && (
                                            <tr className="bg-slate-50/50">
                                                <td colSpan={6} className="px-6 pb-6 pt-0">
                                                    <div className="ml-12 mt-2">
                                                        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                                                            <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                                                                <AlertCircle size={16} className="mr-2 text-brand-600" /> 
                                                                Onboarding Checklist
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                {allOnboardingTasks.filter(t => t.employee_id === emp.id).map(task => (
                                                                    <div 
                                                                        key={task.id} 
                                                                        className={`
                                                                            flex items-center justify-between p-3 rounded border transition-all
                                                                            ${task.status === 'Done' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}
                                                                        `}
                                                                    >
                                                                        <div className="flex items-center gap-3 overflow-hidden" onClick={(e) => toggleTaskStatus(task, e)}>
                                                                             {task.status === 'Done' ? (
                                                                                <CheckCircle size={18} className="text-green-600 flex-shrink-0 cursor-pointer" />
                                                                            ) : task.status === 'In Progress' ? (
                                                                                <div className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin flex-shrink-0 cursor-pointer"></div>
                                                                            ) : (
                                                                                <Circle size={18} className="text-slate-300 flex-shrink-0 cursor-pointer hover:text-brand-500" />
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
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Initiate Modal */}
            <Modal title="Initiate Onboarding" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Select a newly hired employee to generate the standard onboarding checklist.</p>
                    
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
                                .filter(e => !activeOnboardings.includes(e.id))
                                .map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button onClick={handleInitiateOnboarding} disabled={!selectedEmpId}>Start Onboarding</Button>
                    </div>
                </div>
            </Modal>

            {/* Global Comments Modal */}
            <Modal title="Onboarding Comments" isOpen={isCommentsModalOpen} onClose={() => setIsCommentsModalOpen(false)}>
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">Add notes regarding {employees.find(e => e.id === currentRecord?.employee_id)?.name}'s onboarding process.</p>
                    <Textarea 
                        label="General Comments" 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        placeholder="E.g. Candidate arriving late, pending visa approval..."
                    />
                    <div className="flex justify-end pt-2">
                        <Button onClick={saveComments}>Save Comments</Button>
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

export default Onboarding;
