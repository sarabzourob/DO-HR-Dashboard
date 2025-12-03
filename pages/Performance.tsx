
import React, { useState, useEffect } from 'react';
import { Employee, OnboardingTask, PerformanceRecord } from '../types';
import { 
    getEmployees, 
    getAllTasks, 
    addTask, 
    updateTask,
    getHRTeam,
    getAllPerformance,
    addPerformance,
    updatePerformance
} from '../services/storage';
import { Card, Button, Modal, Textarea, Select } from '../components/UI';
import { BarChart2, Search, CheckCircle, Circle, AlertCircle, ChevronDown, ChevronUp, UserCheck, MessageSquare, User } from 'lucide-react';

const PERFORMANCE_STAGES = [
    "Objective Setting",
    "Mid Review",
    "Final Review"
];

const Performance: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [hrTeam, setHrTeam] = useState<Employee[]>([]);
    const [allPerformanceTasks, setAllPerformanceTasks] = useState<OnboardingTask[]>([]);
    const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
    
    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmpId, setSelectedEmpId] = useState('');
    const [selectedOperator, setSelectedOperator] = useState<'Doha Oasis' | 'Kien'>('Doha Oasis'); // Operator Filter
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [assignedReviewer, setAssignedReviewer] = useState('');
    const [expandedRows, setExpandedRows] = useState<string[]>([]); // Key: empId-year
    const [searchTerm, setSearchTerm] = useState('');
    
    // Comments Modal
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<PerformanceRecord | null>(null);
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
        
        const tasks = getAllTasks().filter(t => t.category === 'Performance');
        setAllPerformanceTasks(tasks);
        
        const records = getAllPerformance();
        setPerformanceRecords(records);
    };

    const handleInitiatePerformance = () => {
        if (!selectedEmpId || !selectedYear) return;
        const empId = parseInt(selectedEmpId);
        
        // Check if record exists
        if (performanceRecords.find(r => r.employee_id === empId && r.year === selectedYear)) {
            alert(`Performance evaluation for ${selectedYear} already exists for this employee.`);
            return;
        }

        addPerformance({
            employee_id: empId,
            year: selectedYear,
            assigned_reviewer: assignedReviewer || 'Unassigned',
            initiated_at: new Date().toISOString(),
            comments: ''
        });

        // Add stages as tasks
        PERFORMANCE_STAGES.forEach(stage => {
            addTask({
                employee_id: empId,
                name: `${selectedYear} - ${stage}`,
                owner: assignedReviewer || 'HR',
                status: 'Not Started',
                category: 'Performance',
                due_date: new Date().toISOString().split('T')[0]
            });
        });

        refreshData();
        setIsModalOpen(false);
        setExpandedRows([...expandedRows, `${empId}-${selectedYear}`]);
        setSelectedEmpId('');
        setAssignedReviewer('');
    };

    const toggleRow = (key: string) => {
        if (expandedRows.includes(key)) {
            setExpandedRows(expandedRows.filter(k => k !== key));
        } else {
            setExpandedRows([...expandedRows, key]);
        }
    };

    const handleUpdateRecord = (record: PerformanceRecord, changes: Partial<PerformanceRecord>) => {
        updatePerformance({ ...record, ...changes });
        refreshData();
    };

    // Open comments modal
    const openComments = (record: PerformanceRecord, e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentRecord(record);
        setCommentText(record.comments || '');
        setIsCommentsModalOpen(true);
    };

    const saveComments = () => {
        if (currentRecord) {
            handleUpdateRecord(currentRecord, { comments: commentText });
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

    const toggleTaskStatus = (task: OnboardingTask, e: React.MouseEvent) => {
        e.stopPropagation();
        const nextStatus = task.status === 'Not Started' ? 'In Progress' : task.status === 'In Progress' ? 'Done' : 'Not Started';
        updateTask({ ...task, status: nextStatus });
        refreshData();
    };

    const getProgress = (empId: number, year: string) => {
        const tasks = allPerformanceTasks.filter(t => t.employee_id === empId && t.name.startsWith(year));
        if (tasks.length === 0) return 0;
        const done = tasks.filter(t => t.status === 'Done').length;
        return Math.round((done / tasks.length) * 100);
    };

    // Group records for display? No, just list them.
    const filteredRecords = performanceRecords.filter(r => {
        const emp = employees.find(e => e.id === r.employee_id);
        const search = searchTerm.toLowerCase();
        return (
            (emp?.name.toLowerCase().includes(search) || '') ||
            r.year.includes(search)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Performance Evaluation</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <BarChart2 size={18} className="mr-2" /> Initiate Evaluation
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search employee or year..." 
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
                                <th className="px-6 py-4">Year</th>
                                <th className="px-6 py-4">Reviewer</th>
                                <th className="px-6 py-4">Progress</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRecords.map(record => {
                                const emp = employees.find(e => e.id === record.employee_id);
                                if (!emp) return null;
                                
                                const key = `${record.employee_id}-${record.year}`;
                                const isExpanded = expandedRows.includes(key);
                                const progress = getProgress(record.employee_id, record.year);
                                
                                return (
                                    <React.Fragment key={key}>
                                        <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50' : ''}`} onClick={() => toggleRow(key)}>
                                            <td className="px-6 py-4 text-center">
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {emp.name}
                                                <div className="text-xs text-slate-400 font-normal">{emp.position}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded bg-slate-100 font-bold text-slate-700">{record.year}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                 <div 
                                                    className="flex items-center gap-2 hover:bg-slate-200 p-1 rounded -ml-1 cursor-pointer transition-colors w-fit"
                                                    onClick={(e) => e.stopPropagation()}
                                                 >
                                                    <UserCheck size={14} className="text-slate-500" />
                                                    <select 
                                                        className="text-sm bg-transparent border-none p-0 focus:ring-0 cursor-pointer text-slate-700 font-medium"
                                                        value={record.assigned_reviewer}
                                                        onChange={(e) => handleUpdateRecord(record, { assigned_reviewer: e.target.value })}
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
                                                <Button size="sm" variant="ghost" onClick={(e) => openComments(record, e)}>
                                                    <MessageSquare size={16} className={`mr-1 ${record.comments ? 'text-brand-600' : 'text-slate-400'}`} />
                                                    {record.comments ? 'Edit Notes' : 'Add Notes'}
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
                                                                Evaluation Stages
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                {allPerformanceTasks
                                                                    .filter(t => t.employee_id === record.employee_id && t.name.startsWith(record.year))
                                                                    .map(task => (
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
                                                                                {task.name.replace(`${record.year} - `, '')}
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        <button 
                                                                            className="p-1 hover:bg-slate-100 rounded-full" 
                                                                            title={`Reviewer: ${task.owner || 'HR'}`}
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
                             {filteredRecords.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                        No performance evaluations found. Click "Initiate Evaluation" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Initiate Modal */}
            <Modal title="Initiate Performance Review" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-4">
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
                                .map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Evaluation Year</label>
                        <select 
                            className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 text-sm"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Assign Reviewer</label>
                        <select 
                            className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 text-sm"
                            value={assignedReviewer}
                            onChange={(e) => setAssignedReviewer(e.target.value)}
                        >
                            <option value="">-- Select HR/Manager --</option>
                            {hrTeam.map(h => (
                                <option key={h.id} value={h.name}>{h.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button onClick={handleInitiatePerformance} disabled={!selectedEmpId}>Start Evaluation</Button>
                    </div>
                </div>
            </Modal>

            {/* Global Comments Modal */}
            <Modal title="Evaluation Notes" isOpen={isCommentsModalOpen} onClose={() => setIsCommentsModalOpen(false)}>
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">General notes for the {currentRecord?.year} evaluation cycle.</p>
                    <Textarea 
                        label="Comments" 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        placeholder="E.g. Delayed due to project assignment..."
                    />
                    <div className="flex justify-end pt-2">
                        <Button onClick={saveComments}>Save Notes</Button>
                    </div>
                </div>
            </Modal>

            {/* Task Delegation Modal */}
            {selectedTask && (
                <Modal title="Stage Details & Assignment" isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
                    <div className="space-y-4">
                         <div className="p-3 bg-slate-50 rounded border border-slate-200">
                             <h4 className="font-medium text-slate-900">{selectedTask.name}</h4>
                             <p className="text-xs text-slate-500 mt-1">Status: {selectedTask.status}</p>
                         </div>
                         
                         <Select 
                            label="Assign Stage to"
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
                            label="Stage Comments" 
                            value={selectedTask.comments || ''} 
                            onChange={(e) => setSelectedTask({...selectedTask, comments: e.target.value})} 
                            placeholder="Feedback or notes for this stage..."
                        />
                        
                        <div className="flex justify-end pt-2">
                            <Button onClick={saveTaskDelegation}>Update Stage</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Performance;
