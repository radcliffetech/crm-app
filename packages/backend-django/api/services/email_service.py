class EmailService:
    def send_registration_email(self, student, course):
        print(f"[Email Stub] Sent registration email to {student.email} for course {course.title}")

    def send_unregistration_email(self, student, course):
        print(f"[Email Stub] Sent unregistration email to {student.email} for course {course.title}")