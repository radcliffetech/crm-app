export type Registration = {
    id: string;
    student_id: string;
    course_id: string;
    registered_at: string; // ISO
    payment_status: "pending" | "completed" | "failed";
  };