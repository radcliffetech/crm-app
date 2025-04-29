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
  course_fee: string; // Optional: Add course fee if applicable
  syllabus_url?: string; // URL or path to the syllabus document
  created_at: string; //  ISO
  updated_at: string; // ISO
  prerequisites: string[];
} & CourseAdditionalFields; // Merge with additional fields

export type CoursePayload = Omit<Course, "id" | "created_at" | "updated_at">;

export type CourseFormData = {
  course_code: string;
  title: string;
  description: string;
  description_full: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  syllabus_url: string;
  course_fee: string;
  prerequisites: string[];
};
