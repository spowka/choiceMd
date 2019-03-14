export const ProviderType = {
  organization: 1,
  facility: 2,
  physician: 3,
  dentist: 4,
  specialSchool: 5
};

export const ProviderTypeName = {
  1: { singular: 'Support Organization', plural: 'Support Organizations' },
  2: { singular: 'Facility', plural: 'Facilities' },
  3: { singular: 'Physician', plural: 'Physicians' },
  4: { singular: 'Dentist', plural: 'Dentists' },
  5: { singular: 'Special School', plural: 'Special Schools' }
};

export const FacilityType = [
  { id: 1, name: 'Assisted Living' },
  { id: 2, name: 'Cancer Center' },
  { id: 3, name: 'Home Health Care Service' },
  { id: 4, name: 'Hospice Care' },
  { id: 5, name: 'Hospital' },
  { id: 6, name: 'Independent Living' },
  { id: 7, name: 'Memory Care' },
  { id: 8, name: 'Nursing' },
  { id: 9, name: 'Nursing Home' },
  { id: 10, name: 'Physical Therapy' }
];

export const OrganizationType = [
  { id: 1, name: 'Adoption and Foster Care Services' },
  { id: 2, name: "Alzheimer's Disease and Dimentia" },
  { id: 3, name: 'Autism' },
  { id: 4, name: 'Behavioral Health' },
  { id: 5, name: 'Bereavement' },
  { id: 6, name: 'Cancer' },
  { id: 7, name: 'Cardiovascular Health' },
  { id: 8, name: 'Cerebral Palsy' },
  { id: 9, name: 'Child Abuse & Neglect' },
  { id: 10, name: 'Child Care Education' },
  { id: 11, name: 'Crisis Counseling and Wellness Services' },
  { id: 12, name: 'Diabetes' },
  { id: 13, name: 'Disaster Relief' },
  { id: 14, name: 'Elderly Services' },
  { id: 15, name: 'End-of-Life Care' },
  { id: 16, name: 'Gang Prevention and Intervention' },
  { id: 17, name: 'Health Care Relief' },
  { id: 18, name: 'HIV / AIDS' },
  { id: 19, name: 'Hunger Relief' },
  { id: 20, name: 'Infant Care' },
  { id: 21, name: 'Intellectual and Developmental Disabilities (IDD)' },
  { id: 22, name: 'Medical Air Transportation' },
  { id: 23, name: 'Mental Health' },
  { id: 24, name: 'Mentorship' },
  { id: 25, name: 'Multiple Sclerosis' },
  { id: 26, name: 'Organ Donor & Recovery' },
  { id: 27, name: 'Parkinson' },
  { id: 28, name: 'Pediatric Health Relief' },
  { id: 29, name: 'Physical Disabilities' },
  { id: 30, name: 'Prenatal Care' },
  { id: 31, name: 'Pulmonary Disease' },
  { id: 32, name: 'Sensory Disabilities' },
  { id: 33, name: 'Spinal Cord Injury' },
  { id: 34, name: 'Substance Abuse' },
  { id: 35, name: 'Traumatic Brain Injury' },
  { id: 36, name: 'Traumatic Injury' },
  { id: 37, name: 'Visually Impared' },
  { id: 38, name: "Women's and Children's Shelter" }
];

