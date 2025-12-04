import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import ApplicationForm from '../../components/EmployerApplicationForm';

export default function JobDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userType } = useSelector(state => state.auth);
  const { jobs } = useSelector(state => state.jobs);
  
  const job = jobs.find(j => j.id === id);

  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleApply = async () => {
    setShowApplicationForm(true);
  };

  const handleContact = () => {
    Linking.openURL(`mailto:hr@${job.company.toLowerCase().replace(/\s+/g, '')}.com?subject=Regarding ${job.title} Position`);
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Job not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Job Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.company}</Text>
        <Text style={styles.location}>{job.location}</Text>
        <Text style={styles.salary}>{job.salary}</Text>
        <Text style={styles.type}>{job.type}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.applyButton, isApplying && styles.applyButtonDisabled]}
          onPress={handleApply}
          disabled={isApplying}
        >
          <Text style={styles.applyButtonText}>
            {isApplying ? 'Applying...' : 'Apply Now'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Text style={styles.contactButtonText}>Contact HR</Text>
        </TouchableOpacity>
      </View>

      {/* Job Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Description</Text>
        <Text style={styles.description}>{job.description}</Text>
      </View>

      {/* Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        {job.requirements.map((req, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>{req}</Text>
          </View>
        ))}
      </View>

      {/* Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits</Text>
        {job.benefits.map((benefit, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>{benefit}</Text>
          </View>
        ))}
      </View>

      {/* Company Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About {job.company}</Text>
        <Text style={styles.description}>
          {job.company} is a leading company in the tech industry, dedicated to innovation and excellence.
          We value our employees and provide a supportive environment for professional growth.
        </Text>
      </View>

      {/* Application Form */}
      <ApplicationForm
        visible={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        job={job}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
    marginBottom: 5,
  },
  type: {
    fontSize: 14,
    color: '#007AFF',
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 16,
    color: '#555',
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});