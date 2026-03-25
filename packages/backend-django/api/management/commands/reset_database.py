import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import Student, Course, Instructor, Registration
from uuid import UUID
from datetime import datetime

class Command(BaseCommand):
    help = "Reset all data and load sample data from JSON files"

    def handle(self, *args, **kwargs):
        confirm = input("This will DELETE ALL EXISTING data and reload sample data. Are you sure? [y/N]: ")
        if confirm.lower() != 'y':
            self.stdout.write(self.style.WARNING("Operation cancelled."))
            return

        self.stdout.write("Deleting old data...")
        Student.objects.all().delete()
        Course.objects.all().delete()
        Instructor.objects.all().delete()
        Registration.objects.all().delete()

        self.stdout.write("Loading instructors...")
        self.load_data("instructors.json", self.load_instructor)
 
        self.stdout.write("Loading courses...")
        self.load_data("courses.json", self.load_course)

        self.stdout.write("Loading students...")
        self.load_data("students.json", self.load_student)

        # set up some course prerequisites
        self.stdout.write("Setting up course prerequisites...")

        self.stdout.write("Creating auth groups and demo users...")
        self._create_demo_users()

        self.stdout.write(self.style.SUCCESS("Sample data reset and loaded successfully."))

    def _create_demo_users(self):
        from django.contrib.auth.models import User, Group

        admin_group, _ = Group.objects.get_or_create(name='admin')
        faculty_group, _ = Group.objects.get_or_create(name='faculty')
        student_group, _ = Group.objects.get_or_create(name='student')

        User.objects.filter(username__in=['admin', 'faculty', 'student']).delete()

        User.objects.create_superuser(
            'admin', 'admin@miim.edu', 'admin123',
            first_name='Admin', last_name='User'
        )

        faculty_user = User.objects.create_user(
            'faculty', 'faculty@miim.edu', 'faculty123',
            first_name='Faculty', last_name='User'
        )
        faculty_user.groups.add(faculty_group)

        student_user = User.objects.create_user(
            'student', 'student@miim.edu', 'student123',
            first_name='Student', last_name='User'
        )
        student_user.groups.add(student_group)

    def load_data(self, filename, loader):
        path = os.path.join(settings.BASE_DIR, "data", filename)
        with open(path, "r") as f:
            for record in json.load(f):
                loader(record)

    def load_instructor(self, data):
        Instructor.objects.update_or_create(
            id=UUID(data["id"]),
            defaults={
                "name_first": data["name_first"],
                "name_last": data["name_last"],
                "email": data["email"],
                "bio": data.get("bio", ""),
                "created_at": datetime.fromisoformat(data["created_at"]),
                "updated_at": datetime.fromisoformat(data["updated_at"]),
            },
        )

    def load_course(self, data):
        instructor = Instructor.objects.get(id=UUID(data["instructor_id"]))

        Course.objects.update_or_create(
            id=UUID(data["id"]),
            defaults={
                "title": data["title"],
                "course_code": data["course_code"],
                "description": data["description"],
                "description_full": data["description_full"],
                "instructor": instructor,
                "start_date": datetime.fromisoformat(data["start_date"]).date(),
                "end_date": datetime.fromisoformat(data["end_date"]).date(),
                "course_fee": data["course_fee"],
                "syllabus_url": data.get("syllabus_url"),
                "prerequisites": data.get("prerequisites", []),
                "created_at": datetime.fromisoformat(data["created_at"]),
                "updated_at": datetime.fromisoformat(data["updated_at"]),
            }
        )

    def load_student(self, data):
        print(f"Loading student: {data['name_first']} {data['name_last']}")
        Student.objects.update_or_create(
            id=UUID(data["id"]),
            defaults={
                "name_first": data["name_first"],
                "name_last": data["name_last"],
                "email": data["email"],
                "phone": data.get("phone"),
                "company": data.get("company"),
                "notes": data.get("notes"),
                "created_at": datetime.fromisoformat(data["created_at"]),
                "updated_at": datetime.fromisoformat(data["updated_at"]),
            },
        )