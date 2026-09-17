# Combridge Centre for Polytechnic Studies

A modern, responsive web application and academic portal for **Combridge Centre for Polytechnic Studies**, built with **React**, **Vite**, and **Bootstrap 5**.

Featuring navigation, pages, and subpages styled after the **University of Saint Joseph (USJ)** website structure (`usj.ac.ug`), with complete integration of the official institution logo (`logocom.png`).

---

## 🚀 Live Deployment (Vercel)

The application is pre-configured for automatic single-page application (SPA) deployment on **Vercel** via `vercel.json`.

```bash
# Deploy with Vercel CLI
npx vercel
```

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool / Bundler**: Vite 5
- **Routing**: React Router DOM (v6)
- **Styling**: Vanilla CSS, Bootstrap 5.3, Font Awesome 6
- **State & Backend**: Context API, Supabase JS Client
- **Data Visualization**: Chart.js & React-ChartJS-2

---

## 🌐 Pages & Structure

### Public Pages & Cloned USJ Subpages
- **Home (`/`)**: Course & Programme Finder, enrollment counters, study levels, announcements, and polytechnic news.
- **About (`/about`, `/about/:subpage`)**:
  - *Background*: Mission & Vision, Our History, Polytechnic Anthem, Rules & Regulations.
  - *Governance*: Chancellor, Board of Trustees, Academic Senate, Polytechnic Council, Institutional Policies.
  - *Management*: Principal, Deputy Principal, Academic Registrar, Library Administration.
- **Academics (`/academics`, `/academics/:subpage`)**:
  - *Faculties*: Science & Technology, Business & Management, Technical & Vocational Trades.
  - *Resources*: Polytechnic Library, E-Learning Portal, Digital Repository.
  - *Schedules*: Academic Calendar, Teaching Timetable.
- **Students (`/students`, `/students/:subpage`)**:
  - *Student Life*: Campus Life, Students' Guild, Games & Sports, Clubs & Societies, Code of Conduct, Alumni.
  - *Services*: Computing & ICT, Health Clinic, Campus Security, Financial Aid, Chaplaincy.
  - *Links*: Dean of Students, Admission Lists, Graduation Clearance.
- **Admissions (`/admissions`, `/admissions/:subpage`)**:
  - *Programmes*: Diploma, Certificate, Short Courses.
  - *Requirements*: General Requirements, Fees Structure (2026/2027), Call for Applications, Downloadable Forms.
  - *How to Apply*: Online Guidelines, Scholarships.
- **Apply Online (`/admissions/apply`)**: 3-step digital application wizard with instant reference code generation.
- **Research (`/research`, `/research/:subpage`)**: Grants Office, Innovation Hub, Collaborations, Publications Repository, Policy Downloads.
- **Notice Board (`/notice-board`)**: Official announcements, circulars, job advertisements, and memorandums.
- **News & Events (`/news`, `/events`)**: Press releases, academic forums, orientation stories, and community news.
- **Gallery (`/gallery`)**: Photo gallery of campus workshops, computer labs, practical sessions, and student life.
- **Contact Us (`/contact`)**: Campus address, office working hours, departmental phone numbers, and interactive inquiry form.

### Portals
- **Student Portal (`/student/dashboard`)**: Student coursework, results, fees clearance, and attendance.
- **Teacher Portal (`/teacher/dashboard`)**: Marks entry, lesson logs, and timetable management.
- **Admin Dashboard (`/admin/dashboard`)**: Institutional administration, user management, and reporting.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+ & NPM

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server
npm run dev

# 3. Build for production (outputs to dist/)
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 📄 License
All rights reserved &copy; Combridge Centre for Polytechnic Studies.
