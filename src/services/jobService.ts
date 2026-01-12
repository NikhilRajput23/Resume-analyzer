import api from './api';

// Job API service - ready to connect to Spring Boot backend

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills: string[];
  salary?: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  createdAt: string;
  createdBy: string;
}

export interface JobMatch {
  job: Job;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface CreateJobRequest {
  title: string;
  company: string;
  location: string;
  description: string;
  requiredSkills: string[];
  salary?: string;
  type: Job['type'];
}

export const jobService = {
  // Get all jobs
  getAll: async (): Promise<Job[]> => {
    const response = await api.get<Job[]>('/jobs');
    return response.data;
  },

  // Get job by ID
  getById: async (id: string): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  // Create new job (Admin only)
  create: async (data: CreateJobRequest): Promise<Job> => {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  },

  // Update job (Admin only)
  update: async (id: string, data: Partial<CreateJobRequest>): Promise<Job> => {
    const response = await api.put<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  // Delete job (Admin only)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  // Get job matches for current user's resume
  getMatches: async (resumeId?: string): Promise<JobMatch[]> => {
    const url = resumeId ? `/jobs/matches?resumeId=${resumeId}` : '/jobs/matches';
    const response = await api.get<JobMatch[]>(url);
    return response.data;
  },
};
