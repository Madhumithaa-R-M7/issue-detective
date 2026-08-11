'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, Clock, CheckCircle2, Stethoscope, Ambulance, LifeBuoy, Building2, UserRound, ArrowRight, ShieldAlert, Lock, Users, ShieldCheck, Mail, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import { sampleHospitals, sampleDoctors, sampleStaff } from '@/data/sample-data';
import { CITIES } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
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

const SAMPLE_DOCTORS: BengaliDoctor[] = [];

const SAMPLE_STAFF: BengaliStaff[] = [];

function ListingCoverImage({ name, city, mapsUrl, imageUrl, fallbackIcon }: { 
  name: string; 
  city?: string; 
  mapsUrl?: string; 
  imageUrl?: string;
  fallbackIcon: React.ReactNode;
}) {
  const getFallbackImg = (hName: string) => {
    const lower = hName.toLowerCase();
    if (lower.includes('apollo')) return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('mgm')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('miot')) return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('fortis')) return 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('kauvery')) return 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('rela')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('ramachandra')) return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('cmc')) return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('cancer') || lower.includes('adyar')) return 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
  };

  const primarySrc = imageUrl || (mapsUrl ? `/api/public/place-photo?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city || '')}&mapsUrl=${encodeURIComponent(mapsUrl)}&v=3` : getFallbackImg(name));
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [failedOnce, setFailedOnce] = useState(false);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    setCurrentSrc(imageUrl || getFallbackImg(name));
    setError(false);
    setFailedOnce(false);
  }, [imageUrl, name]);

  const handleImgError = () => {
    if (!failedOnce) {
      setFailedOnce(true);
      setCurrentSrc(getFallbackImg(name));
    } else {
      setError(true);
    }
  };

  if (error || !currentSrc) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-red-500 opacity-40 scale-[2.5]">
          {fallbackIcon}
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={name}
      onError={handleImgError}
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
    />
  );
}

