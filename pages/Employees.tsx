
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Employee, COMPANY_GRADES } from '../types';
import { getEmployees, addEmployee } from '../services/storage';
import { Card, CardContent, CardHeader, Button, Input, Select } from '../components/UI';
import { Plus, User, Search, Building } from 'lucide-react';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [operatorFilter, setOperatorFilter] = useState<'All' | 'Doha Oasis' | 'Kien'>('Doha Oasis');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    operator: 'Doha Oasis',
    department: '',
    position: '',
    grade: '',
    date_joined: ''
  });

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp = addEmployee(formData);
    setEmployees([...employees, newEmp]);
    setIsFormOpen(false);
    setFormData({ name: '', operator: 'Doha Oasis', department: '', position: '', grade: '', date_joined: '' });
  };

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOperator = operatorFilter === 'All' || e.operator === operatorFilter;
    
    return matchesSearch && matchesOperator;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? 'Cancel' : <><Plus size={18} className="mr-2" /> Add Employee</>}
        </Button>
      </div>

      {isFormOpen && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader title="Register New Employee" />
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Operator</label>
                   <select 
                     name="operator"
                     className="w-full rounded-lg border-slate-300 border shadow-sm focus:border-brand-500 focus:ring-brand-500 py-2 px-3 text-sm"
                     value={formData.operator}
                     onChange={handleChange}
                   >
                     <option value="Doha Oasis">Doha Oasis</option>
                     <option value="Kien">Kien</option>
                   </select>
                </div>
                <Input label="Department" name="department" value={formData.department} onChange={handleChange} required />
                <Input label="Position Title" name="position" value={formData.position} onChange={handleChange} required />
                
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
                
                <Input label="Date Joined" type="date" name="date_joined" value={formData.date_joined} onChange={handleChange} />
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Save Employee</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        {/* Operator Tabs */}
        <div className="flex border-b border-slate-200">
           <button 
             onClick={() => setOperatorFilter('Doha Oasis')}
             className={`flex-1 py-4 text-center text-sm font-medium border-b-2 hover:text-brand-600 transition-colors ${operatorFilter === 'Doha Oasis' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500'}`}
           >
             Doha Oasis
           </button>
           <button 
             onClick={() => setOperatorFilter('Kien')}
             className={`flex-1 py-4 text-center text-sm font-medium border-b-2 hover:text-brand-600 transition-colors ${operatorFilter === 'Kien' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500'}`}
           >
             Kien
           </button>
           <button 
             onClick={() => setOperatorFilter('All')}
             className={`flex-1 py-4 text-center text-sm font-medium border-b-2 hover:text-brand-600 transition-colors ${operatorFilter === 'All' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500'}`}
           >
             All Employees
           </button>
        </div>

        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search employees..." 
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
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Operator</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${emp.operator === 'Kien' ? 'bg-orange-100 text-orange-700' : 'bg-brand-100 text-brand-700'}`}>
                      <User size={16} />
                    </div>
                    {emp.name}
                  </td>
                  <td className="px-6 py-4">{emp.department}</td>
                  <td className="px-6 py-4">{emp.position}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${emp.operator === 'Kien' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                        {emp.operator}
                    </span>
                  </td>
                  <td className="px-6 py-4">{emp.date_joined || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/employees/${emp.id}`}>
                      <Button variant="ghost" size="sm">Manage</Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                        <User size={48} className="text-slate-200 mb-2" />
                        <p>No employees found for {operatorFilter}.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Employees;
