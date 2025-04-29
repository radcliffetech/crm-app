from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from api.models import Instructor, Course, Student, Registration

class DashboardViewTests(APITestCase):
    def test_dashboard_summary(self):
        url = reverse("dashboard-summary")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("studentCount", response.data)
        self.assertIn("instructorCount", response.data)
        self.assertIn("courseCount", response.data)
        self.assertIn("registrationCount", response.data)

class SearchAllViewTests(APITestCase):
    def setUp(self):
        self.instructor = Instructor.objects.create(
            name_first="Alan",
            name_last="Turing",
            email="alan@math.org"
        )
        self.student = Student.objects.create(
            name_first="Ada",
            name_last="Lovelace",
            email="ada@math.org"
        )
        self.course = Course.objects.create(
            course_code="CS123",
            title="Comp Sci",
            description="Basics",
            description_full="Details",
            instructor=self.instructor,
            start_date="2025-01-01",
            end_date="2025-06-01",
            course_fee=999.00
        )
        Registration.objects.create(
            student=self.student,
            course=self.course,
            registration_status="registered",
            payment_status="completed"
        )

    def test_search_all_returns_results(self):
        url = reverse("search-all")
        response = self.client.get(url, {"q": "Ada"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["students"]), 1)
        self.assertEqual(response.data["students"][0]["email"], "ada@math.org")
