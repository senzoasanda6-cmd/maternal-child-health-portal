import ChildCard from '../components/ChildCard';
import GrowthChart from '../components/GrowthChart';
import AppointmentsList from '../components/AppointmentsList';
import MilestoneTracker from '../components/MilestoneTracker';
import HealthRecords from '../components/HealthRecords';
import QuickLinks from '../components/QuickLinks';

export default function Dashboard() {
  const child = {
    name: 'Amina',
    age: '14 months',
    gender: 'Female',
    nextCheckup: 'Nov 5, 2025',
    growthStatus: 'Normal',
  };

  const growthData = [
    { date: '2025-01', height: 70, weight: 8 },
    { date: '2025-05', height: 75, weight: 9 },
    { date: '2025-09', height: 78, weight: 9.5 },
  ];

  const appointments = [
    { date: '2025-11-05', type: 'Child Checkup', location: 'Clinic A' },
    { date: '2025-11-12', type: 'Nutrition Counseling', location: 'Clinic B' },
  ];

  const milestones = [
    { label: 'Can sit without support', status: '✅' },
    { label: 'Responds to name', status: '✅' },
    { label: 'Walks independently', status: '⏳' },
  ];

  const records = [
    { title: 'Immunization: Polio', details: 'Completed on 2025-08-01' },
    { title: 'Doctor Note', details: 'Healthy growth noted at last visit.' },
  ];

  const links = [
    { label: 'Nutrition Guides', url: '/resources/nutrition' },
    { label: 'Breastfeeding Tips', url: '/resources/breastfeeding' },
    { label: 'Mental Health Support', url: '/resources/mental-health' },
    { label: 'Emergency Contacts', url: '/resources/emergency' },
  ];

  return (
    <div className="p-6 space-y-6">
      <ChildCard {...child} />
      <GrowthChart data={growthData} />
      <AppointmentsList appointments={appointments} />
      <MilestoneTracker milestones={milestones} />
      <HealthRecords records={records} />
      <QuickLinks links={links} />
    </div>
  );
}
