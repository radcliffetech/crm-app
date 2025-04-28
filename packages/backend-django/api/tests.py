

from django.test import TestCase

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