
import React, { useState, useEffect } from 'react';
import { Position, Employee, COMPANY_GRADES } from '../types';
import { getPositions, addPosition, getEmployees, updatePosition } from '../services/storage';
import { generateJobDescription } from '../services/ai';
import { Card, CardContent, CardHeader, Button, Input, Select, Textarea, Badge, Modal } from '../components/UI';
import { Plus, Sparkles, Loader2, Filter, CheckCircle, XCircle, UserCheck } from 'lucide-react';

const Positions: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Open' | 'Closed'>('All');

  // Fill Position Modal State
  const [isFillModalOpen, setIsFillModalOpen] = useState(false);
  const [selectedPosForFill, setSelectedPosForFill] = useState<Position | null>(null);
  const [candidateName, setCandidateName] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    operator: 'Doha Oasis',
    department: '',
    grade: '',
    status: 'Pending Approval' as any,
    description: '',
    hiring_manager: '',
    target_hire_date: '',
    justification: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setPositions(getPositions());
    setEmployees(getEmployees());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.department || !formData.operator) {
      alert("Please fill Title, Operator and Department to generate a description.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateJobDescription(formData.title, formData.department, formData.operator);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPos = addPosition({
        ...formData,
        request_date: new Date().toISOString().split('T')[0]
    });
    setPositions([...positions, newPos]);
    setIsFormOpen(false);
    // Reset
    setFormData({ title: '', operator: 'Doha Oasis', department: '', grade: '', status: 'Pending Approval', description: '', hiring_manager: '', target_hire_date: '', justification: '' });
  };

  const handleStatusChange = (position: Position, newStatus: 'Open' | 'Rejected') => {
      const updated = { ...position, status: newStatus };
      updatePosition(updated);
      refreshData();
  };

  const openFillModal = (pos: Position) => {
      setSelectedPosForFill(pos);
      setCandidateName('');
      setIsFillModalOpen(true);
  };

  const handleFillSubmit = () => {
      if(selectedPosForFill && candidateName) {
          const updated: Position = { 
              ...selectedPosForFill, 
              status: 'Filled', 
              filled_by: candidateName 
          };
          updatePosition(updated);
          setIsFillModalOpen(false);
          setSelectedPosForFill(null);
          setCandidateName('');
          refreshData();
      }
  };

  const filteredPositions = positions.filter(p => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'Pending') return p.status === 'Pending Approval';
      return p.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Positions Request</h1>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? 'Cancel' : <><Plus size={18} className="mr-2" /> New Position Request</>}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader title="Position Request Form" />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-brand-50 rounded-lg border border-brand-100 mb-4">
                  <h3 className="text-sm font-semibold text-brand-800 mb-2">Request Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Select 
                        label="Hiring Manager" 
                        name="hiring_manager" 
                        value={formData.hiring_manager} 
                        onChange={handleChange}
                        options={[
                            {value: '', label: '-- Select Manager --'},
                            ...employees.map(e => ({ value: e.name, label: e.name }))
                        ]}
                        required
                     />
                     <Input label="Target Hire Date" type="date" name="target_hire_date" value={formData.target_hire_date} onChange={handleChange} required />
                     <div className="md:col-span-2">
                        <Textarea label="Justification for Position" name="justification" value={formData.justification} onChange={handleChange} required placeholder="Why is this role needed now?" />
                     </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} required />
                <Select 
                    label="Operator"
                    name="operator"
                    value={formData.operator}
                    onChange={handleChange}
                    options={[
                        {value: 'Doha Oasis', label: 'Doha Oasis'},
                        {value: 'Kien', label: 'Kien'}
                    ]}
                />
                <Input label="Department" name="department" value={formData.department} onChange={handleChange} required />
                
                <Select 
                    label="Grade" 
                    name="grade" 
                    value={formData.grade} 
                    onChange={handleChange}
                    options={[
                        { value: '', label: '-- Select Grade --' },
                        ...COMPANY_GRADES.map(g => ({ value: g, label: `Grade ${g}` }))
                    ]}
                />
              </div>
              
              <div className="relative">
                 <Textarea 
                   label="Job Description" 
                   name="description" 
                   value={formData.description} 
                   onChange={handleChange}
                   placeholder="Enter description manually or generate with AI..."
                   className="min-h-[120px]"
                 />
                 <div className="absolute top-0 right-0">
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost" 
                      onClick={handleGenerateDescription}
                      disabled={isGenerating}
                      className="text-brand-600"
                    >
                      {isGenerating ? <Loader2 className="animate-spin mr-2" size={14} /> : <Sparkles className="mr-2" size={14} />}
                      {isGenerating ? 'Drafting...' : 'AI Draft'}
                    </Button>
                 </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-700">All Positions</h3>
            <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-500" />
                <select 
                    className="text-sm border-slate-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending Approval</option>
                    <option value="Open">Open</option>
                    <option value="Filled">Filled</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Requested By</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPositions.map((pos) => (
                <tr key={pos.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                      {pos.title}
                      {pos.target_hire_date && <div className="text-xs text-slate-400 mt-1">Target: {pos.target_hire_date}</div>}
                  </td>
                  <td className="px-6 py-4">{pos.department}</td>
                  <td className="px-6 py-4">{pos.hiring_manager || '-'}</td>
                  <td className="px-6 py-4">{pos.request_date || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                        <Badge color={
                            pos.status === 'Open' ? 'green' : 
                            pos.status === 'Pending Approval' ? 'yellow' : 
                            pos.status === 'Filled' ? 'blue' : 
                            pos.status === 'Rejected' ? 'red' : 'gray'
                        }>
                            {pos.status}
                        </Badge>
                        {pos.status === 'Filled' && pos.filled_by && (
                            <span className="text-xs text-slate-500">by {pos.filled_by}</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {pos.status === 'Pending Approval' && (
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => handleStatusChange(pos, 'Open')}
                                className="text-green-600 hover:text-green-800 p-1" 
                                title="Approve"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button 
                                onClick={() => handleStatusChange(pos, 'Rejected')}
                                className="text-red-600 hover:text-red-800 p-1" 
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    )}
                    {pos.status === 'Open' && (
                        <Button size="sm" variant="outline" onClick={() => openFillModal(pos)}>
                            <UserCheck size={14} className="mr-1" /> Mark Filled
                        </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPositions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">No positions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Fill Position Modal */}
      <Modal title="Mark Position as Filled" isOpen={isFillModalOpen} onClose={() => setIsFillModalOpen(false)}>
          <div className="space-y-4">
              <p className="text-sm text-slate-600">
                  Please enter the name of the candidate who has accepted the offer for the 
                  <span className="font-semibold text-slate-900"> {selectedPosForFill?.title}</span> position.
              </p>
              <Input 
                 label="Candidate Name" 
                 value={candidateName} 
                 onChange={(e) => setCandidateName(e.target.value)} 
                 placeholder="e.g. John Doe"
                 autoFocus
              />
              <div className="flex justify-end pt-2">
                  <Button onClick={handleFillSubmit} disabled={!candidateName.trim()}>Confirm & Close Position</Button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default Positions;
