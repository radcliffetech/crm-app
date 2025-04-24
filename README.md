# CRM Project - Massaschussets Institute for Integrated Metaphysics

An example of a lightweight CRM (Customer Relationship Management) platform built with:

- **Django + Django REST Framework** for the backend API
- **Remix + TypeScript + Tailwind CSS** for the frontend
- Designed for managing students, courses, instructors, and registrations
- Demo-friendly layout with modular, modern code structure

### About the MiiM

MiiM is a fictional institute created for the purpose of this project, a mix of MIT, Miskatonic U, and Hogwarts. It serves as an abstact placeholder for a real-world organization. 

MiiM is a university located mostly in the New England of the US, and usually now. Go Flaming Eyes!

### About this Repo

This is a sample Customer Relationship Management (CRM) application developed as part of a software engineering portfolio. It demonstrates full-stack development skills using TypeScript, React, Remix, and Firebase.

---

## 📦 Project Structure

```
crm-app/
├── packages/
│   ├── backend-django/   # Django REST Framework API 
│   └── frontend-remix/   # Remix frontend with React, Tailwind, and TS
└── README.md             
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

## To-Do List 

- Add multiple user types (Admin, Faculty, Students)
- Simple Payments System
- CRM Messaging
- Course Materials -> Course Catalog