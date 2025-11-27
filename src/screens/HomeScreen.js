import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

const HomeScreen = ({ navigation }) => {
  const [topJobs, setTopJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const jobsQuery = query(
        collection(db, 'jobs'),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(jobsQuery);
      const jobs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Top jobs (you can define your own criteria)
      setTopJobs(jobs.slice(0, 5));
      setAllJobs(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const renderTopJob = ({ item }) => (
    <TouchableOpacity 
      style={styles.topJobCard}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
      <Image source={{ uri: item.companyLogo }} style={styles.companyLogo} />
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.companyName}>{item.company}</Text>
      <Text style={styles.jobLocation}>{item.location}</Text>
      <Text style={styles.jobSalary}>{item.salary}</Text>
    </TouchableOpacity>
  );

  const renderJobItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetails', { job: item })}
    >
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
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Top Jobs</Text>
      <FlatList
        horizontal
        data={topJobs}
        renderItem={renderTopJob}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      />
      
      <Text style={styles.sectionTitle}>All Jobs</Text>
      <FlatList
        data={allJobs}
        renderItem={renderJobItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  carousel: {
    marginBottom: 20,
  },
  topJobCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginRight: 15,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 18,
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
});

export default HomeScreen;