export const SpecialtyType = [
  { id: 1, name: 'Allergist', isPhysician: true, isDentist: false },
  { id: 2, name: 'Cardiologist', isPhysician: true, isDentist: false },
  {
    id: 3,
    name: 'Cardiovascular Disease',
    isPhysician: true,
    isDentist: false
  },
  { id: 4, name: 'Chiropractor', isPhysician: true, isDentist: false },
  { id: 5, name: 'Cosmetic Dentistry', isPhysician: false, isDentist: true },
  { id: 45, name: 'Dental Implants', isPhysician: false, isDentist: true },
  { id: 6, name: 'Dermatologist', isPhysician: true, isDentist: false },
  //{ id: 7, name: 'Dermatology', isPhysician: true, isDentist: false },
  {
    id: 8,
    name: 'Emergency Medicine Physician',
    isPhysician: true,
    isDentist: false
  },
  { id: 9, name: 'Endocrinologist', isPhysician: true, isDentist: false },
  { id: 10, name: 'Family Medicine', isPhysician: true, isDentist: false },
  //{ id: 11, name: 'Family Practitioner', isPhysician: true, isDentist: false },
  { id: 12, name: 'Gastroenterologist', isPhysician: true, isDentist: false },
  { id: 13, name: 'General Dentist', isPhysician: false, isDentist: true },
  { id: 14, name: 'General Practice', isPhysician: true, isDentist: false },
  { id: 15, name: 'General Surgery', isPhysician: true, isDentist: false },
  { id: 46, name: 'Geriatric Dentistry', isPhysician: false, isDentist: true },
  {
    id: 16,
    name: 'Internal Medicine-Critical Care Medicine',
    isPhysician: true,
    isDentist: false
  },
  {
    id: 17,
    name: 'Internist (Internal Medicine Specialists)',
    isPhysician: true,
    isDentist: false
  },
  { id: 18, name: 'Nephrologist', isPhysician: true, isDentist: false },
  //{ id: 19, name: 'Neurological Surgery', isPhysician: true, isDentist: false },
  { id: 20, name: 'Neurologist', isPhysician: true, isDentist: false },
  //{ id: 21, name: 'Neurology', isPhysician: true, isDentist: false },
  { id: 22, name: 'Neurosurgeon', isPhysician: true, isDentist: false },
  {
    id: 23,
    name: 'Obstetrician and Gynecologist',
    isPhysician: true,
    isDentist: false
  },
  { id: 24, name: 'Ophthalmologist', isPhysician: true, isDentist: false },
  //{ id: 25, name: 'Opthalmologist', isPhysician: true, isDentist: false },
  { id: 26, name: 'Optometrist', isPhysician: true, isDentist: false },
  { id: 47, name: 'Oral Medicine', isPhysician: false, isDentist: true },
  { id: 27, name: 'Orthodontist', isPhysician: false, isDentist: true },
  { id: 28, name: 'Orthopedic Surgeon', isPhysician: true, isDentist: false },
  {
    id: 29,
    name: 'Otorhinolaryngologist (Ear, Nose & Throat (ENT) Specialist)',
    isPhysician: true,
    isDentist: false
  },
  {
    id: 30,
    name: 'Pain Management Specialist',
    isPhysician: true,
    isDentist: false
  },
  { id: 31, name: 'Pediatric Dentist', isPhysician: false, isDentist: true },
  { id: 32, name: 'Pediatrician', isPhysician: true, isDentist: false },
  { id: 33, name: 'Periodontist', isPhysician: false, isDentist: true },
  { id: 34, name: 'Plastic Surgeon', isPhysician: true, isDentist: false },
  { id: 35, name: 'Podiatrist', isPhysician: true, isDentist: false },
  { id: 36, name: 'Primary Care Doctor', isPhysician: true, isDentist: false },
  { id: 37, name: 'Prosthodontics', isPhysician: false, isDentist: true },
  { id: 38, name: 'Psychiatrist', isPhysician: true, isDentist: false },
  { id: 39, name: 'Pulmonologist', isPhysician: true, isDentist: false },
  { id: 40, name: 'Rheumatologist', isPhysician: true, isDentist: false },
  //{ id: 41, name: 'Sleep Medicine', isPhysician: true, isDentist: false },
  {
    id: 42,
    name: 'Sleep Medicine Specialist',
    isPhysician: true,
    isDentist: false
  },
  {
    id: 48,
    name: 'Special Needs Dentistry',
    isPhysician: false,
    isDentist: true
  },
  {
    id: 43,
    name: 'Temporo-Mandibular Joint Therapy',
    isPhysician: false,
    isDentist: true
  },
  { id: 44, name: 'Urologist', isPhysician: true, isDentist: false }
];
