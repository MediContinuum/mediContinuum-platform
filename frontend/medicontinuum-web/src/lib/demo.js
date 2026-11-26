// Synthetic Kalyani/Nadia records for a classroom walkthrough only. Not real clinical or provider data.
export const DEMO_REGION = {
  label: 'Kalyani Demo Network', city: 'Kalyani', district: 'Nadia',
  state: 'West Bengal', country: 'India',
  disclaimer: 'Synthetic sample data for presentation only. These are not real patients, providers, appointments, or medical recommendations.',
};
export const DEMO_PATIENTS = [
  { id: 'demo-p-001', name: 'Aarav Sharma', age: 36, city: 'Kalyani', area: 'Block B', globalId: '7391058264130952', adherence: 92, profile: 'Sample chronic-care profile' },
  { id: 'demo-p-002', name: 'Ananya Das', age: 62, city: 'Kalyani', area: 'Block A', globalId: '4821097365102847', adherence: 84, profile: 'Sample medication-support profile' },
  { id: 'demo-p-003', name: 'Ritwik Ghosh', age: 48, city: 'Kalyani', area: 'Central Park', globalId: '6120483795021348', adherence: 96, profile: 'Sample follow-up profile' },
  { id: 'demo-p-004', name: 'Sohini Roy', age: 29, city: 'Gayeshpur', area: 'Ward 5', globalId: '3092817465021983', adherence: 88, profile: 'Sample recovery-support profile' },
];
export const DEMO_PHARMACIES = [
  { id: 'demo-ph-001', name: 'Kalyani Care Pharmacy', area: 'Central Park Road', city: 'Kalyani', pin: '741235', status: 'Sample listing' },
  { id: 'demo-ph-002', name: 'Nadia Health Mart', area: 'Block A Market', city: 'Kalyani', pin: '741235', status: 'Sample listing' },
  { id: 'demo-ph-003', name: 'Gayeshpur Medico', area: 'Ward 5 Main Road', city: 'Gayeshpur', pin: '741245', status: 'Sample listing' },
  { id: 'demo-ph-004', name: 'Station Road Chemist', area: 'Near Kalyani Station', city: 'Kalyani', pin: '741235', status: 'Sample listing' },
];
export const DEMO_DOCTORS = [
  { id: 'demo-doc-001', name: 'Dr. Arindam Ghosh', speciality: 'General Medicine', city: 'Kalyani', experience: 12, fee: 500 },
  { id: 'demo-doc-002', name: 'Dr. Soumya Banerjee', speciality: 'Diabetology', city: 'Kalyani', experience: 9, fee: 650 },
  { id: 'demo-doc-003', name: 'Dr. Mitali Das', speciality: 'Paediatrics', city: 'Gayeshpur', experience: 8, fee: 450 },
];
export const DEMO_APPOINTMENTS = [
  { id: 'demo-ap-001', patient: 'Aarav Sharma', doctor: 'Dr. Arindam Ghosh', date: '2026-11-27', time: '10:30', status: 'CONFIRMED' },
  { id: 'demo-ap-002', patient: 'Ananya Das', doctor: 'Dr. Soumya Banerjee', date: '2026-11-28', time: '12:00', status: 'PENDING' },
  { id: 'demo-ap-003', patient: 'Ritwik Ghosh', doctor: 'Dr. Mitali Das', date: '2026-11-29', time: '17:00', status: 'CONFIRMED' },
];
