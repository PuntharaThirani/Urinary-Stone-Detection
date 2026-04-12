# 🧠 UroScan AI – Urinary Stone Detection & Diagnosis Support System

## 📌 Overview

UroScan AI is a full-stack medical web application designed to assist in the detection and diagnosis of urinary stones using artificial intelligence. The system allows medical professionals to upload X-ray images, perform AI-based analysis using YOLOv8, and generate structured diagnostic reports.

This project was developed as a Final Year Research Project for the BSc (Hons) in Computer Science.

---

## 🚀 Key Features

### 👨‍⚕️ Doctor

* Upload X-ray images
* AI-powered stone detection (YOLOv8)
* Generate draft reports automatically
* Review and confirm final diagnosis
* Manage patient records

### 🧑‍💻 Patient

* View personal dashboard
* Access confirmed reports
* Read doctor’s diagnosis and notes

### 🏥 Staff

* Manage patients
* Handle appointments
* Support system workflow

---

## 🧠 AI Model

* Model: YOLOv8 (Object Detection)
* Task: Detect urinary stones in X-ray images
* Image preprocessing: CLAHE enhancement
* Output:

  * Stone count
  * Confidence scores
  * Bounding boxes
  * Annotated image

---

## 🏗️ System Architecture

Frontend → React + Tailwind CSS
Backend → Node.js + Express
Database → MongoDB
AI Engine → Python (YOLOv8)

```
User → Frontend → Backend API → Python AI Model → MongoDB → Response
```

---

## 🛠️ Technologies Used

### Frontend

* React.js
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### AI & Processing

* Python
* OpenCV
* Ultralytics YOLOv8

---

## 📂 Project Structure

```
StoneDetection-App/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── detect.py
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/StoneDetection-App.git
cd StoneDetection-App
```

---

### 2. Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```
npm start
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

### 4. AI Model Setup

* Place trained YOLOv8 model inside:

```
backend/AI_Models/best.pt
```

⚠️ Model file is not included due to size limitations.

---

## 🔐 Authentication & Security

* JWT-based authentication
* Role-based access control (Doctor / Patient / Staff)
* Protected API routes
* Secure file upload validation

---

## 📊 Workflow

1. Doctor uploads X-ray
2. AI model analyzes image
3. Draft report generated
4. Doctor confirms diagnosis
5. Patient views final report

---

## 📌 Future Improvements

* Multi-class detection (kidney, bladder, ureter)
* Mobile application support
* Cloud deployment (AWS / Docker)
* Real-time notifications
* Integration with hospital systems

---

## 👨‍💻 Author

**Punthara Thirani**
BSc (Hons) in Computer Science

---

## 📜 License

This project is developed for academic purposes.
