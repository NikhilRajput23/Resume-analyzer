import { Job, JobMatch } from '@/services/jobService';
import { Resume } from '@/services/resumeService';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'CrickScore .',
    location: 'Ahemedabad, CA (Remote)',
    description: 'We are looking for an experienced React developer to join our frontend team. You will be building modern web applications using React, TypeScript, and related technologies.',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git', 'REST APIs'],
    salary: '₹5,000 - ₹10,000',
    type: 'FULL_TIME',
    createdAt: '2024-01-15',
    createdBy: 'admin',
  },
  {
    id: '2',
    title: 'Full Stack Java Developer',
    company: 'NIQ.',
    location: 'Vadodra, Subanpura (Onsite)',
    description: 'Join our enterprise team to build scalable backend systems using Java Spring Boot and modern frontend frameworks.',
    requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'React', 'REST APIs', 'Microservices'],
    salary: '₹20,000 - ₹30,000',
    type: 'FULL_TIME',
    createdAt: '2024-01-10',
    createdBy: 'admin',
  },
  {
    id: '3',
    title: 'Python Data Engineer',
    company: 'DataDriven Co.',
    location: 'Pune, Hinjwadi (Hybrid)',
    description: 'Build data pipelines and analytics solutions using Python and modern data engineering tools.',
    requiredSkills: ['Python', 'SQL', 'Apache Spark', 'AWS', 'ETL', 'Data Modeling'],
    salary: '₹20,000 - ₹25,000',
    type: 'FULL_TIME',
    createdAt: '2024-01-08',
    createdBy: 'admin',
  },
  {
    id: '4',
    title: 'Frontend Developer Intern',
    company: 'StartupHub',
    location: 'Surat, (Onsite)',
    description: 'Great opportunity for students to learn modern frontend development in a fast-paced startup environment.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    salary:'₹15,000 - ₹17,000',
    type: 'INTERNSHIP',
    createdAt: '2024-01-12',
    createdBy: 'admin',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Saiket Systems',
    location: 'Vadodara, Pune, Mumbai (Hybrid)',
    description: 'Manage cloud infrastructure and CI/CD pipelines for our SaaS platform.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux'],
    salary: '₹20,000 - ₹25,000',
    type: 'FULL_TIME',
    createdAt: '2024-01-05',
    createdBy: 'admin',
  },
];

// Mock resumes data
export const mockResumes: Resume[] = [
  {
    id: '1',
    userId: '1',
    fileName: 'john_doe_resume.pdf',
    uploadDate: '2024-01-14',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Git', 'Node.js'],
    status: 'ANALYZED',
  },
];

// Mock user skills (extracted from resume)
export const mockUserSkills: string[] = [
  'React',
  'JavaScript',
  'TypeScript',
  'CSS',
  'HTML',
  'Git',
  'Node.js',
  'REST APIs',
  'Tailwind CSS',
];

// Calculate job matches based on skills
export function calculateJobMatches(userSkills: string[]): JobMatch[] {
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
  
  return mockJobs.map(job => {
    const normalizedJobSkills = job.requiredSkills.map(s => s.toLowerCase());
    
    const matchedSkills = job.requiredSkills.filter(skill => 
      normalizedUserSkills.includes(skill.toLowerCase())
    );
    
    const missingSkills = job.requiredSkills.filter(skill => 
      !normalizedUserSkills.includes(skill.toLowerCase())
    );
    
    const matchPercentage = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
    
    return {
      job,
      matchPercentage,
      matchedSkills,
      missingSkills,
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// Common skills list for UI suggestions
export const commonSkills: string[] = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express',
  'Spring Boot', 'Django', 'Flask', 'FastAPI',
  'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Sass',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
  'Git', 'GitHub', 'GitLab', 'CI/CD', 'Jenkins',
  'REST APIs', 'GraphQL', 'Microservices', 'Agile', 'Scrum',
];
