export interface Payment {
    id: string;
    student_id: string;
    registration_id: string;
    course_id: string;
    amount: number;
    method: "credit_card" | "paypal" | "cash";
    status: "pending" | "completed" | "failed";
    created_at: Date;
    updated_at: Date;
  }

  export type PaymentWithLabels = Payment & {
    course_name: string;
    student_name: string;
  }
  