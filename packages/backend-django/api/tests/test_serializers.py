from django.test import TestCase
from api.serializers import (
    CourseSerializer,
    InstructorSerializer,
    CourseListSerializer,
    StudentSerializer,
    RegistrationSerializer,
)
from api.models import Instructor, Course, Student, Registration

class CourseSerializerTests(TestCase):
    def setUp(self):
        self.instructor = Instructor.objects.create(
            name_first="Test",
            name_last="Instructor",
            email="test.instructor@example.com"
        )

    @staticmethod
    def create_basic_course(course_code: str, title: str, instructor: Instructor):
        from api.models import Course
        return Course.objects.create(
            course_code=course_code,
            title=title,
            description="Basic",
            description_full="Basic Full",
            instructor=instructor,
            start_date="2025-01-01",
            end_date="2025-01-30",
            course_fee=500.00
        )

    def test_create_course_with_serializer(self):
        """Test that a course can be created using the CourseSerializer with instructor_id."""
        data = {
            "course_code": "TEST-101",
            "title": "Test Course",
            "description": "Short description",
            "description_full": "Full detailed description",
            "instructor_id": str(self.instructor.id),
            "start_date": "2025-05-01",
            "end_date": "2025-05-15",
            "course_fee": "1000.00",
            "syllabus_url": "",
            "prerequisites": []
        }
        serializer = CourseSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        course = serializer.save()

        self.assertEqual(course.course_code, "TEST-101")
        self.assertEqual(course.instructor, self.instructor)
        self.assertEqual(course.title, "Test Course")

    def test_create_course_with_prerequisites(self):
        """Test that a course can be created with prerequisites using the CourseSerializer."""
        # First, create a prerequisite course
        prereq_course = CourseSerializerTests.create_basic_course(
            course_code="PREREQ-100",
            title="Intro Prerequisite Course",
            instructor=self.instructor
        )

        # Now create a new course with that prerequisite (using course code)
        data = {
            "course_code": "TEST-201",
            "title": "Advanced Test Course",
            "description": "Description for advanced course",
            "description_full": "Full description",
            "instructor_id": str(self.instructor.id),
            "start_date": "2025-06-01",
            "end_date": "2025-06-30",
            "course_fee": "1200.00",
            "syllabus_url": "",
            "prerequisites": [prereq_course.course_code]
        }
        serializer = CourseSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

        course = serializer.save()

        self.assertEqual(course.course_code, "TEST-201")
        self.assertEqual(course.instructor, self.instructor)
        self.assertIn(prereq_course.course_code, course.prerequisites)

    def test_update_course_set_prerequisites(self):
        """Test updating a course to assign multiple prerequisites."""
        # Create prerequisite courses
        prereq1 = self.create_basic_course(
            course_code="PRE-101",
            title="Foundations of Magic",
            instructor=self.instructor
        )
        prereq2 = self.create_basic_course(
            course_code="PRE-102",
            title="Advanced Firefly Communication",
            instructor=self.instructor
        )

        # Create the course we will update
        target_course = self.create_basic_course(
            course_code="MYST-101",
            title="Advanced Unicorn Grooming",
            instructor=self.instructor
        )

        # Simulate incoming update data
        update_data = {
            "course_code": target_course.course_code,
            "title": target_course.title,
            "description": target_course.description,
            "description_full": target_course.description_full,
            "instructor_id": str(self.instructor.id),
            "start_date": str(target_course.start_date),
            "end_date": str(target_course.end_date),
            "syllabus_url": target_course.syllabus_url,
            "course_fee": str(target_course.course_fee),
            "prerequisites": [
                str(prereq1.course_code),
                str(prereq2.course_code),
            ]
        }
        
        # Deserialize and validate
        serializer = CourseSerializer(target_course, data=update_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Save and manually set prerequisites after save
        course = serializer.save()
        prereq_ids = update_data["prerequisites"]
        course.prerequisites = prereq_ids

        # Assertions
        self.assertEqual(len(course.prerequisites), 2)
        self.assertIn(prereq1.course_code, course.prerequisites)
        self.assertIn(prereq2.course_code, course.prerequisites)


    def test_update_course_assign_instructor(self):
        """Test updating a course to assign an instructor."""

        dummy_instructor = Instructor.objects.create(
            name_first="Temp",
            name_last="Instructor",
            email="temp.instructor@example.com"
        )

        course = Course.objects.create(
            course_code="NOINSTR-001",
            title="Course with No Instructor",
            description="A course initially without an instructor",
            description_full="Full course details",
            start_date="2025-01-01",
            end_date="2025-02-01",
            course_fee=500.00,
            instructor=dummy_instructor
        )

        # Create a new instructor
        new_instructor = Instructor.objects.create(
            name_first="New",
            name_last="Instructor",
            email="new.instructor@example.com"
        )

        # Simulate incoming update data
        update_data = {
            "course_code": course.course_code,
            "title": course.title,
            "description": course.description,
            "description_full": course.description_full,
            "instructor_id": str(new_instructor.id),
            "start_date": str(course.start_date),
            "end_date": str(course.end_date),
            "course_fee": str(course.course_fee),
            "syllabus_url": course.syllabus_url,
            "prerequisites": [],
        }

        # Deserialize and validate
        serializer = CourseSerializer(course, data=update_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Save
        updated_course = serializer.save()

        if "instructor_id" in update_data:
            updated_course.instructor = Instructor.objects.get(id=update_data["instructor_id"])
            updated_course.save()

        # Assertions
        self.assertEqual(updated_course.instructor.id, new_instructor.id)        

    def test_update_course_change_prereqs(self):
        """Test updating a course to change its prerequisites."""
        # Create prerequisite courses
        prereq1 = self.create_basic_course(
            course_code="PRE-201",
            title="Basic Unicorn Grooming",
            instructor=self.instructor
        )
        prereq2 = self.create_basic_course(
            course_code="PRE-202",
            title="Advanced Unicorn Grooming",
            instructor=self.instructor
        )

        # Create the course we will update
        target_course = self.create_basic_course(
            course_code="MYST-201",
            title="Advanced Unicorn Grooming",
            instructor=self.instructor
        )

        # Simulate incoming update data
        update_data = {
            "course_code": target_course.course_code,
            "title": target_course.title,
            "description": target_course.description,
            "description_full": target_course.description_full,
            "instructor_id": str(self.instructor.id),
            "start_date": str(target_course.start_date),
            "end_date": str(target_course.end_date),
            "syllabus_url": target_course.syllabus_url,
            "course_fee": str(target_course.course_fee),
            "prerequisites": [
                str(prereq1.course_code),
                str(prereq2.course_code),
            ]
        }

        # Deserialize and validate
        serializer = CourseSerializer(target_course, data=update_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Save and manually set prerequisites after save
        course = serializer.save()
        chk = Course.objects.get(id=course.id)

        # Assertions
        self.assertEqual(len(chk.prerequisites), 2)
        self.assertIn(prereq1.course_code, chk.prerequisites)
        self.assertIn(prereq2.course_code, chk.prerequisites)


# Additional serializer tests
class InstructorSerializerTests(TestCase):
    def test_serialize_instructor(self):
        instructor = Instructor.objects.create(
            name_first="Alice",
            name_last="Wonderland",
            email="alice@example.com"
        )
        serializer = InstructorSerializer(instructor)
        data = serializer.data
        self.assertEqual(data["name_first"], "Alice")
        self.assertEqual(data["name_last"], "Wonderland")
        self.assertEqual(data["email"], "alice@example.com")


class CourseListSerializerTests(TestCase):
    def test_course_list_serializer_fields(self):
        instructor = Instructor.objects.create(
            name_first="John",
            name_last="Doe",
            email="john.doe@example.com"
        )
        course = Course.objects.create(
            course_code="TEST-101",
            title="Test Course",
            description="Short",
            description_full="Full desc",
            instructor=instructor,
            start_date="2025-01-01",
            end_date="2025-02-01",
            course_fee=300.00,
            prerequisites=["PREREQ-1"],
            syllabus_url="https://example.com/syllabus.pdf"
        )
        serializer = CourseListSerializer(course)
        data = serializer.data
        self.assertEqual(data["instructor_name"], "John Doe")
        self.assertEqual(data["enrollment_count"], 0)
        self.assertEqual(data["prerequisites"], ["PREREQ-1"])


class StudentSerializerTests(TestCase):
    def test_student_serializer(self):
        student = Student.objects.create(
            name_first="Jane",
            name_last="Smith",
            email="jane@example.com"
        )
        serializer = StudentSerializer(student)
        data = serializer.data
        self.assertEqual(data["name_first"], "Jane")
        self.assertEqual(data["name_last"], "Smith")
        self.assertEqual(data["email"], "jane@example.com")


class RegistrationSerializerTests(TestCase):
    def test_registration_serializer(self):
        instructor = Instructor.objects.create(
            name_first="Greg",
            name_last="Oracle",
            email="greg@example.com"
        )
        course = Course.objects.create(
            course_code="GEM-101",
            title="Gem Handling",
            description="Sparkles",
            description_full="Advanced sparkle handling",
            instructor=instructor,
            start_date="2025-01-01",
            end_date="2025-02-01",
            course_fee=200.00,
            prerequisites=[],
            syllabus_url=""
        )
        student = Student.objects.create(
            name_first="Frodo",
            name_last="Baggins",
            email="frodo@shire.net"
        )
        registration = Registration.objects.create(
            student=student,
            course=course,
            registration_status="confirmed",
            payment_status="paid"
        )
        serializer = RegistrationSerializer(registration)
        data = serializer.data
        self.assertEqual(data["student_name"], "Frodo Baggins")
        self.assertEqual(data["course_name"], "Gem Handling")
        self.assertEqual(data["registration_status"], "confirmed")
        self.assertEqual(data["payment_status"], "paid")