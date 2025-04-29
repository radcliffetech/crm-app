

from django.test import TestCase
from api.models import Department, Address, Instructor, Course, Student, Registration


class DepartmentModelTests(TestCase):
    def test_create_department(self):
        dept = Department.objects.create(name="Engineering", description="Engineering Dept")
        self.assertEqual(str(dept), "Engineering")


class AddressModelTests(TestCase):
    def test_create_address(self):
        address = Address.objects.create(
            street="123 Main St",
            city="Townsville",
            state="MA",
            postal_code="12345",
            country="USA"
        )
        self.assertIn("123 Main St", str(address))


class InstructorModelTests(TestCase):
    def test_create_instructor(self):
        dept = Department.objects.create(name="Physics")
        address = Address.objects.create(
            street="456 Elm St",
            city="Newton",
            state="MA",
            postal_code="67890",
            country="USA"
        )
        instructor = Instructor.objects.create(
            name_first="Marie",
            name_last="Curie",
            email="marie@science.org",
            department=dept,
            address=address
        )
        self.assertEqual(str(instructor), "Marie Curie")


class CourseModelTests(TestCase):
    def test_create_course(self):
        instructor = Instructor.objects.create(
            name_first="Alan",
            name_last="Turing",
            email="alan@computing.com"
        )
        course = Course.objects.create(
            course_code="CS50",
            title="Intro to CS",
            description="Basics",
            description_full="Full curriculum",
            instructor=instructor,
            start_date="2025-01-01",
            end_date="2025-02-01",
            course_fee=1000.00
        )
        self.assertEqual(str(course), "Intro to CS")


class StudentModelTests(TestCase):
    def test_create_student(self):
        student = Student.objects.create(
            name_first="Ada",
            name_last="Lovelace",
            email="ada@math.net"
        )
        self.assertEqual(str(student), "Ada Lovelace")


class RegistrationModelTests(TestCase):
    def test_create_registration(self):
        instructor = Instructor.objects.create(
            name_first="Grace",
            name_last="Hopper",
            email="grace@navy.mil"
        )
        course = Course.objects.create(
            course_code="NAVY-101",
            title="Compiling Code",
            description="Assembly",
            description_full="Naval applications of computing",
            instructor=instructor,
            start_date="2025-03-01",
            end_date="2025-04-01",
            course_fee=500.00
        )
        student = Student.objects.create(
            name_first="Tim",
            name_last="Berners-Lee",
            email="tim@web.org"
        )
        reg = Registration.objects.create(student=student, course=course)
        self.assertIn("Tim Berners-Lee", str(reg))