'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Building2, UserRound, PhoneCall, CheckCircle, Users } from 'lucide-react';

const CHENNAI_AREAS = ['Adyar', 'Alandur', 'Ambattur', 'Anna Nagar', 'Ashok Nagar', 'Aminjikarai', 'Avadi', 'Besant Nagar', 'Broadway', 'Chromepet', 'Egmore', 'Guindy', 'Kilpauk', 'Kodambakkam', 'Kolathur', 'Madipakkam', 'Madhavaram', 'Mambalam', 'Manapakkam', 'Medavakkam', 'Mogappair', 'Nanganallur', 'OMR', 'Pallavaram', 'Perambur', 'Porur', 'Royapettah', 'Saidapet', 'Sholinganallur', 'Tambaram', 'T Nagar', 'Thiruvanmiyur', 'Triplicane', 'Vadapalani', 'Velachery', 'Villivakkam', 'Virugambakkam', 'West Mambalam', 'Greams Road', 'Gandhi Nagar', 'Koyembedu', 'Mylapore', 'Perungudi'].sort();
const LANGUAGES = ['Bengali', 'Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Urdu'];

const PREDEFINED_SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Emergency Medicine'
];

const PREDEFINED_DEPARTMENTS = [
  'Reception',
  'Nursing',
  'Pharmacy',
  'Laboratory',
  'Radiology',
  'Administration',
  'Billing',
  'Emergency',
  'ICU',
  'Blood Bank',
  'Maintenance',
  'Security'
];

