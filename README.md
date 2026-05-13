# 🏥 UroScan AI — Intelligent X-ray Analysis & Diagnosis Support System

> **Final Year Research Project** — BSc (Hons) in Computer Science  
> University of Plymouth | NSBM Green University | 2025/2026  


---

## 📌 Project Overview

**UroScan AI** is a full-stack AI-powered medical web application designed to assist clinicians in the detection and diagnosis of urinary stones (urolithiasis) using deep learning. The system enables medical professionals to upload KUB X-ray images, perform automated two-phase AI analysis, and generate structured preliminary diagnostic reports for clinical review.

The platform supports four user roles — Doctor, Patient, Staff, and Admin — each with a dedicated portal and workflow.

> ⚠️ **Disclaimer:** This system is a clinical **decision support tool only**. All AI-generated results must be reviewed and confirmed by a qualified medical professional. This system does not replace clinical diagnosis.

---

## 🤖 AI Model Performance

| Phase | Model | Metric | Value |
|-------|-------|--------|-------|
| Phase 1 | EfficientNet-B0 | Validation Accuracy | **94.59%** |
| Phase 1 | EfficientNet-B0 | Test Accuracy | **94.74%** |
| Phase 1 | EfficientNet-B0 | F1-Score | **0.95** |
| Phase 2 | YOLOv8l | Precision | **0.944** |
| Phase 2 | YOLOv8l | Recall | **0.893** |
| Phase 2 | YOLOv8l | mAP@50 | **0.927** |
| Phase 2 | YOLOv8l | mAP@50-95 | **0.628** |

---

## 🚀 Key Features

### 👨‍⚕️ Doctor Portal
- Upload KUB X-ray images (JPG, PNG)
- Two-phase AI detection (Classification → Localization)
- View annotated X-ray with bounding boxes
- Review AI-generated preliminary draft reports
- Add clinical notes, diagnosis, and advice
- Confirm or reject reports for patient access
- Manage patient records and profiles

### 🧑‍💼 Patient Portal
- View personal patient profile (ID, blood group, contact)
- Access doctor-confirmed final reports
- Read AI findings, diagnosis, and follow-up advice
- Download reports as text files

### 🏥 Staff Portal
- Create patient records using Patient ID, email, and personal details
- Schedule appointments and notify assigned doctors
- View patient records and administrative information

### 🛡️ Admin Panel
- Secure separate login (`/admin-login`)
- View system statistics (users, scans, reports)
- Manage all user accounts and roles
- View audit logs and system activity

---

## 🧠 Two-Phase AI Architecture

```
X-ray Upload
     │
     ▼
┌─────────────────────────────────┐
│  Phase 1: Classification        │
│  Model: EfficientNet-B0         │
│  Task: Normal vs Stone          │
│  Accuracy: 94.74%               │
└─────────────────┬───────────────┘
                  │ Stone Detected?
                  │ YES → Phase 2
                  │ NO  → Stop (Normal Result)
                  ▼
┌─────────────────────────────────┐
│  Phase 2: Object Detection      │
│  Model: YOLOv8l                 │
│  Task: Locate & annotate stones │
│  mAP@50: 0.927                  │
│  Training: 1698 images          │
│            4367 annotated stones│
└─────────────────┬───────────────┘
                  │
                  ▼
        AI Draft Report Generated
                  │
                  ▼
        Doctor Review & Confirm
                  │
                  ▼
        Patient Views Final Report
```

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│          React.js + Tailwind CSS + Vite                  │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTPS / REST API
                        ▼
┌──────────────────────────────────────────────────────────┐
│                 APPLICATION SERVER                       │
│             Node.js + Express.js (Port 5000)             │
│   JWT Auth │ Role Middleware │ Multer Upload │ Routes    │
└──────┬─────────────────────────────────┬─────────────────┘
       │ TCP/IP (Mongoose)               │ Child Process (spawn)
       ▼                                 ▼
