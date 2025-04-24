# CRM Project

A lightweight CRM (Customer Relationship Management) platform built with:

- **Django + Django REST Framework** for the backend API
- **Remix + TypeScript + Tailwind CSS** for the frontend
- Designed for managing students, courses, instructors, and registrations
- Demo-friendly layout with modular, modern code structure

---

## 📦 Project Structure

```
crm-app/
├── packages/
│   ├── backend-django/   # Django REST Framework API
│   └── frontend-remix/   # Remix frontend with React, Tailwind, and TS
└── README.md             # You're here!
```

---

## 🧱 Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd packages/backend-django
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv env
   source env/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations and load sample data:
   ```bash
   cd src
   python manage.py migrate
   python manage.py reset_database
   ```

5. Start the server:
   ```bash
   python manage.py runserver 8080
   ```

---

## 🎨 Frontend Setup (Remix)

1. Navigate to the frontend directory:
   ```bash
   cd packages/frontend-remix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🌐 Development Notes

- `.env` files control backend API URL and Remix environment.
- Components are modular and grouped by domain: forms, lists, UI.
- API logic lives in `app/lib/api/` and is fully abstracted from routes.

---

## 🚀 License

This project is licensed for portfolio and learning use.
