import { Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setJobs, setTopJobs } from '../../src/store/jobsSlice';

// Mock data - replace with actual API calls
const mockJobs = [
  {
    id: '1',
    title: 'Senior JavaScript Developer',
    company: 'TechCorp Inc.',
    location: 'Nairobi, KE',
    salary: 'ksh120,000 - ksh150,000',
    type: 'Full-time',
    companyLogo: 'https://via.placeholder.com/60x60?text=TC',
    description: 'We are looking for an experienced React Native developer...',
    requirements: ['5+ years React Native', 'TypeScript', 'Redux'],
    benefits: ['Health insurance', 'Remote work', 'Flexible hours'],
    employerId: 'employer1',
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'SwahiliPot',
    location: 'Mombasa, KE',
    salary: 'ksh90,000 - ksh110,000',
    type: 'Full-time',
    companyLogo: 'https://via.placeholder.com/60x60?text=WS',
    description: 'Join our frontend team to build amazing web applications...',
    requirements: ['3+ years React', 'JavaScript', 'CSS'],
    benefits: ['Stock options', 'Learning budget', 'Team events'],
    employerId: 'employer2',
  },
  {
    id: '3',
    title: 'Mobile App Developer',
    company: 'AppMasters',
    location: 'Remote',
    salary: 'ksh80,000 - ksh100,000',
    type: 'Remote',
    companyLogo: 'https://via.placeholder.com/60x60?text=AM',
    description: 'Develop cutting-edge mobile applications for iOS and Android...',
    requirements: ['React Native/Flutter', 'REST APIs', 'Git'],
    benefits: ['Fully remote', 'Unlimited PTO', 'Hardware budget'],
    employerId: 'employer3',
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const { jobs, topJobs } = useSelector(state => state.jobs);
  const { userType } = useSelector(state => state.auth);
  const { submitted } = useLocalSearchParams();

  useEffect(() => {
    // Simulate API call
    dispatch(setJobs(mockJobs));
    dispatch(setTopJobs(mockJobs.slice(0, 2)));
  }, []);



  const renderTopJob = ({ item }) => (
    <Link href={`/jobs/${item.id}`} asChild>
      <TouchableOpacity style={styles.topJobCard}>
        <Image source={{ uri: item.companyLogo }} style={styles.companyLogo} />
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.companyName}>{item.company}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
        <Text style={styles.jobSalary}>{item.salary}</Text>
        <Text style={styles.jobType}>{item.type}</Text>
      </TouchableOpacity>
    </Link>
  );

  const renderJobItem = ({ item }) => (
    <Link href={`/jobs/${item.id}`} asChild>
      <TouchableOpacity style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Image source={{ uri: item.companyLogo }} style={styles.smallLogo} />
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.companyName}>{item.company}</Text>
          </View>
        </View>
        <Text style={styles.jobLocation}>{item.location}</Text>
        <Text style={styles.jobType}>{item.type}</Text>
        <Text style={styles.jobSalary}>{item.salary}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>
          Welcome {userType === 'employer' ? 'Employer' : 'Job Seeker'}!
        </Text>
        <Text style={styles.welcomeSubtitle}>
          {userType === 'employer' 
            ? 'Find the perfect candidates for your company' 
            : 'Find your dream job today'
          }
        </Text>
      </View>

      {userType === 'employee' && (
        <>
          <Text style={styles.sectionTitle}>Featured Jobs</Text>
          <FlatList
            horizontal
            data={topJobs}
            renderItem={renderTopJob}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          />
        </>
      )}

      <Text style={styles.sectionTitle}>
        {userType === 'employer' ? 'Posted Jobs' : 'All Jobs'}
      </Text>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        style={styles.jobsList}
      />

      {userType === 'employer' && (
        <Link href="/jobs/create" asChild>
          <TouchableOpacity style={styles.createJobButton}>
            <Text style={styles.createJobButtonText}>+ Create New Job</Text>
          </TouchableOpacity>
        </Link>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  welcomeSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    // Replace shadow properties
    elevation: 3, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  carousel: {
    marginBottom: 20,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
  },
  smallLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobInfo: {
    marginLeft: 10,
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  jobLocation: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  jobType: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
  },
  jobsList: {
    marginBottom: 20,
  },
  createJobButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  createJobButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
