import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

const ApplicationStatusScreen = () => {
  const [applications, setApplications] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    fetchApplications();
    fetchUserProfile();
  }, []);

  const fetchApplications = async () => {
    try {
      const user = auth.currentUser;
      const q = query(
        collection(db, 'applications'),
        where('applicantId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const user = auth.currentUser;
      // You'll need to implement this based on your user profile structure
      // This is where you'd check verification status
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const renderApplication = ({ item }) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        <Text style={[styles.status, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.appliedDate}>
        Applied on {item.appliedAt?.toDate().toLocaleDateString()}
      </Text>
      
      {item.feedback && (
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackLabel}>Feedback:</Text>
          <Text style={styles.feedback}>{item.feedback}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.verificationBanner}>
        <Text style={styles.verificationText}>
          {userProfile?.isVerified ? '✓ Account Verified' : '⚠ Account Verification Required'}
        </Text>
        {!userProfile?.isVerified && (
          <TouchableOpacity style={styles.verifyButton}>
            <Text style={styles.verifyButtonText}>Verify Now</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Your Applications</Text>
      <FlatList
        data={applications}
        renderItem={renderApplication}
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
  verificationBanner: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  verificationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  applicationCard: {
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
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  status: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  appliedDate: {
    fontSize: 14,
    color: '#888',
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
});

export default ApplicationStatusScreen;