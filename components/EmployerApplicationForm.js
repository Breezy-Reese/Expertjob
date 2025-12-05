import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../src/services/firebase';
import { addApplication } from '../src/store/jobsSlice';

export default function ApplicationForm({ visible, onClose, job }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userType } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    companyName: '',
    applicantName: '',
    contactEmail: '',
    applicantEmail: '',
    phone: '',
    resumeUrl: '',
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setSelectedDocument(result);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleSubmit = async () => {
    console.log('handleSubmit called');
    console.log('userType:', userType);
    console.log('formData:', formData);
    console.log('selectedDocument:', selectedDocument);
    // Basic validation
    if (userType === 'employer') {
      if (!formData.companyName || !formData.contactEmail || !formData.phone || (!formData.resumeUrl && !selectedDocument)) {
        console.log('Validation failed for employer');
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }
    } else {
      if (!formData.applicantName || !formData.applicantEmail || !formData.phone) {
        console.log('Validation failed for applicant');
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }
    }
    console.log('Validation passed');

    try {
      // Save to Firestore
      const applicationData = {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicantType: userType,
        ...formData,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'applications'), applicationData);

      // Dispatch action to add application to Redux
      dispatch(addApplication(applicationData));

      setIsSubmitted(true);
      // Notify user of successful submission, then redirect to jobs page
      Alert.alert('Success', 'Your application has been submitted successfully! You will be redirected to the jobs page.');
      onClose();
      setTimeout(() => {
        router.push('/jobs');
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title}>Apply for Job</Text>
          <Text style={styles.subtitle}>Fill in your details for {job?.title} at {job?.company}</Text>

          <View style={styles.form}>
            {userType === 'employer' ? (
              <>
                <Text style={styles.label}>Company Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChangeText={(text) => handleChange('companyName', text)}
                />

                <Text style={styles.label}>Contact Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter contact email"
                  value={formData.contactEmail}
                  onChangeText={(text) => handleChange('contactEmail', text)}
                  keyboardType="email-address"
                />
              </>
            ) : (
              <>
                <Text style={styles.label}>Applicant Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={formData.applicantName}
                  onChangeText={(text) => handleChange('applicantName', text)}
                />

                <Text style={styles.label}>Contact Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter contact email"
                  value={formData.applicantEmail}
                  onChangeText={(text) => handleChange('applicantEmail', text)}
                  keyboardType="email-address"
                />
              </>
            )}

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
            />

            {userType === 'employer' && (
              <>
                <Text style={styles.label}>Resume URL or Upload Document *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter resume URL"
                  value={formData.resumeUrl}
                  onChangeText={(text) => handleChange('resumeUrl', text)}
                />
                <Text style={styles.orText}>OR</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                  <Text style={styles.uploadButtonText}>
                    {selectedDocument ? `Selected: ${selectedDocument.name}` : 'Choose Document (PDF/DOC)'}
                  </Text>
                </TouchableOpacity>
                {selectedDocument && (
                  <Text style={styles.fileInfo}>
                    Size: {(selectedDocument.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                )}
              </>
            )}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.submitButton, isSubmitted && styles.submitButtonDisabled]} onPress={handleSubmit} disabled={isSubmitted}>
            <Text style={styles.submitButtonText}>{isSubmitted ? "Successful Submit" : "Submit Application"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 10,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
