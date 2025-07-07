# AgriSaarthi
Collage sem -4 python + fsd project.



## 🚀 Agrisaarthi – Farmer Assistant Platform

**Agrisaarthi** is a smart agriculture web platform built to empower farmers by giving them real-time crop price information, tomorrow’s price predictions using AI models, and up-to-date government schemes tailored for their region and crop. The goal is to reduce farmer losses, improve decision-making, and provide a digital assistant that bridges the gap between technology and agriculture.

This full-stack project is built using:

* **React.js** for a responsive and clean frontend UI
* **Tailwind CSS** for utility-first styling
* **Django** for backend logic and database management
* **Express.js + Next.js** for API service routing and middle-layer processing
* **Python (scikit-learn, pandas, etc.)** for ML model integration and predictions

---

### 🛠️ Step 1: Farmer Authentication System

The first step in building Agrisaarthi is implementing a secure **authentication system** for farmers. This enables each farmer to create an account, log in securely, and access personalized data like crop preferences, saved schemes, and prediction history.

#### ✅ Objectives:

* Create a custom user model (`Farmer`) using Django
* Build RESTful APIs for registration and login using Django REST Framework
* Secure token-based authentication using `TokenAuthentication`
* Design a simple React-based frontend form for sign up & login
* Store tokens in `localStorage` for authenticated user sessions

#### 🔧 Technologies Used in this Step:

* Django REST Framework (API and token auth)
* React.js with Axios for API calls
* Tailwind CSS for clean and responsive form styling

#### 📂 Directory Setup:

```
agrisaarthi/
├── backend/
│   ├── farmers/       ← Authentication app
│   └── settings.py    ← Use custom user model
├── frontend/
│   ├── pages/Auth.js  ← React page for login/signup
│   └── App.jsx
```

---

### ✅ Outcome:

At the end of this step, the platform will have a working **login/signup system** with token-based authentication, allowing farmers to securely access their data and begin using Agrisaarthi.

Let’s build! 🌱

---

Let me know if you want a version tailored for README.md or GitHub issues format!