┌─────────────┐                 ┌────────────────────────┐
│  MongoDB    │                 │   Python AI Engine     │
│  Atlas      │                 │   detect.py            │
│  Database   │                 │   EfficientNet-B0      │
│             │                 │   YOLOv8l              │
│  Collections│                 │   OpenCV               │
│  - users    │                 │   PyTorch              │
│  - patients │                 └────────────────────────┘
│  - reports  │
│  - xrays    │
│  - appts    │
│  - auditlogs| 
│  - notificat|
|         ions│
└─────────────┘
```

---

## 🛠️ Technologies Used

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18.x | UI Framework |
| Vite | 5.x | Build Tool |
| Tailwind CSS | 3.x | Styling |
| React Router | 6.x | Navigation |
| Axios | 1.x | HTTP Client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18.x LTS | Runtime |
| Express.js | 4.18.x | Web Framework |
| MongoDB | Atlas | Database |
| Mongoose | 8.x | ODM |
| JWT | 9.x | Authentication |
| Multer | 1.x | File Upload |
| Bcryptjs | 2.x | Password Hashing |
| Nodemailer | 6.x | Email Service |

### AI & Machine Learning
| Technology | Purpose |
|-----------|---------|
| Python 3.x | AI Engine |
| Ultralytics YOLOv8 | Stone Detection |
| EfficientNet-B0 (PyTorch) | X-ray Classification |
| OpenCV (cv2) | Image Processing |
| NumPy | Numerical Operations |
| Google Colab (NVIDIA T4) | Model Training |



---


## ⚙️ Installation & Setup

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18.x LTS | `node --version` |
| Python | 3.9+ | `python --version` |
| npm | 9.x+ | `npm --version` |
| MongoDB Atlas | Account | [cloud.mongodb.com](https://cloud.mongodb.com) |

---

### Step 1 — Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/StoneDetection-App.git
cd StoneDetection-App
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `/backend`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/test?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

Place AI model files:

```
backend/AI_Models/Detection.pt
backend/AI_Models/efficientnet_b0_kidney_stone.pth
```

> ⚠️ Model files are not included in the repository due to size limitations.  
> Contact the author or retrain using the dataset.

Install Python dependencies:

```bash
pip install ultralytics torch opencv-python-headless numpy
```

Start backend server:

```bash
npm run dev
```

✅ Server runs at: `http://localhost:5000`

---

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

✅ App runs at: `http://localhost:5173`

---

### Step 4 — Create Admin Account

```bash
cd backend
node scripts/createAdmin.js
```

```
✅ Admin created!
Email   : admin@uroscan.com
Password: Admin@2026
URL     : http://localhost:5173/admin-login
```

> ⚠️ Change the default password after first login.

---

## 🔐 User Roles & Access

| Role | Login URL | Dashboard |
|------|-----------|-----------|
| Doctor | `/login` → Doctor tab | `/doctor-dashboard` |
| Patient | `/login` → Patient tab | `/patient-dashboard` |
| Staff | `/login` → Staff tab | `/staff-dashboard` |
| Admin | `/admin-login` (separate) | `/admin-dashboard` |

### Role Registration Flow

```
1. Patient → Register at /login?mode=register&role=patient
2. Staff   → Register at /login?mode=register&role=staff
3. Doctor  → Register at /login?mode=register&role=doctor
4. Admin   → Created via script (node scripts/createAdmin.js)
```

### Staff → Patient Registration Flow

```
1. Staff first creates patient record with Patient ID, email, and details
2. Patient registers using same Patient ID and email
3. Backend links patient account to staff-created patient record
4. Patient logs in and sees profile/reports

```

---

## 📊 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/logout` | Logout | Auth |
| GET | `/api/auth/profile` | Get profile | Auth |
| GET | `/api/auth/verify` | Verify token | Auth |

### AI Analysis
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/upload` | Upload X-ray | Doctor, Staff |
| POST | `/api/predict` | Run AI analysis | Doctor |

### Reports
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/reports/draft` | Create AI draft | Doctor |
| GET | `/api/reports` | All reports | Admin |
| GET | `/api/reports/my` | Doctor's own/assigned reports |Doctor |
| GET | `/api/reports/my/final` | Patient's confirmed | Patient |
| GET | `/api/reports/:id` | Report by ID | All |
| PUT | `/api/reports/:id/confirm` | Confirm report | Doctor |
| PUT | `/api/reports/:id/reject` | Reject report | Doctor |
| DELETE | `/api/reports/:id` | Delete report | Admin |