const SAMPLE_HOSPITALS = [
  { name: 'Apollo Hospital Chennai', city: 'Chennai', area: 'Greams Road', emergency_phone: '1066', phone: '044-28293333', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Cardiology', 'Neurology', 'Oncology'], description: 'Leading multi-specialty hospital.', category: 'Private', status: 'Active' },
  { name: 'MGM Healthcare Chennai', city: 'Chennai', area: 'Aminjikarai', emergency_phone: '044-45688888', phone: '044-45688888', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Emergency Medicine', 'Orthopedics'], description: 'State of the art healthcare.', category: 'Private', status: 'Active' },
  { name: 'MIOT International Chennai', city: 'Chennai', area: 'Manapakkam', emergency_phone: '105710', phone: '044-22492288', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Orthopedics', 'Pediatrics'], description: 'Pioneers in orthopedic care.', category: 'Private', status: 'Active' }
];

const SAMPLE_DOCTORS = [
  { doctor_name: 'Dr. Anirban Roy', specialization: 'Cardiology', experience: '15 years', languages: ['Bengali', 'English', 'Tamil'], otp_required: true },
  { doctor_name: 'Dr. Saptarshi Chatterjee', specialization: 'Neurology', experience: '12 years', languages: ['Bengali', 'English'], otp_required: true },
  { doctor_name: 'Dr. Debasish Banerjee', specialization: 'Orthopedics', experience: '20 years', languages: ['Bengali', 'English', 'Hindi'], otp_required: true }
];

function AdminEmergencyPageContent() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'staff'>('hospitals');

  useEffect(() => {
    if (tabParam && ['hospitals', 'doctors', 'staff'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [staff, setStaff] = useState<BengaliStaff[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState<string>('all');

  const moduleKey = 'emergency';
  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');
  const canManage = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'manage');

  useEffect(() => {
    if (canView) {
      loadData();
    }
  }, [canView]);

  async function loadData() {
    setLoading(true);
    try {
      const [hSnap, dSnap, sSnap] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.hospitals)),
        getDocs(collection(db, COLLECTIONS.bengali_doctors)),
        getDocs(collection(db, COLLECTIONS.bengali_staff || 'bengali_staff'))
      ]);
      setHospitals(hSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital)));
      setDoctors(dSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliDoctor)));
      setStaff(sSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliStaff)));
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function seedSampleData() {
    if (!confirm('This will insert sample hospitals and doctors. Proceed?')) return;
    setSeeding(true);
    try {
      const now = new Date().toISOString();
      const hospitalDocs = [];
      
      for (const h of SAMPLE_HOSPITALS) {
        const id = `hosp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const payload = { ...h, id, created_at: now };
        await setDoc(doc(db, COLLECTIONS.hospitals, id), payload);
        hospitalDocs.push(payload);
      }
      
      for (let i = 0; i < SAMPLE_DOCTORS.length; i++) {
        const d = SAMPLE_DOCTORS[i];
        const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const hId = hospitalDocs[i % hospitalDocs.length].id;
        const payload = { ...d, id, hospital_id: hId, hospital_ids: [hId], created_at: now };
        await setDoc(doc(db, COLLECTIONS.bengali_doctors, id), payload);
      }
      
      alert('Sample data successfully added!');
      loadData();
    } catch (e) {
      console.error(e);
      alert('Error seeding data.');
    } finally {
      setSeeding(false);
    }
  }

  function openAdd() {
    setEditId(null);
    setFormData(
      activeTab === 'hospitals' 
        ? { specializations: [], category: 'Private', status: 'Active', main_branch: false, is_24_7: false, has_bengali_doctor: false } 
        : activeTab === 'doctors'
          ? { hospital_ids: [], languages: ['Bengali'], specialization: 'Cardiology', otp_required: true }
          : { languages: ['Bengali'], department: 'Reception', otp_required: true }
    );
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    const data = { ...item };
    if (activeTab === 'hospitals') {
      if (!Array.isArray(data.specializations)) data.specializations = [];
      if (!data.category) data.category = 'Private';
      if (!data.status) data.status = 'Active';
    }
    if (activeTab === 'doctors') {
      if (!Array.isArray(data.hospital_ids)) {
        data.hospital_ids = data.hospital_id ? [data.hospital_id] : [];
      }
      if (!Array.isArray(data.languages)) data.languages = [];
      if (data.otp_required === undefined) data.otp_required = true;
    }
    if (activeTab === 'staff') {
      if (!Array.isArray(data.languages)) data.languages = [];
      if (data.otp_required === undefined) data.otp_required = true;
    }
    setFormData(data);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const collectionName = activeTab === 'hospitals' 
        ? COLLECTIONS.hospitals 
        : activeTab === 'doctors' 
          ? COLLECTIONS.bengali_doctors 
          : (COLLECTIONS.bengali_staff || 'bengali_staff');
      const now = new Date().toISOString();
      const payload = { ...formData };
      
      if (activeTab === 'hospitals') {
        if (!Array.isArray(payload.specializations)) {
          payload.specializations = [];
        }
      } else if (activeTab === 'doctors') {
        if (!Array.isArray(payload.hospital_ids)) {
          payload.hospital_ids = [];
        }
        if (!Array.isArray(payload.languages)) {
          payload.languages = [];
        }
        payload.hospital_id = payload.hospital_ids[0] || '';
      } else {
        if (!Array.isArray(payload.languages)) {
          payload.languages = [];
        }
      }

      if (editId) {
        if (activeTab === 'hospitals') {
          setHospitals(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as Hospital : i));
        } else if (activeTab === 'doctors') {
          setDoctors(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliDoctor : i));
        } else {
          setStaff(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliStaff : i));
        }
      } else {
        const id = `${activeTab === 'hospitals' ? 'hosp' : 'item'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        payload.id = id;
        payload.created_at = now;
        
        if (activeTab === 'hospitals') {
          setHospitals(prev => [{ ...payload } as Hospital, ...prev]);
        } else if (activeTab === 'doctors') {
          setDoctors(prev => [{ ...payload } as BengaliDoctor, ...prev]);
        } else {
          setStaff(prev => [{ ...payload } as BengaliStaff, ...prev]);
        }
      }
      
      setShowForm(false);
      setSaving(false);

      // BACKGROUND SYNC
      if (editId) {
        await updateDoc(doc(db, collectionName, editId), { ...payload, updated_at: now });
      } else {
        await setDoc(doc(db, collectionName, payload.id), { ...payload });
      }
    } catch (e) {
      console.error(e);
      alert('Error saving item to database.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const collectionName = activeTab === 'hospitals' 
        ? COLLECTIONS.hospitals 
        : activeTab === 'doctors' 
          ? COLLECTIONS.bengali_doctors 
          : (COLLECTIONS.bengali_staff || 'bengali_staff');
      await deleteDoc(doc(db, collectionName, id));
      if (activeTab === 'hospitals') {
        setHospitals(prev => prev.filter(i => i.id !== id));
      } else if (activeTab === 'doctors') {
        setDoctors(prev => prev.filter(i => i.id !== id));
      } else {
        setStaff(prev => prev.filter(i => i.id !== id));
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting item.');
    }
  }

  if (!canView) return (
    <div className="text-center py-20"><Shield className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2><p className="text-text-muted">You don't have permission to access this module.</p></div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Hospital Management</h1>
          <p className="text-text-muted text-sm mt-1">Manage Hospitals, Doctors, and Emergency Contacts</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4" /> Add New {activeTab === 'hospitals' ? 'Hospital' : activeTab === 'doctors' ? 'Doctor' : 'Staff'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'hospitals' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <Building2 className="w-4 h-4" /> Hospitals
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'doctors' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <UserRound className="w-4 h-4" /> Bengali Doctors
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'staff' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <Users className="w-4 h-4" /> Bengali Staff
        </button>
      </div>

      {(activeTab === 'doctors' || activeTab === 'staff') && hospitals.length > 0 && (
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
          <label className="text-sm font-bold text-text-primary whitespace-nowrap">Filter by Hospital:</label>
          <select 
            value={selectedHospitalFilter} 
            onChange={e => setSelectedHospitalFilter(e.target.value)} 
            className="w-full max-w-xs px-3 py-2 bg-surface border border-border rounded-lg text-sm cursor-pointer"
          >
            <option value="all">All Hospitals</option>
            {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-surface/50 border-b border-border">
                {activeTab === 'hospitals' ? (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">City</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Phone</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Emergency No</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Branch</th>
                  </>
                ) : activeTab === 'doctors' ? (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Doctor Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Specialization</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospitals</th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Staff Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Designation</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital</th>
                  </>
                )}
                {canEdit && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(activeTab === 'hospitals' 
                 ? hospitals 
                 : activeTab === 'doctors' 
                   ? doctors.filter(d => selectedHospitalFilter === 'all' || d.hospital_ids?.includes(selectedHospitalFilter) || d.hospital_id === selectedHospitalFilter) 
                   : staff.filter(s => selectedHospitalFilter === 'all' || s.hospital_id === selectedHospitalFilter)
              ).map((item: any) => (
                <tr key={item.id} className="hover:bg-surface transition-colors">
                  {activeTab === 'hospitals' ? (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">
                        <div>{item.name}</div>
                        <div className="flex gap-1.5 mt-1">
                          {item.category && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.category === 'Government' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                              {item.category}
                            </span>
                          )}
                          {item.status && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.city}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.phone}</td>
                      <td className="px-5 py-4 text-sm font-bold text-red-600">{item.emergency_phone || '-'}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.main_branch ? <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded">Main</span> : <span className="text-text-muted text-xs">Branch</span>}</td>
                    </>
                  ) : activeTab === 'doctors' ? (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.doctor_name}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.specialization}</td>
                      <td className="px-5 py-4 text-sm text-text-muted max-w-xs truncate">
                        {item.hospital_ids?.map((hid: string) => hospitals.find(h => h.id === hid)?.name).filter(Boolean).join(', ') || hospitals.find(h => h.id === item.hospital_id)?.name || 'Unknown'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.name}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.role}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.department}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        {hospitals.find(h => h.id === item.hospital_id)?.name || 'Unknown'}
                      </td>
                    </>
                  )}
                  {(canEdit || canManage) && (
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>}
                        {canManage && <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {activeTab === 'doctors' && doctors.filter(d => selectedHospitalFilter === 'all' || d.hospital_id === selectedHospitalFilter).map(item => {
                const hosp = hospitals.find(h => h.id === item.hospital_id);
                return (
                  <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-5 py-4 font-bold">{item.doctor_name}</td>
                    <td className="px-5 py-4">{item.specialization}</td>
                    <td className="px-5 py-4">{hosp ? `${hosp.name} (${hosp.city})` : '-'}</td>
                    {canEdit && (
                      <td className="text-right px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEdit(item)} className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {activeTab === 'staff' && staff.filter(s => selectedHospitalFilter === 'all' || s.hospital_id === selectedHospitalFilter).map(item => {
                const hosp = hospitals.find(h => h.id === item.hospital_id);
                return (
                  <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                    <td className="px-5 py-4 font-bold">{item.name}</td>
                    <td className="px-5 py-4">{item.role}</td>
                    <td className="px-5 py-4">{hosp ? `${hosp.name} (${hosp.city})` : '-'}</td>
                    {canEdit && (
                      <td className="text-right px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEdit(item)} className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {(activeTab === 'hospitals' ? hospitals : activeTab === 'doctors' ? doctors : staff).length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl border border-border w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text-primary">{editId ? 'Edit' : 'Add'} {activeTab === 'hospitals' ? 'Hospital' : activeTab === 'doctors' ? 'Doctor' : 'Staff'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              {activeTab === 'hospitals' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Hospital Name *</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">State *</label>
                      <input type="text" value={formData.state || 'Tamil Nadu'} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">District *</label>
                      <input type="text" value={formData.district || 'Chennai'} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Area</label>
                      <select value={formData.area || ''} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Area...</option>
                        {CHENNAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">City *</label>
                      <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Address</label>
                      <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Emergency Phone</label>
                      <input type="text" value={formData.emergency_phone || ''} onChange={e => setFormData({...formData, emergency_phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Email</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Website</label>
                      <input type="text" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Maps Link</label>
                      <input type="text" value={formData.google_maps_url || ''} onChange={e => setFormData({...formData, google_maps_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Image URL (Optional)</label>
                      <ImageUpload 
                        value={formData.image_url || ''} 
                        onChange={(url) => setFormData({...formData, image_url: url})}
                        folder="admin_uploads/emergency"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Hospital Category *</label>
                      <select value={formData.category || 'Private'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="Private">Private Hospital</option>
                        <option value="Government">Government Hospital</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Status *</label>
                      <select value={formData.status || 'Active'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="is_24_7" checked={!!formData.is_24_7} onChange={e => setFormData({...formData, is_24_7: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="is_24_7" className="text-sm font-semibold text-text-primary cursor-pointer">24/7 Service</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="has_bengali_doctor" checked={!!formData.has_bengali_doctor} onChange={e => setFormData({...formData, has_bengali_doctor: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="has_bengali_doctor" className="text-sm font-semibold text-text-primary cursor-pointer">Has Bengali Doctor</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="has_bengali_staff" checked={!!formData.has_bengali_staff} onChange={e => setFormData({...formData, has_bengali_staff: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="has_bengali_staff" className="text-sm font-semibold text-text-primary cursor-pointer">Has Bengali Staff</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="main_branch" checked={!!formData.main_branch} onChange={e => setFormData({...formData, main_branch: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="main_branch" className="text-sm font-semibold text-text-primary cursor-pointer">Main Branch</label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Specializations</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {PREDEFINED_SPECIALIZATIONS.map(spec => (
                          <label key={spec} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={(formData.specializations || []).includes(spec)}
                              onChange={(e) => {
                                const current = formData.specializations || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, specializations: [...current, spec] });
                                } else {
                                  setFormData({ ...formData, specializations: current.filter((s: string) => s !== spec) });
                                }
                              }}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm text-text-primary">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
                      <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" />
                    </div>
                  </div>
                </>
              ) : activeTab === 'doctors' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Doctor Name *</label>
                      <input type="text" value={formData.doctor_name || ''} onChange={e => setFormData({...formData, doctor_name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Specialization *</label>
                      <select value={formData.specialization || ''} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Specialization...</option>
                        {PREDEFINED_SPECIALIZATIONS.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Assign to Hospitals *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 max-h-48 overflow-y-auto p-3 bg-surface rounded-xl border border-border">
                        {hospitals.map(h => (
                          <label key={h.id} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={(formData.hospital_ids || []).includes(h.id)}
                              onChange={(e) => {
                                const current = formData.hospital_ids || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, hospital_ids: [...current, h.id] });
                                } else {
                                  setFormData({ ...formData, hospital_ids: current.filter((hid: string) => hid !== h.id) });
                                }
                              }}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm text-text-primary">{h.name} ({h.city})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Experience (e.g. 10 years)</label>
                      <input type="text" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Languages Spoken</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                        {LANGUAGES.map(lang => (
                          <label key={lang} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={(formData.languages || []).includes(lang)}
                              onChange={(e) => {
                                const current = formData.languages || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, languages: [...current, lang] });
                                } else {
                                  setFormData({ ...formData, languages: current.filter((l: string) => l !== lang) });
                                }
                              }}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm text-text-primary">{lang}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3 mt-2">
                      <input 
                        type="checkbox" 
                        id="otp_required" 
                        checked={formData.otp_required !== false} 
                        onChange={e => setFormData({...formData, otp_required: e.target.checked})} 
                        className="w-5 h-5 rounded border-border" 
                      />
                      <label htmlFor="otp_required" className="text-sm font-semibold text-text-primary cursor-pointer">
                        Require OTP verification to view doctor profile details
                      </label>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-surface/50 rounded-xl border border-border">
                      <h4 className="md:col-span-2 text-sm font-bold text-text-primary">Social Media Profiles</h4>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">LinkedIn URL</label>
                        <input type="url" value={formData.social_links?.linkedin || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, linkedin: e.target.value}})} className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Facebook URL</label>
                        <input type="url" value={formData.social_links?.facebook || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, facebook: e.target.value}})} className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Instagram URL</label>
                        <input type="url" value={formData.social_links?.instagram || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, instagram: e.target.value}})} className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">X (Twitter) URL</label>
                        <input type="url" value={formData.social_links?.x || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, x: e.target.value}})} className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Staff Name *</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Designation *</label>
                      <input type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Department *</label>
                      <select value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Department...</option>
                        {PREDEFINED_DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Assign to Hospital *</label>
                      <select value={formData.hospital_id || ''} onChange={e => setFormData({...formData, hospital_id: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Hospital...</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Languages Spoken</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                        {LANGUAGES.map(lang => (
                          <label key={lang} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={(formData.languages || []).includes(lang)}
                              onChange={(e) => {
                                const current = formData.languages || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, languages: [...current, lang] });
                                } else {
                                  setFormData({ ...formData, languages: current.filter((l: string) => l !== lang) });
                                }
                              }}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm text-text-primary">{lang}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3 mt-2">
                      <input 
                        type="checkbox" 
                        id="staff_otp_required" 
                        checked={formData.otp_required !== false} 
                        onChange={e => setFormData({...formData, otp_required: e.target.checked})} 
                        className="w-5 h-5 rounded border-border" 
                      />
                      <label htmlFor="staff_otp_required" className="text-sm font-semibold text-text-primary cursor-pointer">
                        Require OTP verification to view staff profile details
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
                      <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface/30">
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminEmergencyPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-border">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading emergency panel...</p>
      </div>
    }>
      <AdminEmergencyPageContent />
    </Suspense>
  );
}
