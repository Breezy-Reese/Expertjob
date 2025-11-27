import { createSlice } from '@reduxjs/toolkit';

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    topJobs: [],
    applications: [],
    isLoading: false,
  },
  reducers: {
    setJobs: (state, action) => {
      // Convert any Date objects to strings for serialization
      state.jobs = action.payload.map(job => ({
        ...job,
        // Add any date conversion if needed
      }));
    },
    setTopJobs: (state, action) => {
      state.topJobs = action.payload.map(job => ({
        ...job,
        // Add any date conversion if needed
      }));
    },
    setApplications: (state, action) => {
      // Convert Date objects to ISO strings for serialization
      state.applications = action.payload.map(app => ({
        ...app,
        appliedAt: app.appliedAt instanceof Date ? app.appliedAt.toISOString() : app.appliedAt,
      }));
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addJob: (state, action) => {
      state.jobs.unshift(action.payload);
    },
    updateApplication: (state, action) => {
      const { applicationId, updates } = action.payload;
      const index = state.applications.findIndex(app => app.id === applicationId);
      if (index !== -1) {
        state.applications[index] = { 
          ...state.applications[index], 
          ...updates 
        };
      }
    },
  },
});

export const { 
  setJobs, 
  setTopJobs, 
  setApplications, 
  setLoading, 
  addJob, 
  updateApplication 
} = jobsSlice.actions;
export default jobsSlice.reducer;