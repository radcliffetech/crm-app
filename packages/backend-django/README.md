# Django CRM Backend

This is the backend API for the CRM Application, built using Django Rest Framework (DRF).

## Quickstart

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Load sample data
python manage.py reset_database

# Run development server
python manage.py runserver 8080
```

## Running Tests

```bash
# Run unit tests
coverage run manage.py test

# View coverage report
coverage report

# (Optional) Generate HTML coverage report
coverage html
open htmlcov/index.html
```

✅ Test coverage: **100%**

Continuous Integration is configured via GitHub Actions to enforce 100% coverage on all pull requests.

## Features

- API endpoints for managing Students, Instructors, Courses, and Registrations.
- Advanced search functionality for users, courses, and registrations.
- Registration with prerequisite checking.
- Dashboard summary API (students, instructors, courses, registrations counts).
- Fully tested sample suite for all models, serializers, and views.

---

> This is a sample backend for demonstration purposes.
