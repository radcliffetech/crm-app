type CourseAdditionalFields = {
  // this come from the API, not part of the Course data
  instructor_name?: string; // new
  enrollment_count?: number; // new
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
    prerequisites?: string[]; // Array of course IDs or names
    syllabus_url?: string; // URL or path to the syllabus document
    created_at: string; //  ISO 
    updated_at: string; // ISO
  } & CourseAdditionalFields; // Merge with additional fields