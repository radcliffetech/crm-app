import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import Student, Course, Instructor
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

        self.stdout.write("Loading instructors...")
        self.load_data("instructors.json", self.load_instructor)
 
        self.stdout.write("Loading courses...")
        self.load_data("courses.json", self.load_course)

        self.stdout.write("Loading students...")
        self.load_data("students.json", self.load_student)


        self.stdout.write(self.style.SUCCESS("Sample data reset and loaded successfully."))

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

        course, created = Course.objects.update_or_create(
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
                "created_at": datetime.fromisoformat(data["created_at"]),
                "updated_at": datetime.fromisoformat(data["updated_at"]),
            }
        )

        prerequisite_codes = data.get("prerequisites", [])
        if prerequisite_codes:
            prereq_courses = Course.objects.filter(course_code__in=prerequisite_codes)
            course.prerequisites.set(prereq_courses)
        else:
            # Randomly assign 0–1 fake prerequisites for demo purposes if no prerequisites listed
            other_courses = Course.objects.exclude(id=course.id)
            if other_courses.exists():
                sample = other_courses.order_by('?').first()
                course.prerequisites.add(sample)

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