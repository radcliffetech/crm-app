from django.test import TestCase
from api.serializers import CourseSerializer
from api.models import Instructor

class CRMTests(TestCase):
    def test_instructors_endpoint(self):
        """Test that the instructors endpoint returns HTTP 200 OK."""
        response = self.client.get("/api/instructors/")
        self.assertEqual(response.status_code, 200)

    def test_courses_endpoint(self):
        """Test that the courses endpoint returns HTTP 200 OK."""
        response = self.client.get("/api/courses/")
        self.assertEqual(response.status_code, 200)

    def test_students_endpoint(self):
        """Test that the students endpoint returns HTTP 200 OK."""
        response = self.client.get("/api/students/")
        self.assertEqual(response.status_code, 200)

    def test_registrations_endpoint(self):
        """Test that the registrations endpoint returns HTTP 200 OK."""
        response = self.client.get("/api/registrations/")
        self.assertEqual(response.status_code, 200)

    def test_dashboard_summary_endpoint(self):
        """Test that the dashboard summary endpoint returns HTTP 200 OK."""
        response = self.client.get("/api/dashboard-summary/")
        self.assertEqual(response.status_code, 200)

    def test_search_all_endpoint(self):
        """Test that the search-all endpoint returns HTTP 200 OK."""
        response = self.client.get("/api/search/?q=test")
        self.assertEqual(response.status_code, 200)

    def test_instructors_empty_list(self):
        """Test that the instructors list is empty initially (no instructors in database)."""
        response = self.client.get("/api/instructors/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(),  {'count': 0, 'next': None, 'previous': None, 'results': []})

    def test_create_instructor(self):
        """Test creating a new instructor via POST request."""
        data = {
            "name_first": "John",
            "name_last": "Doe",
            "email": "john.doe@example.com"
        }
        response = self.client.post("/api/instructors/", data, content_type="application/json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["name_first"], "John")

    def test_search_returns_structure(self):
        """Test that the search endpoint returns the expected top-level keys even when no results."""
        response = self.client.get("/api/search/?q=nonexistent")
        self.assertEqual(response.status_code, 200)
        self.assertIn("instructors", response.json())
        self.assertIn("courses", response.json())
        self.assertIn("students", response.json())




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

        # Now create a new course with that prerequisite
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
            "prerequisites": [str(prereq_course.id)]
        }
        serializer = CourseSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        course = serializer.save()
        course.prerequisites.set(data["prerequisites"])

        self.assertEqual(course.course_code, "TEST-201")
        self.assertEqual(course.instructor, self.instructor)
        self.assertEqual(course.prerequisites.count(), 1)
        self.assertEqual(str(course.prerequisites.first().id), str(prereq_course.id))

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
                str(prereq1.id),
                str(prereq2.id),
            ]
        }
        
        # Deserialize and validate
        serializer = CourseSerializer(target_course, data=update_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Save and manually set prerequisites after save
        course = serializer.save()
        prereq_ids = update_data["prerequisites"]
        course.prerequisites.set(prereq_ids)

        # Assertions
        self.assertEqual(course.prerequisites.count(), 2)
        self.assertIn(prereq1, course.prerequisites.all())
        self.assertIn(prereq2, course.prerequisites.all())


    def test_update_course_assign_instructor(self):
        """Test updating a course to assign an instructor."""
        # Create a course with a temporary instructor instead of None
        from api.models import Course

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