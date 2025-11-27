import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const JobDetailsScreen = ({ route, navigation }) => {
  const { job } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.company}</Text>
        <Text style={styles.location}>{job.location}</Text>
        <Text style={styles.salary}>{job.salary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.description}>{job.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        {job.requirements?.map((req, index) => (
          <Text key={index} style={styles.listItem}>• {req}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits</Text>
        {job.benefits?.map((benefit, index) => (
          <Text key={index} style={styles.listItem}>• {benefit}</Text>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.applyButton}
        onPress={() => navigation.navigate('JobApplication', { job })}
      >
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const JobApplicationScreen = ({ route, navigation }) => {
  const { job } = route.params;
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState('');

  const handleApply = async () => {
    try {
      const user = auth.currentUser;
      
      // Save application to Firestore
      await addDoc(collection(db, 'applications'), {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicantId: user.uid,
        applicantEmail: user.email,
        coverLetter,
        resume,
        status: 'pending',
        appliedAt: new Date(),
      });

      Alert.alert('Success', 'Application submitted successfully!');
      navigation.navigate('ApplicationStatus');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Apply for {job.title}</Text>
      <Text style={styles.company}>at {job.company}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Cover Letter</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write your cover letter..."
          value={coverLetter}
          onChangeText={setCoverLetter}
          multiline
          numberOfLines={6}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Resume (URL)</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste your resume URL"
          value={resume}
          onChangeText={setResume}
        />
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Submit Application</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  company: {
    fontSize: 20,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  salary: {
    fontSize: 18,
    fontWeight: '600',
    color: '#28a745',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 5,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});

export { JobDetailsScreen, JobApplicationScreen };