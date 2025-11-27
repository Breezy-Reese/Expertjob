import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setApplications } from '../../src/store/jobsSlice';

// Mock applications data
// Change from Date objects to ISO strings
const mockApplications = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior React Native Developer',
    company: 'TechCorp Inc.',
    status: 'pending',
    appliedAt: '2024-01-15T00:00:00.000Z', // Cha
    feedback: '',
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'Frontend Developer',
    company: 'WebSolutions LLC',
    status: 'approved',
    appliedAt: '2024-01-10T00:00:00.000Z', 
    feedback: 'Great profile! We would like to schedule an interview.',
  },
  {
    id: '3',
    jobId: '3',
    jobTitle: 'Mobile App Developer',
    company: 'AppMasters',
    status: 'rejected',
    appliedAt: '2024-01-05T00:00:00.000Z', 
    feedback: 'Unfortunately, we found a candidate with more relevant experience.',
  },
];

export default function Applications() {
  const dispatch = useDispatch();
  const { applications } = useSelector(state => state.jobs);
  const { userType } = useSelector(state => state.auth);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate API call
    dispatch(setApplications(mockApplications));
  }, []);

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending Review';
      default: return status;
    }
  };

  const renderApplication = ({ item }) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
          <Text style={styles.company}>{item.company}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.appliedDate}>
  Applied on {new Date(item.appliedAt).toLocaleDateString()}
</Text>
      
      {item.feedback && (
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackLabel}>Feedback:</Text>
          <Text style={styles.feedback}>{item.feedback}</Text>
        </View>
      )}

      {item.status === 'approved' && (
        <TouchableOpacity style={styles.interviewButton}>
          <Text style={styles.interviewButtonText}>Schedule Interview</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (userType === 'employer') {
    return (
      <View style={styles.container}>
        <Text style={styles.employerMessage}>
          👋 Employer View
        </Text>
        <Text style={styles.employerSubtitle}>
          View and manage job applications from candidates in the Jobs section.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Applications</Text>
        <Text style={styles.subtitle}>
          Track your job application status
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filter === status && styles.filterButtonActive]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.filterTextActive]}>
              {status === 'all' ? 'All' : getStatusText(status)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredApplications.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No applications found</Text>
          <Text style={styles.emptyStateText}>
            {filter === 'all' 
              ? "You haven't applied to any jobs yet."
              : `No ${filter} applications found.`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredApplications}
          renderItem={renderApplication}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
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
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  employerMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
    color: '#333',
  },
  employerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  applicationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    // Updated shadow
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  company: {
    fontSize: 16,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  appliedDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  feedbackSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  feedback: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  interviewButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  interviewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});