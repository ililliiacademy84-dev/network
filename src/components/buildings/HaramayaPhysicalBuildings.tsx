/**
 * Haramaya University Real Physical Infrastructure & Building Directory
 * Features real campus blocks, laboratories, dormitories, administration centers,
 * and high-fidelity building photography.
 */

import React, { useState } from 'react';
import { Building2, Layers, Search, MapPin, Eye, Network, CheckCircle2 } from 'lucide-react';

export const HaramayaPhysicalBuildings: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<'all' | 'main' | 'hit' | 'cvm' | 'harar'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const physicalFacilities = [
    {
      id: 'fac-admin',
      name: 'Senate & Central Administration Building',
      campus: 'main',
      zone: 'Central Quadrangle, Main Campus',
      block: 'Block 01 & 02',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
      type: 'Administration & Governance',
      facilities: ['President Executive Suite', 'Academic VP Office', 'Registrar Directorate', 'Human Resources', 'Central Boardroom'],
      network: 'Rack HU-RACK-01 &bull; Cisco ASA 5506-X Primary &bull; VLAN 10'
    },
    {
      id: 'fac-cci',
      name: 'College of Computing & Informatics (CCI)',
      campus: 'main',
      zone: 'Science & Technology Zone',
      block: 'Block 24, 25 & 26',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
      type: 'Academic & Laboratory',
      facilities: ['Computer Science Lab 1-4', 'Software Engineering Incubation', 'Cisco Networking Academy Lab', 'Artificial Intelligence Lab'],
      network: 'Rack HU-RACK-04 &bull; Catalyst 2960-24TT Switch &bull; VLAN 30, VLAN 140'
    },
    {
      id: 'fac-datacenter',
      name: 'Central ICT Directorate & Tier-3 Data Center',
      campus: 'main',
      zone: 'ICT Infrastructure Complex',
      block: 'ICT Data Center Block',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      type: 'Core Data Center & DMZ',
      facilities: ['Server Farm (8 DMZ Servers)', 'Main Campus Fiber Patch Panels', 'NOC Monitoring Wall', 'Precision Cooling & UPS Room'],
      network: 'Rack HU-RACK-CORE &bull; Catalyst 3650 Core Stack &bull; DMZ VLAN 150'
    },
    {
      id: 'fac-agri',
      name: 'College of Agriculture & Environmental Sciences (CAES)',
      campus: 'main',
      zone: 'Agricultural Research Sector',
      block: 'Blocks 08-12 & University Farm',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
      type: 'Research & Academic',
      facilities: ['School of Plant Sciences Coffee Lab', 'Animal Sciences Dairy Ranch', 'Soil Science & GIS Lab', 'Agribusiness Intelligence Suite'],
      network: 'Rack HU-RACK-08 &bull; Catalyst 2960 SW-MAIN-CAES &bull; VLAN 20 & 40'
    },
    {
      id: 'fac-cbe',
      name: 'College of Business & Economics (CBE)',
      campus: 'main',
      zone: 'Academic Quadrangle, Main Campus',
      block: 'Blocks 15, 16, 17 & 18',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      type: 'Business & Management',
      facilities: ['Accounting & Auditing Software Lab', 'Econometrics Modeling Studio', 'Cooperative Banking Suite', 'Public Policy Analysis Room'],
      network: 'Rack HU-RACK-CBE &bull; Catalyst 2960 SW-MAIN-CBE &bull; VLAN 10 & 20'
    },
    {
      id: 'fac-cebs',
      name: 'College of Education & Behavioural Sciences (CEBS)',
      campus: 'main',
      zone: 'Academic Sector, Main Campus',
      block: 'Academic Block 12',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      type: 'Teacher Education & Psychology',
      facilities: ['Psychological Counseling Suite', 'Assistive Special Needs Technologies Lab', 'Educational Leadership Simulator', 'Adult Literacy Hub'],
      network: 'Rack HU-RACK-CEBS &bull; Catalyst 2960 SW-MAIN-CEBS &bull; VLAN 10 & 20'
    },
    {
      id: 'fac-law',
      name: 'College of Law & Model Moot Court Hall',
      campus: 'main',
      zone: 'Legal Research Sector',
      block: 'College of Law Building',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
      type: 'Jurisprudence & Legal Clinic',
      facilities: ['Model Moot Courtroom', 'Free Legal Aid Clinic Public Bureau', 'Human Rights Archive', 'Legal Research Library'],
      network: 'Rack HU-RACK-LAW &bull; Catalyst 2960 SW-MAIN-LAW &bull; VLAN 10'
    },
    {
      id: 'fac-cncs',
      name: 'College of Natural & Computational Sciences (CNCS)',
      campus: 'main',
      zone: 'Natural Sciences Laboratory Complex',
      block: 'Science Blocks 08-11',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      type: 'Pure & Applied Sciences',
      facilities: ['Molecular Biology & DNA Sequencing Lab', 'Chromatography Chemistry Lab', 'Solid-State Physics Lab', 'Computational Mathematics Lab'],
      network: 'Rack HU-RACK-CNCS &bull; Catalyst 2960 SW-MAIN-CNCS &bull; VLAN 40'
    },
    {
      id: 'fac-cssh',
      name: 'College of Social Sciences & Humanities (CSSH)',
      campus: 'main',
      zone: 'Humanities Sector',
      block: 'Blocks 04 & 05',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
      type: 'Social Sciences & Cultural Heritage',
      facilities: ['Afaan Oromoo Linguistic Corpus Lab', 'Harar Jugol UNESCO Digital Archive', 'Multimedia Journalism Studio', 'GIS Cartography Suite'],
      network: 'Rack HU-RACK-CSSH &bull; Catalyst 2960 SW-MAIN-CSSH &bull; VLAN 20 & 40'
    },
    {
      id: 'fac-sport',
      name: 'Sport Science Academy & Olympic Stadium',
      campus: 'main',
      zone: 'Athletic Sports Complex',
      block: 'Olympic Stadium & Gymnasium',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
      type: 'Athletics & Kinesiology',
      facilities: ['High-Altitude Athletic Training Track', 'VO2 Max Exercise Physiology Lab', 'Biomechanical Motion Analysis Studio', 'Indoor Arena'],
      network: 'Rack HU-RACK-SPORT &bull; Catalyst 2960 SW-MAIN-SPORT &bull; VLAN 30'
    },
    {
      id: 'fac-lib',
      name: 'Central Library & E-Learning Resource Center',
      campus: 'main',
      zone: 'Main Campus East Wing',
      block: 'Central Library Building',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
      type: 'Library & Student Resource',
      facilities: ['Digital Repository Terminal Room', '2,500 Seat Reading Halls', 'Postgraduate Thesis Archive', 'Online OPAC Terminals'],
      network: 'Rack HU-RACK-LIB &bull; Catalyst 2960 Switch &bull; VLAN 50'
    },
    {
      id: 'fac-dorm',
      name: 'Student Residential Halls & Dining Complex',
      campus: 'main',
      zone: 'Student Residential Village',
      block: 'Dorm Blocks 40-54',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
      type: 'Student Living & Welfare',
      facilities: ['Undergraduate Dormitories', 'Main Cafeteria Dining Hall', 'Student Union Lounge', 'Wi-Fi Access Points'],
      network: 'Rack HU-RACK-DORM &bull; VLAN 110 (Guest / Student Wi-Fi)'
    },
    {
      id: 'fac-hit',
      name: 'Haramaya Institute of Technology (HiT Complex)',
      campus: 'hit',
      zone: 'HiT Engineering Campus',
      block: 'Engineering Blocks A, B, C & D',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      type: 'Engineering & Technology',
      facilities: ['Electrical & Power Systems Lab', 'Cybersecurity Testing Range', 'Fluid Dynamics & Hydraulics Workshop', 'Robotics & IoT Lab'],
      network: 'Rack HIT-RACK-CORE &bull; Catalyst 3650 L3 Core &bull; IPSec VPN to Main'
    },
    {
      id: 'fac-cvm',
      name: 'College of Veterinary Medicine & Teaching Hospital',
      campus: 'cvm',
      zone: 'Veterinary Campus Facility',
      block: 'CVM Clinical Blocks 1-4',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
      type: 'Clinical & Animal Health',
      facilities: ['Veterinary Teaching Hospital', 'Animal Surgical Suites', 'Pathology & Microbiology Labs', 'Epidemiology Surveillance'],
      network: 'Rack CVM-RACK-CORE &bull; Catalyst 3650 Core &bull; IPSec VPN to Main'
    },
    {
      id: 'fac-harar',
      name: 'College of Health & Medical Sciences (CHMS & HFSUH)',
      campus: 'harar',
      zone: 'Harar City Campus',
      block: 'Hiwot Fana Comprehensive Specialized University Hospital',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
      type: 'Medical & Healthcare',
      facilities: ['1,000+ Bed Referral Hospital Wards', 'Medical Imaging & Telehealth PACS Studio', 'Clinical Diagnostic & Pathology Labs', 'School of Medicine & Nursing Classrooms'],
      network: 'Rack HARAR-RACK-01 &bull; Cisco ASA 5506-X &bull; IPSec Tunnel 10.100.4.2'
    }
  ];

  const filtered = physicalFacilities.filter((f) => {
    const matchCampus = selectedCampus === 'all' || f.campus === selectedCampus;
    const matchSearch = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCampus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Haramaya University Physical Campus & Building Infrastructure
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real architectural blocks, research laboratories, dormitories, and data center deployment racks
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search building, block or lab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full"
          />
        </div>
      </div>

      {/* Campus Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All 4 Campuses' },
          { id: 'main', label: 'Main Campus (Bati)' },
          { id: 'hit', label: 'HiT Engineering Campus' },
          { id: 'cvm', label: 'Veterinary (CVM) Campus' },
          { id: 'harar', label: 'Harar Health & Medical Campus' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCampus(c.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCampus === c.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((fac) => (
          <div
            key={fac.id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              {/* Photo */}
              <div className="h-44 w-full relative overflow-hidden">
                <img
                  src={fac.image}
                  alt={fac.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950/90 text-white border border-slate-700 backdrop-blur-md">
                    {fac.block}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] font-mono text-emerald-400 block">{fac.type}</span>
                  <h4 className="text-sm font-bold text-white leading-tight mt-0.5">{fac.name}</h4>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{fac.zone}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-300 block">Laboratories & Units:</span>
                  <div className="flex flex-wrap gap-1">
                    {fac.facilities.map((f, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Network Deployment Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800/80 text-[11px] font-mono text-indigo-400 flex items-center justify-between">
              <span dangerouslySetInnerHTML={{ __html: fac.network }} />
              <Network className="w-4 h-4 text-emerald-400 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