export default function EmergencyHospitalsPage() {
  const { firebaseUser: user } = useAuth();
  const router = useRouter();
  const [searchTab, setSearchTab] = useState<'hospitals' | 'doctors' | 'staff'>('hospitals');
  
  // State lists
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [staff, setStaff] = useState<BengaliStaff[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // OTP Gating
  const isVerified = !!user;

  useEffect(() => {
    

    const fetchData = async () => {
      try {
        let hData: Hospital[] = [];
        let dData: BengaliDoctor[] = [];
        let sData: BengaliStaff[] = [];

        try {
          const [hRes, dRes, sRes] = await Promise.all([
            fetch(`/api/public/firestore?collection=hospitals`),
            fetch(`/api/public/firestore?collection=bengali_doctors`),
            fetch(`/api/public/firestore?collection=bengali_staff`)
          ]);

          if (hRes.ok) {
            const hJson = await hRes.json();
            if (!hJson.fallback && Array.isArray(hJson.items) && hJson.items.length > 0) {
              hData = hJson.items;
            }
          }
          if (dRes.ok) {
            const dJson = await dRes.json();
            if (!dJson.fallback && Array.isArray(dJson.items) && dJson.items.length > 0) {
              dData = dJson.items;
            }
          }
          if (sRes.ok) {
            const sJson = await sRes.json();
            if (!sJson.fallback && Array.isArray(sJson.items) && sJson.items.length > 0) {
              sData = sJson.items;
            }
          }
        } catch (apiErr) {
          console.warn("Public API fetch failed, falling back to client-side Firestore:", apiErr);
        }

        // Fallback to client-side Firestore if API returned fallback or empty array
        if (hData.length === 0) {
          const hSnap = await getDocs(collection(db, COLLECTIONS.hospitals));
          hData = hSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital));
        }
        if (dData.length === 0) {
          const dSnap = await getDocs(collection(db, COLLECTIONS.bengali_doctors));
          dData = dSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliDoctor));
        }
        if (sData.length === 0) {
          const sSnap = await getDocs(collection(db, COLLECTIONS.bengali_staff || 'bengali_staff'));
          sData = sSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliStaff));
        }

        setHospitals(hData.length > 0 ? hData : sampleHospitals);
        setDoctors(dData.length > 0 ? dData : sampleDoctors);
        setStaff(sData.length > 0 ? sData : sampleStaff);
      } catch (err) {
        console.error("Error fetching database documents", err);
        setHospitals(sampleHospitals);
        setDoctors(sampleDoctors);
        setStaff(sampleStaff);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const triggerVerification = (doctorId?: string) => {
    router.push('/auth/login?redirect=/emergency/hospitals');
  };

  // ── FILTER LOGIC ──
  
  // Hospital Filter
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchesSearch = !searchQuery || h.name.toLowerCase().includes(searchQuery.toLowerCase()) || (h.area && h.area.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSpec = !specializationFilter || (h.specializations && h.specializations.includes(specializationFilter));
      const matchesCategory = !categoryFilter || h.category === categoryFilter;
      const matchesCity = !cityFilter || h.city === cityFilter;
      const isActive = !h.status || h.status === 'Active';
      return matchesSearch && matchesSpec && matchesCategory && matchesCity && isActive;
    });
  }, [hospitals, searchQuery, specializationFilter, categoryFilter, cityFilter]);

  // Doctor Filter (Display only one doctor for each hospital)
  const filteredDoctors = useMemo(() => {
    const list = doctors.filter((d) => {
      const matchesSearch = !searchQuery || d.doctor_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpec = !specializationFilter || d.specialization === specializationFilter;
      return matchesSearch && matchesSpec;
    });

    const seenHospitals = new Set<string>();
    const uniqueList: BengaliDoctor[] = [];
    
    for (const d of list) {
      const hospIds = d.hospital_ids || (d.hospital_id ? [d.hospital_id] : []);
      let shouldShow = false;
      
      if (hospIds.length === 0) {
        shouldShow = true; // Show doctors with no assigned hospitals
      } else {
        for (const hid of hospIds) {
          if (!seenHospitals.has(hid)) {
            shouldShow = true;
            seenHospitals.add(hid);
          }
        }
      }
      
      if (shouldShow) {
        uniqueList.push(d);
      }
    }
    return uniqueList;
  }, [doctors, searchQuery, specializationFilter]);

  // Staff Filter
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.role && s.role.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDept = !departmentFilter || s.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [staff, searchQuery, departmentFilter]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50/70 to-orange-50/50 border-b border-red-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 text-sm text-red-600/70 mb-4 font-medium">
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link><span>/</span>
            <Link href="/emergency" className="hover:text-red-600 transition-colors">Emergency</Link><span>/</span>
            <span className="text-red-700 font-semibold">Hospital Services</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8 justify-between lg:items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-text-primary flex items-center gap-3">
                <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
                Hospital & Medical Center
              </h1>
              <p className="mt-4 text-text-muted text-lg leading-relaxed">
                Connect with leading government and private medical centers, verified Bengali-speaking doctors, and support staff across Tamil Nadu.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="tel:108">
                  <Button variant="danger" size="lg" className="shadow-lg shadow-red-500/20 font-semibold h-12 px-6">
                    <Phone className="w-5 h-5 mr-2" /> Quick Call (108)
                  </Button>
                </a>
                <Link href="/emergency/ambulance">
                  <Button variant="outline" size="lg" className="border-red-200 text-red-600 hover:bg-red-50/50 h-12 px-6">
                    <Ambulance className="w-5 h-5 mr-2" /> Ambulance services
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:w-[480px]">
              {/* Govt. Facilities Card */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                      <Building2 className="w-3 h-3 text-blue-600" /> Public Health
                    </span>
                    <Building2 className="w-4 h-4 text-blue-600 opacity-80" />
                  </div>
                  
                  <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>Govt. Facilities</span>
                  </h3>
                  
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                    Direct access to state medical colleges, general hospitals & public health centers.
                  </p>
                </div>

                <div>
                  <div className="mt-3 pt-2.5 border-t border-blue-100/60 space-y-1 text-[11px] text-blue-800 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" /> State Medical Colleges
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" /> Free / Low Cost Care
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" /> 24/7 Emergency Services
                    </div>
                  </div>

                  <button 
                    onClick={() => { setSearchTab('hospitals'); setCategoryFilter('Government'); }} 
                    className="mt-3 pt-2 border-t border-blue-100/40 w-full text-blue-700 hover:text-blue-800 text-xs font-bold flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <span>View Govt. Hospitals</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              {/* Informational Verified Doctors Card (Non-clickable) */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex-1 flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                    <Stethoscope className="w-4 h-4 text-emerald-600 opacity-80" />
                  </div>
                  
                  <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                    <UserRound className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Verified Doctors</span>
                  </h3>
                  
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                    Trusted Bengali-speaking doctors from verified hospital records.
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-emerald-100/60 space-y-2 text-xs text-emerald-900 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Verified Doctor Profiles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Hospital Affiliations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Specializations & Experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => { setSearchTab('hospitals'); setSearchQuery(''); setSpecializationFilter(''); }}
              className={`py-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${searchTab === 'hospitals' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
            >
              <Building2 className="w-4.5 h-4.5" /> 1. Hospital Search
            </button>
            
            <button
              onClick={() => { setSearchTab('doctors'); setSearchQuery(''); setSpecializationFilter(''); }}
              className={`py-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${searchTab === 'doctors' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
            >
              <Stethoscope className="w-4.5 h-4.5" /> 2. Doctor Search
            </button>
            
            <button
              onClick={() => { setSearchTab('staff'); setSearchQuery(''); }}
              className={`py-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${searchTab === 'staff' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
            >
              <Users className="w-4.5 h-4.5" /> 3. Staff Search
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Header */}
      <div className="bg-white border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Query Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchTab === 'hospitals' ? "Search hospitals by name, area..." :
                  searchTab === 'doctors' ? "Search doctors by name..." :
                  "Search staff by name or role..."
                }
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface/30 font-medium"
              />
            </div>

            {/* Specialization Filter (Hospitals/Doctors) */}
            {searchTab !== 'staff' && (
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium bg-white cursor-pointer min-w-[180px]"
              >
                <option value="">All Specializations</option>
                {PREDEFINED_SPECIALIZATIONS.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            )}

            {/* Department Filter (Staff only) */}
            {searchTab === 'staff' && (
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium bg-white cursor-pointer min-w-[180px]"
              >
                <option value="">All Departments</option>
                {PREDEFINED_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            )}

            {/* Category Filter (Hospitals only) */}
            {searchTab === 'hospitals' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium bg-white cursor-pointer min-w-[160px]"
              >
                <option value="">All Categories</option>
                <option value="Government">Government Hospitals</option>
                <option value="Private">Private Hospitals</option>
              </select>
            )}

            {/* City Filter (Hospitals only) */}
            {searchTab === 'hospitals' && (
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium bg-white cursor-pointer min-w-[150px]"
              >
                <option value="">All Cities</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted font-medium">Loading records...</p>
          </div>
        ) : (
          <>
            {/* ── HOSPITALS SEARCH RESULTS ── */}
            {searchTab === 'hospitals' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHospitals.map((hospital) => (
                    <Card key={hospital.id} padding="none" className="overflow-hidden group flex flex-col h-full bg-white border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] rounded-[24px]">
                      {/* Image header with text overlay */}
                      <div className="relative h-64 bg-slate-100 overflow-hidden">
                        <ListingCoverImage 
                          name={hospital.name} 
                          city={hospital.city} 
                          mapsUrl={hospital.google_maps_url} 
                          imageUrl={hospital.image_url}
                          fallbackIcon={<Building2 className="w-12 h-12" />}
                        />
                        
                        {/* Gradient Shadow Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 z-10 pointer-events-none">
                          <h3 className="text-xl font-bold text-white leading-tight font-display">{hospital.name}</h3>
                          <div className="flex items-center gap-1.5 mt-2 text-sm text-white/90">
                            <MapPin className="w-4 h-4 text-white shrink-0" />
                            <span>{hospital.area ? `${hospital.area}, ` : ''}{hospital.city}</span>
                          </div>
                        </div>

                        {/* Top-left Badges */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-20">
                          {hospital.category && (
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider text-white shadow-sm ${hospital.category === 'Government' ? 'bg-blue-600' : 'bg-orange-600'}`}>
                              {hospital.category}
                            </span>
                          )}
                          {hospital.is_24_7 && (
                            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" /> 24/7
                            </span>
                          )}
                          {hospital.has_bengali_doctor && (
                            <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                              🩺 Bengali Doctor
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        {/* Specializations Tags */}
                        <div>
                          {hospital.specializations && hospital.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {hospital.specializations.slice(0, 4).map((s) => (
                                <span key={s} className="px-3 py-1.5 bg-[#FFF1F0] border border-[#FFA39E] rounded-lg text-xs font-semibold text-[#B81D18]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Side-by-Side Action Buttons */}
                        <div className="flex items-center gap-3 w-full">
                          <a href={`tel:${hospital.emergency_phone || hospital.phone || '108'}`} className="flex-1">
                            <button className="w-full bg-[#B81D18] hover:bg-[#9E1612] text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                              <Phone className="w-4 h-4" />
                              <span>Emergency</span>
                            </button>
                          </a>
                          
                          <Link href={`/emergency/hospitals/${hospital.id}`} className="flex-1">
                            <button className="w-full bg-white hover:bg-slate-50 border border-[#E4E9F2] text-gray-800 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center shadow-sm transition-all active:scale-[0.98]">
                              <span>Details</span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                {filteredHospitals.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-xs">
                    <p className="text-5xl mb-4">🏥</p>
                    <h3 className="text-xl font-bold mb-2">No hospitals found</h3>
                    <p className="text-text-muted">Try removing filters or altering your search.</p>
                  </div>
                )}
              </>
            )}

            {/* ── DOCTORS SEARCH RESULTS ── */}
            {searchTab === 'doctors' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => {
                    const docHospitals = doctor.hospital_ids?.map(hid => hospitals.find(h => h.id === hid)).filter(Boolean) || [hospitals.find(h => h.id === doctor.hospital_id)].filter(Boolean);
                    const otpRequired = doctor.otp_required !== false;
                    const canViewProfile = isVerified;

                    return (
                      <Card key={doctor.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-white border border-border flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-surface border-2 border-white shadow-md overflow-hidden shrink-0 relative">
                              {canViewProfile && doctor.photo ? (
                                <img src={doctor.photo} alt={doctor.doctor_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                  <Stethoscope className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <h3 className="text-lg font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                                {doctor.doctor_name}
                              </h3>
                              <p className="text-primary font-semibold text-sm mt-1">{doctor.specialization}</p>
                              
                              {canViewProfile && doctor.experience ? (
                                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted font-semibold">
                                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                  <span>{doctor.experience} Experience</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 max-w-fit">
                                  <Lock className="w-3.5 h-3.5" /> OTP Verification Required
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 space-y-3">
                            {/* Associated Hospitals List */}
                            <div className="p-3 bg-surface/50 rounded-xl border border-border/50">
                              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-primary" /> Affiliated Hospitals
                              </p>
                              <div className="space-y-1.5">
                                {docHospitals.length > 0 ? (
                                  docHospitals.map((h: any) => (
                                    <div key={h.id} className="text-xs font-bold text-text-primary">
                                      {h.name} <span className="text-[10px] text-text-muted">({h.city})</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-text-muted italic">No associated hospitals configured</span>
                                )}
                              </div>
                            </div>

                            {/* Masked details in case not verified */}
                            {canViewProfile ? (
                              <div className="space-y-2 text-sm text-text-primary bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                                {doctor.qualifications && doctor.qualifications.length > 0 && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-xs text-emerald-800 w-24">Qualification:</span>
                                    <span className="text-xs font-medium">{doctor.qualifications.join(', ')}</span>
                                  </div>
                                )}
                                {doctor.consultation_timings && (
                                  <div className="flex items-start gap-2">
                                    <span className="font-bold text-xs text-emerald-800 w-24">Timings:</span>
                                    <span className="text-xs font-medium">{doctor.consultation_timings}</span>
                                  </div>
                                )}
                                {doctor.phone && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-emerald-800 w-24">Phone:</span>
                                    <a href={`tel:${doctor.phone}`} className="text-xs font-bold text-primary hover:underline">{doctor.phone}</a>
                                  </div>
                                )}
                                {doctor.email && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-emerald-800 w-24">Email:</span>
                                    <a href={`mailto:${doctor.email}`} className="text-xs font-medium text-text-primary hover:underline">{doctor.email}</a>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="relative overflow-hidden bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                                <p className="text-xs font-semibold text-text-muted leading-relaxed">
                                  Full doctor credentials, phone number, email address and consultations details are hidden for privacy.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                          {canViewProfile ? (
                            <Link href={`/emergency/hospitals/bengali-doctors/${doctor.id}`}>
                              <Button variant="primary" size="sm" className="w-full font-bold">
                                View Profile Details
                              </Button>
                            </Link>
                          ) : (
                            <Button onClick={() => triggerVerification(doctor.id)} variant="danger" size="sm" className="w-full font-bold shadow-md shadow-red-500/10">
                              <Lock className="w-4 h-4 mr-2" /> Verify OTP to View Profile
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {filteredDoctors.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-xs">
                    <p className="text-5xl mb-4">👨‍⚕️</p>
                    <h3 className="text-xl font-bold mb-2">No doctors found</h3>
                    <p className="text-text-muted">Try adapting your search parameter or specialization.</p>
                  </div>
                )}
              </>
            )}

            {/* ── STAFF SEARCH RESULTS ── */}
            {searchTab === 'staff' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStaff.map((s) => {
                    const hospital = hospitals.find((h) => h.id === s.hospital_id);
                    const otpRequired = s.otp_required !== false;
                    const canViewProfile = isVerified;

                    return (
                      <Card key={s.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden bg-white border border-border p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-surface border border-border overflow-hidden shrink-0 relative flex items-center justify-center text-primary/30">
                              {canViewProfile && s.photo ? (
                                <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                              ) : (
                                <Users className="w-8 h-8" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
                                {s.name}
                              </h3>
                              <p className="text-primary font-semibold text-xs mt-1">{s.role}</p>
                              <Badge className="bg-surface border border-border/50 text-text-muted font-bold text-[10px] mt-1.5">
                                {s.department}
                              </Badge>
                              {!canViewProfile && (
                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 max-w-fit">
                                  <Lock className="w-3 h-3" /> OTP Required
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
                            {hospital && (
                              <div className="flex items-start gap-2 text-xs text-text-primary font-semibold">
                                <Building2 className="w-4 h-4 text-text-muted mt-0.5" />
                                <span>{hospital.name} ({hospital.city})</span>
                              </div>
                            )}
                            {s.languages && s.languages.length > 0 && (
                              <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                                <Clock className="w-4 h-4 text-text-muted" />
                                <span>Languages: {s.languages.join(', ')}</span>
                              </div>
                            )}
                            {canViewProfile && s.experience && (
                              <div className="text-xs text-text-muted font-medium pl-6">
                                Experience: {s.experience}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-border">
                          {canViewProfile ? (
                            <Link href={`/emergency/hospitals/bengali-staff/${s.id}`}>
                              <Button variant="primary" size="sm" className="w-full font-bold">
                                View Profile Details
                              </Button>
                            </Link>
                          ) : (
                            <Button onClick={() => triggerVerification(s.id)} variant="danger" size="sm" className="w-full font-bold shadow-md shadow-red-500/10">
                              <Lock className="w-4 h-4 mr-2" /> Verify OTP to View Staff Details
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
                {filteredStaff.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-border shadow-xs">
                    <p className="text-5xl mb-4">👥</p>
                    <h3 className="text-xl font-bold mb-2">No staff found</h3>
                    <p className="text-text-muted">Try selecting a different department filter.</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
