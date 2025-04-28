type CourseAdditionalFields = {
  // this come from the API, not part of the Course data
  instructor_name?: string; // new
  enrollment_count?: number; // new
};

export type CoursePrerequisite = {
  id: string;
  title: string;
  course_code: string;
}; 

export type Course = {
    id: string;
    course_code: string;
    title: string;
    description: string;
    description_full: string;
    instructor_id: string;
    start_date: string; // ISO
    end_date: string; // ISO
    course_fee: number; // Optional: Add course fee if applicable
    syllabus_url?: string; // URL or path to the syllabus document
    created_at: string; //  ISO 
    updated_at: string; // ISO
    prerequisites?: CoursePrerequisite[]
  } & CourseAdditionalFields; // Merge with additional fields