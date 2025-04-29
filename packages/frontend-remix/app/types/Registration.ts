export type Registration = {
  id: string;
  student_id: string;
  course_id: string;
  registered_at: string; // ISO
  payment_status: "pending" | "completed" | "failed";
  registration_status: "registered" | "waitlisted" | "cancelled";
  created_at: string; // ISO
  updated_at: string; // ISO

  student_name?: string;
  course_name?: string;
};
