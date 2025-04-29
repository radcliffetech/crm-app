# API Test Suite Overview

This directory contains a **sample test suite** for the Django REST API layer of the CRM application. These tests provide coverage for the core components of the system, including:

- **Models:** Basic object creation and `__str__` method verification for all main entities.
- **Serializers:** Unit tests for all serializer classes, ensuring field correctness, data transformation, and computed properties.
- **Views:** API endpoint tests for dashboard summary and search functionality, verifying correct responses and query behavior.

> Note: This test suite is designed for demonstration purposes. It provides good foundational coverage but is not exhaustive.

## Running Tests

You can run the tests using Django's test runner:

```bash
python manage.py test api.tests
```

Or if you're using `pytest`:

```bash
pytest packages/backend-django/api/tests/
```

---

For full functionality, ensure the test database and any required environment settings are properly configured.
