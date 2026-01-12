import api from './api';

// Resume API service - ready to connect to Spring Boot backend

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  uploadDate: string;
  skills: string[];
  status: 'PENDING' | 'ANALYZED' | 'ERROR';
}

export interface ResumeUploadResponse {
  id: string;
  message: string;
  extractedSkills: string[];
}

export const resumeService = {
  // Upload resume file
  upload: async (file: File): Promise<ResumeUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ResumeUploadResponse>('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get all resumes for current user
  getMyResumes: async (): Promise<Resume[]> => {
    const response = await api.get<Resume[]>('/resumes/my');
    return response.data;
  },

  // Get resume by ID
  getById: async (id: string): Promise<Resume> => {
    const response = await api.get<Resume>(`/resumes/${id}`);
    return response.data;
  },

  // Delete resume
  delete: async (id: string): Promise<void> => {
    await api.delete(`/resumes/${id}`);
  },

  // Re-analyze resume
  reanalyze: async (id: string): Promise<Resume> => {
    const response = await api.post<Resume>(`/resumes/${id}/analyze`);
    return response.data;
  },
};
