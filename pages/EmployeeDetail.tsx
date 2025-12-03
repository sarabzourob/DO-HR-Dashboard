
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Employee, OnboardingTask, HRRequest } from '../types';
import { getEmployeeById, getTasksByEmployee, addTask, getRequestsByEmployee, addRequest, getHRTeam, updateTask } from '../services/storage';
import { suggestOnboardingTasks } from '../services/ai';
import { Card, CardContent, Button, Input, Select, Textarea, Badge, RequestBadge, Modal } from '../components/UI';
import { ArrowLeft, Sparkles, Calendar, ClipboardList, CheckCircle, Circle, User } from 'lucide-react';

const REQUEST_TYPES = [
    "Accommodation Move",
    "Bank Account Opening",
    "Salary Certificate / Bank Letter",
    "Internal Transfer",
    "Cross-Training Request",
    "Visa / NOC Letter",
    "Complaint / Grievance",
    "Shift / Schedule Change",
    "Sim Card",
    "Duty Mobile",
    "TAF",
    "EOS",
    "OPS",
    "Duty Trip",
    "ID Replacement",
    "Name Tag",
    "Medical Expense Claim",
    "NOC",
    "Visa Request",
    "Weekly Meal",
    "Laundry", 
    "Destination Change",
    "Removal of Benefits",
    "Business Justification",
    "Food Handler Certificate",
    "Transportation",
    "Other"
];