### Patients
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/patients` | Register patient | Staff, Doctor |
| GET | `/api/patients` | All patients | Staff, Doctor |
| GET | `/api/patients/my-profile` | Own profile | Patient |
| GET | `/api/patients/:id` | Patient by ID | All |
| PUT | `/api/patients/:id` | Update patient | Staff, Doctor |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/stats` | System stats | Admin |
| GET | `/api/admin/users` | All users | Admin |
| PUT | `/api/admin/users/:id/role` | Update role | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/audit-logs` | Audit logs | Admin |

### Notifications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notifications` | Get logged-in user's notifications | Auth |
| PUT | `/api/notifications/:id/read` | Mark notification as read | Auth |
| PUT | `/api/notifications/read-all` | Mark all notifications as read | Auth |
| DELETE | `/api/notifications/:id` | Delete notification | Auth |

---

## 🔄 System Workflow

```
DOCTOR WORKFLOW:
════════════════
1. Login → Doctor Dashboard
2. View notifications for newly assigned patients/appointments
3. Upload KUB X-ray (JPG/PNG, max 5MB)
4. Enter patient information (optional)
5. Click "Run AI Diagnostic Analysis"
6. Phase 1: EfficientNet-B0 classifies scan
7. Phase 2: YOLOv8 detects & locates stones
8. View annotated X-ray + detection results
9. Review AI draft report
10. Add clinical notes, advice, follow-up
11. Confirm report → visible to patient

PATIENT WORKFLOW:
═════════════════
1. Staff creates patient record with Patient ID and email
2. Patient registers using the same Patient ID and email
3. Login → Patient Dashboard
4. View patient ID, blood group, profile info
5. View confirmed reports from doctor
6. Download report as text file
7. Read doctor advice and follow-up plan

STAFF WORKFLOW:
════════════════
1. Login → Staff Dashboard
2. Add Patient → Enter Patient ID, email, and personal details
3. Patient later creates an account using the same Patient ID and email
4. System links the login account to the staff-created patient record
5. Create appointment for a doctor
6. Doctor receives appointment notification


ADMIN WORKFLOW:
════════════════
1. Login at /admin-login
2. View system statistics
3. Manage user accounts and roles
4. Monitor audit logs
```

---

## 🔒 Security Features

- ✅ JWT-based stateless authentication (1 day expiry)
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ Role-based access control (RBAC)
- ✅ File type and size validation (5MB limit)
- ✅ CORS configuration
- ✅ Input validation (express-validator)
- ✅ Error handling middleware
- ✅ Audit logging for all actions
- ✅ Admin cannot delete own account
- ✅ Admin separate login page

---

## ▶️ Running the Application

### Start Backend

```powershell
cd backend
npm run dev
```

### Start Frontend

```powershell
cd frontend
npm run dev
```

---

## 📌 Known Limitations

1. **Image quality dependency** — Poor quality X-rays may reduce detection accuracy
2. **Stone composition** — System cannot classify stone type (e.g. uric acid vs oxalate)
3. **GPU required** — Slower inference without server-side GPU
4. **Offline mode** — Requires active internet connection
5. **X-ray only** — Does not support CT scan or MRI analysis
6. **Not clinically validated** — Academic prototype only

---


## 📦 Environment Variables Reference

### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| Home | Landing page with portal selection |
| Login | Role-based login (Doctor / Patient / Staff) |
| Admin Login | Separate secure admin access |
| Doctor Dashboard | Scan overview and quick actions |
| Analyze X-ray | Upload and run AI analysis |
| Results | Phase 1 + Phase 2 detection results |
| Reports | Doctor's assigned reports with search and filter |
| Doctor Review | Review and confirm AI draft |
| Patient Dashboard | Personal profile and reports |
| Admin Panel | User management and audit logs |

---

## 👨‍💻 Author

**Allage A Thirani**  
BSc (Hons) in Computer Science  
NSBM Green University — University of Plymouth  
Plymouth Index Number: **10953547**  
Supervisor: **Dr. Pabudi Abeyaratne**

---

## 📜 Academic Disclaimer

This project is developed solely for academic and research purposes as part of the PUSL3190 Computing Project module. It is not intended for clinical deployment without appropriate regulatory approval, clinical validation, and medical device certification.

All X-ray datasets used for training were obtained from publicly available, anonymized research repositories in compliance with ethical guidelines.

---

## 📄 License

This project is developed for academic purposes only.  
© 2026 Allage A Thirani — All rights reserved.