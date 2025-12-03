
import React, { useState, useEffect } from 'react';
import { HRRequest, Employee } from '../types';
import { getAllRequests, getEmployees, updateRequest, addRequest, getHRTeam } from '../services/storage';
import { Card, Button, Select, Input, RequestBadge, Modal, Textarea } from '../components/UI';
import { Search, Edit, Plus, Filter, CheckCircle, Clock } from 'lucide-react';

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
    "Laundry", // New
    "Destination Change",
    "Removal of Benefits",
    "Business Justification",
    "Food Handler Certificate",
    "Transportation",
    "Other"
];

const HRRequests: React.FC = () => {
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [employees, setEmployees] = useState<Record<number, string>>({});
  const [employeesList, setEmployeesList] = useState<Employee[]>([]); // For dropdown
  const [hrTeam, setHrTeam] = useState<Employee[]>([]); // For HR dropdown
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'History'>('All');
  
  // Edit State
  const [editingReq, setEditingReq] = useState<HRRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Create State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createOperator, setCreateOperator] = useState<'Doha Oasis' | 'Kien'>('Doha Oasis'); // New Operator Filter
  const [createForm, setCreateForm] = useState({
    employee_id: '',
    request_type: REQUEST_TYPES[0],
    custom_type: '',
    status: 'New',
    assigned_to: '',
    description: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setRequests(getAllRequests().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    
    // Create employee lookup and list
    const emps = getEmployees();
    setEmployeesList(emps);
    
    // Get HR Team for assignment
    setHrTeam(getHRTeam());
    
    const lookup: Record<number, string> = {};
    emps.forEach(e => lookup[e.id] = e.name);
    setEmployees(lookup);
  };

  // --- Create Handlers ---
  const handleCreateSubmit = () => {
    if (!createForm.employee_id) {
      alert("Please select an employee");
      return;
    }

    const finalType = createForm.request_type === 'Other' ? (createForm.custom_type || 'Other') : createForm.request_type;

    addRequest({
        employee_id: parseInt(createForm.employee_id),
        request_type: finalType,
        status: createForm.status as any,
        description: createForm.description,
        assigned_to: createForm.assigned_to
    });

    setIsCreateModalOpen(false);
    refreshData();
    // Reset form
    setCreateForm({
        employee_id: '',
        request_type: REQUEST_TYPES[0],
        custom_type: '',
        status: 'New',
        assigned_to: '',
        description: ''
    });
  };

  // --- Edit Handlers ---
  const handleEditClick = (req: HRRequest) => {
    setEditingReq({ ...req }); // Clone to avoid direct mutation
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingReq) {
        updateRequest(editingReq);
        setIsEditModalOpen(false);
        setEditingReq(null);
        refreshData();
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.request_type.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (employees[r.employee_id] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.assigned_to || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAssignee = assigneeFilter ? r.assigned_to === assigneeFilter : true;
    
    let matchesStatus = true;
    if (statusFilter === 'Pending') {
        matchesStatus = r.status === 'New' || r.status === 'In Progress';
    } else if (statusFilter === 'History') {
        matchesStatus = r.status === 'Completed' || r.status === 'Rejected';
    }
    
    return matchesSearch && matchesAssignee && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">HR Requests</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} className="mr-2" /> New Request
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search request..." 
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:ring-brand-500 focus:border-brand-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
             <div className="flex items-center w-full md:w-auto">
                 <Filter size={18} className="text-slate-500 mr-2 hidden md:block" />
                 <select 
                    className="rounded-lg border-slate-300 border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 text-sm w-full md:w-48"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                 >
                     <option value="All">All Statuses</option>
                     <option value="Pending">Pending (Active)</option>
                     <option value="History">History (Closed)</option>
                 </select>
             </div>
             
             <select 
                className="rounded-lg border-slate-300 border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 text-sm w-full md:w-48"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
             >
                 <option value="">All Assignees</option>
                 <optgroup label="Filter by HR Rep">
                    {hrTeam.map(h => (
                        <option key={h.id} value={h.name}>{h.name}</option>
                    ))}
                 </optgroup>
             </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Request Type</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                      {employees[req.employee_id] || `Unknown (${req.employee_id})`}
                  </td>
                  <td className="px-6 py-4">{req.request_type}</td>
                  <td className="px-6 py-4">
                      {req.assigned_to ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                              {req.assigned_to}
                          </span>
                      ) : (
                          <span className="text-slate-400">-</span>
                      )}
                  </td>
                  <td className="px-6 py-4">{new Date(req.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <RequestBadge status={req.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(req)}>
                        <Edit size={14} className="mr-1" /> Update
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                        <p>No requests found.</p>
                        <p className="text-sm mt-1 text-slate-500">Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Modal */}
      <Modal title="Create New Request" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <div className="space-y-4">
             {/* Operator Filter */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                    type="button"
                    onClick={() => { setCreateOperator('Doha Oasis'); setCreateForm({...createForm, employee_id: ''}); }}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${createOperator === 'Doha Oasis' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Doha Oasis
                </button>
                <button
                    type="button"
                    onClick={() => { setCreateOperator('Kien'); setCreateForm({...createForm, employee_id: ''}); }}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${createOperator === 'Kien' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Kien
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee ({createOperator})</label>
                <select 
                    className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 text-sm"
                    value={createForm.employee_id}
                    onChange={(e) => setCreateForm({...createForm, employee_id: e.target.value})}
                >
                    <option value="">-- Select Employee --</option>
                    {employeesList
                        .filter(emp => emp.operator === createOperator)
                        .map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} - {emp.position}</option>
                    ))}
                </select>
            </div>
            
            <Select 
                label="Request Type" 
                value={createForm.request_type} 
                onChange={e => setCreateForm({...createForm, request_type: e.target.value})}
                options={REQUEST_TYPES.map(t => ({ value: t, label: t }))} 
            />
            
            {createForm.request_type === 'Other' && (
                <Input 
                    label="Custom Type" 
                    placeholder="Specify request type..." 
                    value={createForm.custom_type} 
                    onChange={e => setCreateForm({...createForm, custom_type: e.target.value})} 
                />
            )}

            <Select 
                label="Status" 
                value={createForm.status} 
                onChange={e => setCreateForm({...createForm, status: e.target.value})}
                options={[
                    {value:'New', label:'New'}, 
                    {value:'In Progress', label:'In Progress'}, 
                    {value:'Completed', label:'Completed'}, 
                    {value:'Rejected', label:'Rejected'}
                ]} 
            />

            <Select 
                label="Assign to HR Rep"
                value={createForm.assigned_to} 
                onChange={e => setCreateForm({...createForm, assigned_to: e.target.value})}
                options={[
                    {value: '', label: '-- Select HR Rep --'},
                    ...hrTeam.map(h => ({ value: h.name, label: h.name }))
                ]}
            />
            
            <Textarea 
                label="Description" 
                value={createForm.description} 
                onChange={e => setCreateForm({...createForm, description: e.target.value})} 
            />

            <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateSubmit}>Create Request</Button>
            </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      {editingReq && (
        <Modal title="Update Request" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                    <div className="text-slate-900 p-2 bg-slate-50 rounded border border-slate-200 text-sm">
                        {employees[editingReq.employee_id]}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Request Type</label>
                    <div className="text-slate-900 font-medium p-2 bg-slate-50 rounded border border-slate-200 text-sm">
                        {editingReq.request_type}
                    </div>
                </div>
                <Select 
                    label="Status" 
                    value={editingReq.status} 
                    onChange={e => setEditingReq({...editingReq, status: e.target.value as any})}
                    options={[
                        {value:'New', label:'New'}, 
                        {value:'In Progress', label:'In Progress'}, 
                        {value:'Completed', label:'Completed'}, 
                        {value:'Rejected', label:'Rejected'}
                    ]} 
                />
                
                <Select 
                    label="Assigned To (HR Rep)"
                    value={editingReq.assigned_to || ''} 
                    onChange={e => setEditingReq({...editingReq, assigned_to: e.target.value})}
                    options={[
                        {value: '', label: '-- Unassigned --'},
                        ...hrTeam.map(h => ({ value: h.name, label: h.name }))
                    ]}
                />

                <Textarea 
                    label="Description / Notes" 
                    value={editingReq.description || ''} 
                    onChange={e => setEditingReq({...editingReq, description: e.target.value})} 
                    placeholder="Add progress notes..."
                />
                <div className="pt-2 flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default HRRequests;
