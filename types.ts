
export interface DigitalIntegration {
  code: string;
  requirement: string;
  description: string;
}

export interface Step {
  stepName: string;
  teacherAction: string;
  output: string;
}

export interface Activity {
  name: string;
  objective: string;
  content: string;
  product: string;
  steps: Step[];
  digitalIntegration?: DigitalIntegration;
}

export interface Objectives {
  knowledge: string[];
  competency: string[];
  quality: string[];
}

export interface LessonPlan {
  topic: string;
  subject: string;
  grade: string;
  duration: string;
  objectives: Objectives;
  materials: string[];
  activities: Activity[];
}

export interface WorksheetItem {
  type: 'fill' | 'essay';
  question: string;
}

export interface Worksheet {
  title: string;
  description: string;
  content: WorksheetItem[];
}

export interface Slide {
  type: string;
  title: string;
  points: string[];
}

export interface AssessmentQuestion {
  level: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface DigitalMapping {
  activity: string;
  competencyCode: string;
  competency: string;
  tool: string;
  action: string;
  evidence: string;
}

export interface DigitalPack {
  summary: string;
  mapping: DigitalMapping[];
}

export interface FormData {
  grade: string;
  subject: string;
  topic: string;
  duration: string;
  template: string;
  classLevel: string;
  integrationMode: string;
  originalText: string;
  products: string[];
  selectedFramework: string;
  // New fields
  textbookFileName?: string;
  frameworkFileName?: string;
  customFrameworkFileName?: string;
}

export interface ResultData {
  lessonPlan: LessonPlan;
  assessment: AssessmentQuestion[];
  worksheets: Worksheet[];
  slides: Slide[];
  digitalPack: DigitalPack;
  mode: 'creation' | 'integration';
}

// Supabase Record Types
export interface LessonPlanRecord {
  id: number;
  created_at: string;
  topic: string;
  subject: string;
  grade: string;
  content: ResultData;
  textbook_url?: string;
  framework_url?: string;
}

export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    contentLength: number;
    httpStatusCode: number;
  };
}
