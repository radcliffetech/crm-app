from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Instructor, Course, Student, Registration


# ----------------- Registration Tests -----------------
class RegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Instructor and courses for prereq/registration tests
        self.instructor = Instructor.objects.create(
            name_first="Prof",
            name_last="Oak",
            email="oak@pallet.com"
        )
        self.prereq_course = Course.objects.create(
            course_code="BASICS-101",
            title="Basics",
            description="Basics",
            description_full="Basics of Basics",
            instructor=self.instructor,
            start_date="2025-01-01",
            end_date="2025-03-01",
            course_fee=100.00
        )
        self.advanced_course = Course.objects.create(
            course_code="ADV-202",
            title="Advanced Topics",
            description="Advanced",
            description_full="Advanced Content",
            instructor=self.instructor,
            start_date="2025-04-01",
            end_date="2025-06-01",
            course_fee=200.00,
            prerequisites=[self.prereq_course.course_code]
        )
        self.student = Student.objects.create(
            name_first="Ash",
            name_last="Ketchum",
            email="ash@pallet.com"
        )

    # Registration prereq and blocking
    def test_block_registration_missing_prereq(self):
        url = "/api/registrations/register/"
        data = {
            "student_id": str(self.student.id),
            "course_id": str(self.advanced_course.id),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("missing required prerequisites", response.data["error"])

    def test_allow_registration_with_prereqs(self):
        prereq_course2 = Course.objects.create(
            course_code="BASICS-102",
            title="More Basics",
            description="Basics Continued",
            description_full="Continued Basics",
            instructor=self.instructor,
            start_date="2025-02-01",
            end_date="2025-03-15",
            course_fee=120.00
        )
        self.advanced_course.prerequisites = [self.prereq_course.course_code, prereq_course2.course_code]
        self.advanced_course.save()
        Registration.objects.create(
            student=self.student,
            course=self.prereq_course,
            registration_status="registered",
            payment_status="completed"
        )
        Registration.objects.create(
            student=self.student,
            course=prereq_course2,
            registration_status="registered",
            payment_status="completed"
        )
        url = "/api/registrations/register/"
        data = {
            "student_id": str(self.student.id),
            "course_id": str(self.advanced_course.id),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Student registered successfully.")

    def test_block_registration_with_partial_prereqs(self):
        prereq_course2 = Course.objects.create(
            course_code="BASICS-102",
            title="More Basics",
            description="Basics Continued",
            description_full="Continued Basics",
            instructor=self.instructor,
            start_date="2025-02-01",
            end_date="2025-03-15",
            course_fee=120.00
        )
        self.advanced_course.prerequisites = [self.prereq_course.course_code, prereq_course2.course_code]
        self.advanced_course.save()
        Registration.objects.create(
            student=self.student,
            course=self.prereq_course,
            registration_status="registered",
            payment_status="completed"
        )
        url = "/api/registrations/register/"
        data = {
            "student_id": str(self.student.id),
            "course_id": str(self.advanced_course.id),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("missing required prerequisites", response.data["error"])

    # Unregistration setup
    def _setup_unregistration(self):
        self.instructor2 = Instructor.objects.create(
            name_first="Satoshi",
            name_last="Tajiri",
            email="satoshi@pokemon.com"
        )
        self.course2 = Course.objects.create(
            course_code="POKEMON-101",
            title="Intro to Pokemon",
            description="Basics",
            description_full="Full Pokemon Training",
            instructor=self.instructor2,
            start_date="2025-01-01",
            end_date="2025-06-01",
            course_fee=150.00
        )
        self.student2 = Student.objects.create(
            name_first="Misty",
            name_last="Waterflower",
            email="misty@cerulean.com"
        )
        self.registration2 = Registration.objects.create(
            student=self.student2,
            course=self.course2,
            registration_status="registered",
            payment_status="completed"
        )

    def test_successful_unregister(self):
        self._setup_unregistration()
        url = "/api/registrations/unregister/"
        data = {
            "student_id": str(self.student2.id),
            "course_id": str(self.course2.id),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Student unregistered successfully.")
        self.registration2.refresh_from_db()
        self.assertEqual(self.registration2.registration_status, "cancelled")

    def test_unregister_missing_fields(self):
        self._setup_unregistration()
        url = "/api/registrations/unregister/"
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("student_id and course_id are required", response.data["error"])

    def test_unregister_nonexistent(self):
        self._setup_unregistration()
        self.registration2.delete()
        url = "/api/registrations/unregister/"
        data = {
            "student_id": str(self.student2.id),
            "course_id": str(self.course2.id),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 404)
        self.assertIn("Registration not found", response.data["error"])

    def _setup_cancelled(self):
        self.instructor3 = Instructor.objects.create(
            name_first="Brock",
            name_last="Pewter",
            email="brock@pewtergym.com"
        )
        self.course3 = Course.objects.create(
            course_code="GYM-101",
            title="Gym Leader Basics",
            description="How to run a Gym",
            description_full="Full Guide",
            instructor=self.instructor3,
            start_date="2025-01-01",
            end_date="2025-06-01",
            course_fee=300.00
        )
        self.student3 = Student.objects.create(
            name_first="Gary",
            name_last="Oak",
            email="gary@pallet.com"
        )
        self.registration3 = Registration.objects.create(
            student=self.student3,
            course=self.course3,
            registration_status="cancelled",
            payment_status="failed"
        )

    def test_unregister_already_cancelled(self):
        self._setup_cancelled()
        url = "/api/registrations/unregister/"
        data = {
            "student_id": str(self.student3.id),
            "course_id": str(self.course3.id),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 404)
        self.assertIn("Registration not found", response.data["error"])

    def test_reregister_after_cancelled(self):
        self._setup_cancelled()
        url = "/api/registrations/register/"
        data = {
            "student_id": str(self.student3.id),
            "course_id": str(self.course3.id),
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Student registered successfully.")
        url = "/api/registrations/unregister/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Student unregistered successfully.")
        self.registration3.refresh_from_db()
        self.assertEqual(self.registration3.registration_status, "cancelled")
        url = "/api/registrations/register/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Student registered successfully.")
        assert Registration.objects.filter(
            student=self.student3,
            course=self.course3,
            registration_status="registered"
        ).exists()

    # Registration/register/unregister edge cases
    def test_register_missing_student_id(self):
        url = "/api/registrations/register/"
        response = self.client.post(url, {"course_id": "1234"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("student_id and course_id are required", response.data["error"])

    def test_register_missing_course_id(self):
        url = "/api/registrations/register/"
        response = self.client.post(url, {"student_id": "1234"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("student_id and course_id are required", response.data["error"])

    def test_unregister_missing_student_id(self):
        url = "/api/registrations/unregister/"
        response = self.client.post(url, {"course_id": "1234"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("student_id and course_id are required", response.data["error"])

    def test_unregister_missing_course_id(self):
        url = "/api/registrations/unregister/"
        response = self.client.post(url, {"student_id": "1234"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("student_id and course_id are required", response.data["error"])

    def test_register_500_error_when_course_not_found(self):
        # Also covers registration 500 error for missing course
        self.instructor4 = Instructor.objects.create(
            name_first="Koga",
            name_last="Fuchsia",
            email="koga@ninjalab.com"
        )
        self.student4 = Student.objects.create(
            name_first="Janine",
            name_last="Fuchsia",
            email="janine@ninjalab.com"
        )
        bad_course_id = "00000000-0000-0000-0000-000000000000"
        url = "/api/registrations/register/"
        data = {
            "student_id": str(self.student4.id),
            "course_id": bad_course_id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.data)


# ----------------- Course Tests -----------------
class CourseTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.instructor = Instructor.objects.create(
            name_first="Koga",
            name_last="Fuchsia",
            email="koga@ninjalab.com"
        )
        self.student = Student.objects.create(
            name_first="Janine",
            name_last="Fuchsia",
            email="janine@ninjalab.com"
        )
        self.course = Course.objects.create(
            course_code="NINJA-101",
            title="Ninja Training",
            description="Stealth and speed",
            description_full="How to disappear and reappear",
            instructor=self.instructor,
            start_date="2025-01-01",
            end_date="2025-12-31",
            course_fee=600.00
        )
        self.registration = Registration.objects.create(
            student=self.student,
            course=self.course,
            registration_status="registered",
            payment_status="completed"
        )
        # For course search
        self.instructor2 = Instructor.objects.create(
            name_first="Alan",
            name_last="Turing",
            email="alan@math.org"
        )
        self.student2 = Student.objects.create(
            name_first="Ada",
            name_last="Lovelace",
            email="ada@math.org"
        )
        self.course2 = Course.objects.create(
            course_code="CS123",
            title="Comp Sci",
            description="Basics",
            description_full="Details",
            instructor=self.instructor2,
            start_date="2025-01-01",
            end_date="2025-06-01",
            course_fee=999.00
        )
        Registration.objects.create(
            student=self.student2,
            course=self.course2,
            registration_status="registered",
            payment_status="completed"
        )

    def test_block_instructor_destroy_with_active_courses(self):
        url = f"/api/instructors/{self.instructor.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Cannot delete instructor with active or upcoming courses.", response.data["error"])

    def test_block_student_destroy_with_active_registrations(self):
        url = f"/api/students/{self.student.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Cannot delete student with active or upcoming course registrations.", response.data["error"])

    def test_registration_soft_delete(self):
        url = f"/api/registrations/{self.registration.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.registration.refresh_from_db()
        self.assertFalse(self.registration.is_active)

    def test_course_destroy_blocked_by_registrations(self):
        url = f"/api/courses/{self.course.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Cannot delete course with existing student registrations.", response.data["error"])

    def test_search_returns_courses(self):
        url = reverse("search-all")
        response = self.client.get(url, {"q": "Ada"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["students"]), 1)
        self.assertEqual(response.data["students"][0]["email"], "ada@math.org")

    def test_course_list_uses_course_list_serializer(self):
        url = "/api/courses/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(all("course_code" in course for course in response.data))

    def test_course_filter_active_courses(self):
        url = "/api/courses/?active_courses=true"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_course_filter_by_instructor_id(self):
        url = f"/api/courses/?instructor_id={self.instructor2.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_course_filter_active_courses_no_matches(self):
        Course.objects.all().delete()  # Clean out any other test courses
        self.course = Course.objects.create(
            course_code="PAST-101",
            title="Old Course",
            description="Previously active course",
            description_full="Old full description",
            instructor=self.instructor,
            start_date="2022-01-01",
            end_date="2022-06-01",
            course_fee=500.00
        )
        url = "/api/courses/?active_courses=true"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)


# ----------------- Student Tests -----------------
class StudentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.instructor = Instructor.objects.create(
            name_first="Lt.",
            name_last="Surge",
            email="surge@vermillion.com"
        )
        self.student = Student.objects.create(
            name_first="Eevee",
            name_last="Trainer",
            email="eevee@kanto.com"
        )
        self.course = Course.objects.create(
            course_code="ELEC-101",
            title="Electric Mastery",
            description="Harness electric powers",
            description_full="Electric techniques",
            instructor=self.instructor,
            start_date="2025-04-01",
            end_date="2025-10-01",
            course_fee=500.00
        )
        Registration.objects.create(
            student=self.student,
            course=self.course,
            registration_status="registered",
            payment_status="completed"
        )

    def test_student_filter_by_course_id(self):
        url = f"/api/students/?course_id={self.course.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_student_filter_by_course_id_eligible(self):
        url = f"/api/students/?course_id={self.course.id}&eligible=true"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_student_filter_by_instructor_id(self):
        url = f"/api/students/?instructor_id={self.instructor.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_student_filter_by_instructor_id_eligible(self):
        url = f"/api/students/?instructor_id={self.instructor.id}&eligible=true"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_student_list_no_filters(self):
        url = "/api/students/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)


# ----------------- Dashboard Tests -----------------
class DashboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.instructor = Instructor.objects.create(
            name_first="Sabrina",
            name_last="Psychic",
            email="sabrina@psychicgym.com"
        )
        self.course = Course.objects.create(
            course_code="PSY-101",
            title="Psychic Abilities",
            description="Harness your mind",
            description_full="Mastering psychic powers",
            instructor=self.instructor,
            start_date="2025-02-01",
            end_date="2025-08-01",
            course_fee=500.00
        )
        self.student = Student.objects.create(
            name_first="Blue",
            name_last="Oak",
            email="blue@pallet.com"
        )
        self.registration = Registration.objects.create(
            student=self.student,
            course=self.course,
            registration_status="registered",
            payment_status="completed"
        )
        self.instructor2 = Instructor.objects.create(
            name_first="Erika",
            name_last="Celadon",
            email="erika@celadon.com"
        )
        self.course2 = Course.objects.create(
            course_code="PLANT-101",
            title="Plants and Pokemon",
            description="Botany and Training",
            description_full="Advanced Botany",
            instructor=self.instructor2,
            start_date="2025-03-01",
            end_date="2025-09-01",
            course_fee=400.00
        )
        self.student2 = Student.objects.create(
            name_first="Red",
            name_last="Trainer",
            email="red@indigo.com"
        )
        self.registration2 = Registration.objects.create(
            student=self.student2,
            course=self.course2,
            registration_status="registered",
            payment_status="completed"
        )

    def test_dashboard_counts_correct(self):
        url = reverse("dashboard-summary")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["studentCount"], 2)
        self.assertEqual(response.data["instructorCount"], 2)
        self.assertEqual(response.data["courseCount"], 2)
        self.assertEqual(response.data["registrationCount"], 2)

    def test_dashboard_counts_after_inactive_objects(self):
        self.student.is_active = False
        self.student.save()
        self.instructor.is_active = False
        self.instructor.save()
        self.course.is_active = False
        self.course.save()
        self.registration.is_active = False
        self.registration.save()
        url = reverse("dashboard-summary")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["studentCount"], 1)
        self.assertEqual(response.data["instructorCount"], 1)
        self.assertEqual(response.data["courseCount"], 1)
        self.assertEqual(response.data["registrationCount"], 1)


# ----------------- Search Tests -----------------
class SearchTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.instructor = Instructor.objects.create(
            name_first="Erika",
            name_last="Celadon",
            email="erika@celadon.com"
        )
        self.course = Course.objects.create(
            course_code="PLANT-101",
            title="Plants and Pokemon",
            description="Botany and Training",
            description_full="Advanced Botany",
            instructor=self.instructor,
            start_date="2025-03-01",
            end_date="2025-09-01",
            course_fee=400.00
        )
        self.student = Student.objects.create(
            name_first="Red",
            name_last="Trainer",
            email="red@indigo.com"
        )
        self.registration = Registration.objects.create(
            student=self.student,
            course=self.course,
            registration_status="registered",
            payment_status="completed"
        )

    def test_search_student_by_name(self):
        url = reverse("search-all")
        response = self.client.get(url, {"q": "Red"})
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data["students"]), 1)
        self.assertEqual(response.data["students"][0]["email"], "red@indigo.com")

    def test_search_instructor_by_email(self):
        url = reverse("search-all")
        response = self.client.get(url, {"q": "erika@celadon.com"})
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data["instructors"]), 1)
        self.assertEqual(response.data["instructors"][0]["email"], "erika@celadon.com")

    def test_search_course_by_title(self):
        url = reverse("search-all")
        response = self.client.get(url, {"q": "Plants"})
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data["courses"]), 1)
        self.assertEqual(response.data["courses"][0]["course_code"], "PLANT-101")

    def test_search_registration_by_status(self):
        url = reverse("search-all")
        response = self.client.get(url, {"q": "registered"})
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data["registrations"]), 1)
        self.assertEqual(response.data["registrations"][0]["registration_status"], "registered")

    def test_search_no_results(self):
        url = reverse("search-all")
        response = self.client.get(url, {"q": "NonExistentName"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["students"]), 0)
        self.assertEqual(len(response.data["instructors"]), 0)
        self.assertEqual(len(response.data["courses"]), 0)
        self.assertEqual(len(response.data["registrations"]), 0)

    def test_search_missing_query_parameter(self):
        url = reverse("search-all")
        response = self.client.get(url)  # No "q" parameter provided
        self.assertEqual(response.status_code, 400)
        self.assertIn("Missing search query parameter", response.data["error"])