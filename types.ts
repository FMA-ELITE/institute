
export enum AcademicLevel {
  FOUNDATION = 'Foundation',
  UNDERGRADUATE = 'Undergraduate',
  GRADUATE = 'Graduate',
  MASTERS = 'Masters'
}

export interface Course {
  id: string;
  title: string;
  level: AcademicLevel;
  credits: number;
  instructor: string;
  department: string;
  description: string;
  syllabus: string[];
  readingList: string[];
  image: string;
  visualPrompt?: string; // Prompt for AI image generation
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  type: 'Research Paper' | 'Textbook' | 'Institutional Journal' | 'White Paper';
  topic: string;
  year: number;
  description: string;
  coverImage: string;
  visualPrompt?: string;
}

export interface Faculty {
  name: string;
  title: string;
  expertise: string;
  bio: string;
  professionalHistory: string[];
  keyPublications: string[];
  image: string;
  officeHours: string;
  visualPrompt?: string; // Prompt for AI image generation
}

export interface EnrollmentData {
  fullName: string;
  email: string;
  phone: string;
  intendedMajor: string;
  currentLevel: string;
  statementOfIntent: string;
  submissionDate: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'Market Alert' | 'Institutional' | 'Academic' | 'Research';
  summary: string;
  image: string;
}