const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const empId = parseInt(id || '0');
  
  const [employee, setEmployee] = useState<Employee | undefined>();
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [hrTeam, setHrTeam] = useState<Employee[]>([]);
  
  const [activeTab, setActiveTab] = useState<'onboarding' | 'requests'>('onboarding');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showReqForm, setShowReqForm] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  // Task Delegation Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OnboardingTask | null>(null);

  // Task Form State
  const [taskForm, setTaskForm] = useState({ name: '', owner: 'HR', status: 'Not Started', due_date: '', comments: '' });
  
  // Request Form State
  const [reqForm, setReqForm] = useState({ 
    request_type: REQUEST_TYPES[0], 
    custom_type: '',
    status: 'New', 
    description: '',
    assigned_to: ''
  });

  useEffect(() => {
    const emp = getEmployeeById(empId);
    if (emp) {
      setEmployee(emp);
      setTasks(getTasksByEmployee(empId));
      setRequests(getRequestsByEmployee(empId));
      setHrTeam(getHRTeam());
    }
  }, [empId]);

  const handleSuggestTasks = async () => {
    if (!employee) return;
    setIsSuggesting(true);
    const suggested = await suggestOnboardingTasks(employee.position);
    
    // Auto-add suggested tasks
    const newTasks: OnboardingTask[] = [];
    suggested.forEach(taskName => {
        const newTask = addTask({
            employee_id: empId,
            name: taskName,
            owner: 'HR',
            status: 'Not Started',
            due_date: new Date().toISOString().split('T')[0], // today
            category: 'Onboarding'
        });
        newTasks.push(newTask);
    });
    
    setTasks(prev => [...prev, ...newTasks]);
    setIsSuggesting(false);
  };

  const handleAddStandardTasks = () => {
     const standardTasks = [
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
     
     const newTasks: OnboardingTask[] = [];
     standardTasks.forEach(name => {
         const t = addTask({
             employee_id: empId,
             name: name,
             owner: 'HR',
             status: 'Not Started',
             due_date: new Date().toISOString().split('T')[0],
             category: 'Onboarding'
         });
         newTasks.push(t);
     });
     
     setTasks(prev => [...prev, ...newTasks]);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = addTask({ ...taskForm, employee_id: empId, category: 'Onboarding' } as any);
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
    setTaskForm({ name: '', owner: 'HR', status: 'Not Started', due_date: '', comments: '' });
  };

  const handleReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalType = reqForm.request_type === 'Other' ? (reqForm.custom_type || 'Other') : reqForm.request_type;
    
    const newReq = addRequest({ 
      request_type: finalType,
      status: reqForm.status as any,
      description: reqForm.description,
      assigned_to: reqForm.assigned_to,
      employee_id: empId 
    });
    
    setRequests([...requests, newReq]);
    setShowReqForm(false);
    setReqForm({ request_type: REQUEST_TYPES[0], custom_type: '', status: 'New', description: '', assigned_to: '' });
  };
  
  const openTaskDelegation = (task: OnboardingTask) => {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
  };
  
  const saveTaskDelegation = () => {
      if (selectedTask) {
          updateTask(selectedTask);
          setIsTaskModalOpen(false);
          // Refresh list locally
          setTasks(tasks.map(t => t.id === selectedTask.id ? selectedTask : t));
      }
  };
  
  const toggleTaskStatus = (task: OnboardingTask) => {
      const nextStatus: OnboardingTask['status'] = task.status === 'Not Started' ? 'In Progress' : task.status === 'In Progress' ? 'Done' : 'Not Started';
      const updated: OnboardingTask = { ...task, status: nextStatus };
      updateTask(updated);
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
  };

  if (!employee) return <div className="text-center p-10">Employee not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/employees" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={18} className="mr-1" /> Back to List
      </Link>

      {/* Header Profile */}
      <Card className="bg-white">
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{employee.name}</h1>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-1"><BriefcaseIcon /> {employee.position}</span>
                <span className="flex items-center gap-1"><BuildingIcon /> {employee.department}</span>
                <span className="flex items-center gap-1"><BadgeIcon /> {employee.operator}</span>
                {employee.date_joined && <span className="flex items-center gap-1"><Calendar size={14} /> Joined: {employee.date_joined}</span>}
              </div>
            </div>
            <div className="flex gap-2">
                <Badge color="blue">{employee.grade || 'No Grade'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('onboarding')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'onboarding'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Onboarding Tasks
            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">{tasks.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            HR Requests
            <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">{requests.length}</span>
          </button>
        </nav>
      </div>

      {/* Onboarding Tab */}
      {activeTab === 'onboarding' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold text-slate-800">Task Checklist</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleAddStandardTasks}>
                <ClipboardList size={16} className="mr-2 text-slate-600" />
                Standard Checklist
              </Button>
              <Button variant="secondary" size="sm" onClick={handleSuggestTasks} disabled={isSuggesting}>
                <Sparkles size={16} className="mr-2 text-brand-600" />
                {isSuggesting ? 'Thinking...' : 'AI Suggest Tasks'}
              </Button>
              <Button size="sm" onClick={() => setShowTaskForm(!showTaskForm)}>+ Add Task</Button>
            </div>
          </div>

          {showTaskForm && (
            <Card className="bg-slate-50 border-slate-200">
                <CardContent>
                    <form onSubmit={handleTaskSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Task Name" value={taskForm.name} onChange={e => setTaskForm({...taskForm, name: e.target.value})} required />
                            <Select 
                                label="Owner / Assigned HR"
                                options={[
                                    {value: 'HR', label: 'General HR Team'},
                                    ...hrTeam.map(h => ({ value: h.name, label: h.name }))
                                ]}
                                value={taskForm.owner}
                                onChange={e => setTaskForm({...taskForm, owner: e.target.value})}
                             />
                            <Select 
                                label="Status" 
                                value={taskForm.status} 
                                onChange={e => setTaskForm({...taskForm, status: e.target.value})}
                                options={[{value:'Not Started', label:'Not Started'}, {value:'In Progress', label:'In Progress'}, {value:'Done', label:'Done'}]} 
                            />
                            <Input label="Due Date" type="date" value={taskForm.due_date} onChange={e => setTaskForm({...taskForm, due_date: e.target.value})} />
                        </div>
                        <Textarea label="Comments" value={taskForm.comments} onChange={e => setTaskForm({...taskForm, comments: e.target.value})} />
                        <div className="flex justify-end"><Button type="submit">Save Task</Button></div>
                    </form>
                </CardContent>
            </Card>
          )}

          <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
             {tasks.length === 0 ? (
                 <div className="p-8 text-center text-slate-400">No tasks assigned. Load standard checklist or use AI to suggest!</div>
             ) : (
                 <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-700 font-semibold uppercase">
                         <tr>
                             <th className="px-6 py-3">Task</th>
                             <th className="px-6 py-3">Owner</th>
                             <th className="px-6 py-3">Due Date</th>
                             <th className="px-6 py-3">Status</th>
                             <th className="px-6 py-3 text-right">Action</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {tasks.map(t => (
                             <tr key={t.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => openTaskDelegation(t)}>
                                 <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); toggleTaskStatus(t); }} 
                                        className="text-slate-400 hover:text-brand-500"
                                     >
                                         {t.status === 'Done' ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} />}
                                     </button>
                                     {t.name}
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-2">
                                         {t.owner && t.owner !== 'HR' ? (
                                            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center justify-center font-bold" title={t.owner}>
                                                {t.owner.charAt(0)}
                                            </div>
                                         ) : (
                                            <User size={16} className="text-slate-300" />
                                         )}
                                         <span>{t.owner}</span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-4">{t.due_date || '-'}</td>
                                 <td className="px-6 py-4">
                                     <StatusBadge status={t.status} />
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                     <Button size="sm" variant="ghost">Edit</Button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             )}
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800">HR Requests</h2>
            <Button size="sm" onClick={() => setShowReqForm(!showReqForm)}>+ New Request</Button>
          </div>

          {showReqForm && (
            <Card className="bg-slate-50 border-slate-200">
                <CardContent>
                    <form onSubmit={handleReqSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select 
                                label="Request Type" 
                                value={reqForm.request_type} 
                                onChange={e => setReqForm({...reqForm, request_type: e.target.value})}
                                options={REQUEST_TYPES.map(t => ({ value: t, label: t }))} 
                            />
                            {reqForm.request_type === 'Other' && (
                                <Input 
                                    label="Custom Type" 
                                    placeholder="Specify request type..." 
                                    value={reqForm.custom_type} 
                                    onChange={e => setReqForm({...reqForm, custom_type: e.target.value})} 
                                    required
                                />
                            )}
                            <Select 
                                label="Status" 
                                value={reqForm.status} 
                                onChange={e => setReqForm({...reqForm, status: e.target.value})}
                                options={[{value:'New', label:'New'}, {value:'In Progress', label:'In Progress'}, {value:'Completed', label:'Completed'}, {value:'Rejected', label:'Rejected'}]} 
                            />
                            
                            <Select 
                                label="Assign to HR Rep"
                                value={reqForm.assigned_to} 
                                onChange={e => setReqForm({...reqForm, assigned_to: e.target.value})}
                                options={[
                                    {value: '', label: '-- Select HR Rep --'},
                                    ...hrTeam.map(h => ({ value: h.name, label: h.name }))
                                ]}
                            />
                        </div>
                        <Textarea label="Description" value={reqForm.description} onChange={e => setReqForm({...reqForm, description: e.target.value})} />
                        <div className="flex justify-end"><Button type="submit">Submit Request</Button></div>
                    </form>
                </CardContent>
            </Card>
          )}

          <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
             {requests.length === 0 ? (
                 <div className="p-8 text-center text-slate-400">No requests history found.</div>
             ) : (
                 <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-700 font-semibold uppercase">
                         <tr>
                             <th className="px-6 py-3">Type</th>
                             <th className="px-6 py-3">Assigned To</th>
                             <th className="px-6 py-3">Description</th>
                             <th className="px-6 py-3">Created</th>
                             <th className="px-6 py-3">Status</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {requests.map(r => (
                             <tr key={r.id} className="hover:bg-slate-50">
                                 <td className="px-6 py-4 font-medium text-slate-900">{r.request_type}</td>
                                 <td className="px-6 py-4 text-slate-500">{r.assigned_to || '-'}</td>
                                 <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{r.description || '-'}</td>
                                 <td className="px-6 py-4 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
                                 <td className="px-6 py-4">
                                     <RequestBadge status={r.status} />
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             )}
          </div>
        </div>
      )}
      
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

// Helper Icons
const BriefcaseIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const BuildingIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const BadgeIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" /></svg>;

const StatusBadge: React.FC<{status: string}> = ({status}) => {
    let color: 'gray' | 'blue' | 'green' = 'gray';
    if(status === 'In Progress') color = 'blue';
    if(status === 'Done') color = 'green';
    return <Badge color={color}>{status}</Badge>
}

export default EmployeeDetail;
