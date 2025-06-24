
# Task Scheduler App

A simple and intuitive task scheduler built using **React** for the frontend and **Django REST Framework** for the backend. Users can create, update, and delete tasks on a calendar UI, with features like OTP-based signup, validation, and task completion tracking.

---

## Features

* User Authentication with OTP-based email verification
* Calendar UI to view tasks for any selected date
* Mark tasks as complete/incomplete
* Edit or delete tasks (only if not completed)
* Validation to prevent:

  * Duplicate task names on the same date
  * Empty or whitespace-only task names
  * Creating/editing tasks in the past
* Resend OTP support
* Responsive UI: Calendar on top for mobile, split view for desktop

---

## Project Structure

### Frontend (React)

* `src/`

  * `components/`

    * `CalendarView.jsx` – Main calendar and task display
    * `TaskModal.jsx` – Modal for creating and editing tasks
    * `OtpModal.jsx` – OTP verification modal
  * `pages/`

    * `HomePage.jsx` – Main dashboard
    * `Signup.jsx` / `Login.jsx` – Authentication pages
  * `endpoints/user_api.js` – Axios API calls
* Tailwind CSS for styling

### Backend (Django)

* `api/views.py`

  * `Register`, `VerifyOtp`, `ResendOtp` – Authentication views
  * `TaskViewSet` – CRUD operations for tasks
* `utils.py` – OTP generation, email sending, Redis cache management

---

## Tech Stack

* **Frontend:** React, Tailwind CSS, Formik + Yup, React-Calendar, Axios
* **Backend:** Django, Django REST Framework, Redis, SMTP (Email), Django CORS
* **Database:** PostgreSQL or SQLite
* **Others:** React Toastify for notifications

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Arjuna8546/task-sheduler.git
cd task-scheduler
```

### 2. Backend Setup (Django)

```bash
cd backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt

# Set environment variables in .env (email config, Redis, etc.)

python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables Sample (Backend)

Create a `.env` file in your backend directory with the following content:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-app-password
REDIS_URL=redis://localhost:6379
```

---

## How It Works

* On signup, an OTP is generated and emailed to the user.
* The OTP is stored in Redis with a 5-minute expiration time.
* Users must verify the OTP to complete registration.
* After logging in:

  * Users can add tasks via a modal form with validation.
  * Tasks are shown in a calendar, color-coded by completion status.
  * Completed tasks cannot be edited or deleted.

---
