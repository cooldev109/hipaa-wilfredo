# HIPAA-Compliant EVF System — Master Project Prompt

## Project Identity

- **Project Name:** Neuronita EVF System
- **Type:** Electronic Health Record (EHR) for Functional Vision Evaluations
- **Client:** Dr. Wilfredo Cruz Martínez, OD — Developmental/Functional Optometrist
- **Clinic:** Neuronita — Clínica de Rehabilitación Neuro-Cognitiva
- **Location:** Aquamarina 10, Urb. Villa Blanca, Caguas, PR 00725
- **Contact:** Tel. 787-407-4814 | Fax. 787-258-8225 | clinicarehabilitacion10@gmail.com
- **License:** Lic. 440-0139
- **Jurisdiction:** Puerto Rico (US territory — full HIPAA compliance required)
- **Users:** 3-4 people (2 doctors, 1 secretary, 1 assistant)
- **Language:** All UI and reports in Spanish. Code in English.

---

## What This System Does

This system digitizes the workflow of a developmental optometry clinic that performs functional vision evaluations (EVF). Each evaluation takes approximately 2 hours and involves 80+ clinical measurements. After the evaluation, the doctor generates a detailed narrative report for parents or educational institutions explaining the findings in plain, parent-friendly language.

### Core Workflow

```
Secretary creates patient record
    → Doctor/Assistant fills evaluation form (2-hour session)
        → System auto-saves every 30 seconds
            → Doctor marks evaluation as complete
                → Doctor generates narrative PDF report
                    → Doctor selects which condition blocks to include
                        → Doctor signs report digitally
                            → Parent/Guardian signs report
                                → Final PDF stored securely
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React (Vite) | Single-page application |
| Backend | Node.js (Express) | REST API |
| Database | PostgreSQL | Primary data store |
| Authentication | JWT | HttpOnly cookies + refresh tokens |
| PDF Generation | Puppeteer or React-PDF | Server-side report rendering |
| Deployment | AWS (EC2, RDS, S3, CloudFront) | HIPAA-eligible infrastructure |
| CI/CD | GitHub Actions | Automated testing and deployment |
| Process Manager | PM2 | Production Node.js process management |

---

## Color Theme — "Neuronita" (Theme 2)

Inspired by the clinic's purple branding. Professional neuro-cognitive feel.

### Color Palette

| Role | Color Name | Hex Code | Usage |
|---|---|---|---|
| Primary | Royal Purple | `#5B2C8E` | Headers, navigation, primary buttons, active states |
| Primary Hover | Dark Purple | `#4A2275` | Button hover states, active links |
| Primary Light | Light Purple | `#7C4DB8` | Selected tabs, focus rings, secondary emphasis |
| Secondary | Soft Violet | `#8B5FBF` | Secondary buttons, badges, tags, sub-headers |
| Secondary Hover | Medium Violet | `#7A4EAE` | Secondary button hover |
| Accent | Teal Green | `#2EC4B6` | Call-to-action highlights, links, success indicators, toggles |
| Accent Hover | Dark Teal | `#25A89C` | Accent hover states |
| Background | Lavender White | `#F5F3FF` | Page background, main content area |
| Surface | White | `#FFFFFF` | Cards, modals, form containers, table backgrounds |
| Surface Alt | Light Lavender | `#EDE9FE` | Alternate table rows, selected list items, hover rows |
| Border | Soft Gray | `#D4D0E0` | Input borders, card borders, dividers |
| Border Focus | Primary Purple | `#5B2C8E` | Input focus state borders |
| Text Primary | Deep Charcoal | `#1C1917` | Body text, form labels, headings |
| Text Secondary | Medium Gray | `#57534E` | Help text, placeholders, secondary labels |
| Text Muted | Light Gray | `#A8A29E` | Disabled text, timestamps, metadata |
| Text On Primary | White | `#FFFFFF` | Text on primary-colored backgrounds |
| Success | Emerald | `#10B981` | Success messages, completed status, valid inputs |
| Success Background | Light Emerald | `#ECFDF5` | Success alert backgrounds |
| Warning | Orange | `#F97316` | Warning messages, draft status, attention indicators |
| Warning Background | Light Orange | `#FFF7ED` | Warning alert backgrounds |
| Error | Rose | `#E11D48` | Error messages, required field indicators, destructive actions |
| Error Background | Light Rose | `#FFF1F2` | Error alert backgrounds |
| Info | Blue | `#3B82F6` | Info messages, help tooltips |
| Info Background | Light Blue | `#EFF6FF` | Info alert backgrounds |

### Component-Specific Colors

| Component | Style |
|---|---|
| **Sidebar** | Background: `#5B2C8E`, text: `#FFFFFF`, active item: `#7C4DB8`, hover: `#4A2275` |
| **Header** | Background: `#FFFFFF`, border-bottom: `#D4D0E0`, text: `#1C1917` |
| **Primary Button** | Background: `#5B2C8E`, text: `#FFFFFF`, hover: `#4A2275`, disabled: `#8B5FBF` at 50% opacity |
| **Secondary Button** | Background: `#FFFFFF`, border: `#5B2C8E`, text: `#5B2C8E`, hover: `#F5F3FF` |
| **Accent Button** | Background: `#2EC4B6`, text: `#FFFFFF`, hover: `#25A89C` |
| **Danger Button** | Background: `#E11D48`, text: `#FFFFFF`, hover: `#BE123C` |
| **Input Fields** | Background: `#FFFFFF`, border: `#D4D0E0`, focus border: `#5B2C8E`, focus ring: `#5B2C8E` at 20% opacity |
| **Cards** | Background: `#FFFFFF`, border: `#D4D0E0`, shadow: `0 1px 3px rgba(0,0,0,0.08)` |
| **Tabs (active)** | Border-bottom: `#5B2C8E`, text: `#5B2C8E`, background: `#F5F3FF` |
| **Tabs (inactive)** | Text: `#57534E`, hover: `#EDE9FE` |
| **Table Header** | Background: `#5B2C8E`, text: `#FFFFFF` |
| **Table Row Hover** | Background: `#EDE9FE` |
| **Table Row Alternate** | Background: `#F5F3FF` |
| **Badge (Draft)** | Background: `#FFF7ED`, text: `#F97316`, border: `#F97316` |
| **Badge (Complete)** | Background: `#EFF6FF`, text: `#3B82F6`, border: `#3B82F6` |
| **Badge (Signed)** | Background: `#ECFDF5`, text: `#10B981`, border: `#10B981` |
| **Tooltip** | Background: `#1C1917`, text: `#FFFFFF` |
| **Modal Overlay** | Background: `#000000` at 50% opacity |
| **Skeleton Loading** | Gradient animation between `#EDE9FE` and `#F5F3FF` |

### Typography

| Element | Font | Weight | Size |
|---|---|---|---|
| Page Title | Inter (or system sans-serif) | 700 (Bold) | 24px |
| Section Title | Inter | 600 (Semibold) | 20px |
| Sub-section Title | Inter | 600 (Semibold) | 16px |
| Body Text | Inter | 400 (Regular) | 14px |
| Form Labels | Inter | 500 (Medium) | 14px |
| Input Text | Inter | 400 (Regular) | 14px |
| Small / Help Text | Inter | 400 (Regular) | 12px |
| Button Text | Inter | 500 (Medium) | 14px |
| Table Header | Inter | 600 (Semibold) | 13px |
| Table Body | Inter | 400 (Regular) | 14px |
| Sidebar Links | Inter | 500 (Medium) | 14px |

### Spacing System (8px base)

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Tight spacing within components |
| `sm` | 8px | Internal component padding, gap between inline elements |
| `md` | 16px | Standard padding, gap between form fields |
| `lg` | 24px | Section separation, card padding |
| `xl` | 32px | Page section separation |
| `2xl` | 48px | Major section breaks |

### Border Radius

| Token | Value | Usage |
|---|---|---|
| `sm` | 4px | Buttons, inputs, badges |
| `md` | 8px | Cards, modals, dropdowns |
| `lg` | 12px | Large cards, containers |
| `full` | 9999px | Avatars, circular icons |

---

## Architecture

### Backend Pattern: Route → Controller → Service → Model

```
routes/patientRoutes.js       → Defines endpoints, attaches middleware
controllers/patientController.js  → Handles req/res, calls service
services/patientService.js    → Business logic, validation, calls model
models/patientModel.js        → Raw database queries only
```

### Project Structure

```
hipaa-evf/
├── client/                          # React frontend (Vite)
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── App.jsx                  # Root component with Router
│   │   ├── main.jsx                 # Entry point
│   │   ├── index.css                # Global styles, CSS variables (theme)
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx       # Primary, secondary, accent, danger variants
│   │   │   │   ├── Input.jsx        # Text input with label, error, help text
│   │   │   │   ├── Select.jsx       # Dropdown select
│   │   │   │   ├── Textarea.jsx     # Multi-line text input
│   │   │   │   ├── Checkbox.jsx     # Single checkbox
│   │   │   │   ├── CheckboxGroup.jsx # Multiple checkboxes
│   │   │   │   ├── Modal.jsx        # Overlay modal dialog
│   │   │   │   ├── ConfirmDialog.jsx # Destructive action confirmation
│   │   │   │   ├── Toast.jsx        # Success/error notification
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── Skeleton.jsx     # Loading placeholder
│   │   │   │   ├── Badge.jsx        # Status badges (draft, complete, signed)
│   │   │   │   ├── Pagination.jsx   # Page navigation
│   │   │   │   ├── EmptyState.jsx   # "No se encontraron datos"
│   │   │   │   └── Alert.jsx        # Info/warning/error/success banners
│   │   │   ├── forms/
│   │   │   │   ├── OdOsInput.jsx          # Two-column OD/OS pair wrapper
│   │   │   │   ├── VisualAcuityInput.jsx  # 20/___ fraction input
│   │   │   │   ├── PrescriptionInput.jsx  # Sphere/Cylinder/Axis grouped input
│   │   │   │   ├── ScaleRating.jsx        # Horizontal 4-3-2-1 radio
│   │   │   │   ├── NpcInput.jsx           # Blur/Break/Recovery triplet
│   │   │   │   ├── VergenceInput.jsx      # BI/BO with sub-fields
│   │   │   │   ├── OcularHealthTable.jsx  # External/Internal health grid
│   │   │   │   ├── ScoredTestTable.jsx    # VMI/VP/Garner score table
│   │   │   │   ├── DiagnosisSelector.jsx  # ICD-10 checkbox list
│   │   │   │   └── SignatureCanvas.jsx    # Digital signature capture
│   │   │   └── layout/
│   │   │       ├── AppLayout.jsx          # Sidebar + header + content
│   │   │       ├── Header.jsx             # Top bar with user info, logout
│   │   │       ├── Sidebar.jsx            # Navigation menu
│   │   │       └── ProtectedRoute.jsx     # Auth guard + RBAC
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── ChangePasswordPage.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── DashboardPage.jsx      # Landing page after login
│   │   │   ├── patients/
│   │   │   │   ├── PatientListPage.jsx
│   │   │   │   ├── PatientCreatePage.jsx
│   │   │   │   └── PatientDetailPage.jsx
│   │   │   ├── evaluations/
│   │   │   │   ├── EvaluationListPage.jsx
│   │   │   │   └── EvaluationFormPage.jsx  # The main 7-tab form
│   │   │   ├── reports/
│   │   │   │   ├── ReportListPage.jsx
│   │   │   │   └── ReportPreviewPage.jsx
│   │   │   └── admin/
│   │   │       └── UserManagementPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   ├── patientService.js
│   │   │   ├── evaluationService.js
│   │   │   ├── reportService.js
│   │   │   └── userService.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js             # AuthContext consumer
│   │   │   ├── useAutoSave.js         # 30-second auto-save
│   │   │   └── useIdleTimeout.js      # 15-min inactivity logout
│   │   └── utils/
│   │       ├── formatters.js          # Dates, ages, prescriptions
│   │       ├── validators.js          # Form validation
│   │       └── constants.js           # Roles, routes, ICD-10 codes, form options
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
├── server/                            # Node.js backend (Express)
│   ├── index.js                       # Server entry point
│   ├── app.js                         # Express app configuration
│   ├── config/
│   │   ├── database.js                # PostgreSQL connection pool
│   │   ├── environment.js             # Env variable validation
│   │   └── knexfile.js                # Knex migration configuration
│   ├── routes/
│   │   ├── index.js                   # Route aggregator
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── evaluationRoutes.js
│   │   ├── reportRoutes.js
│   │   └── userRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── evaluationController.js
│   │   ├── reportController.js
│   │   └── userController.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── patientService.js
│   │   ├── evaluationService.js
│   │   ├── reportService.js
│   │   ├── reportTemplateService.js   # Narrative block assembly
│   │   ├── reportAssemblyService.js   # Data interpolation + block ordering
│   │   └── userService.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── patientModel.js
│   │   ├── evaluationModel.js
│   │   ├── reportModel.js
│   │   └── auditLogModel.js
│   ├── middleware/
│   │   ├── authenticate.js            # JWT cookie verification
│   │   ├── authorize.js               # RBAC middleware
│   │   ├── auditLog.js                # PHI access logging
│   │   ├── errorHandler.js            # Centralized error handler
│   │   ├── rateLimiter.js             # Login attempt throttling
│   │   └── validateRequest.js         # Schema validation wrapper
│   ├── utils/
│   │   ├── encryption.js              # AES-256-GCM encrypt/decrypt
│   │   ├── logger.js                  # Structured JSON logger
│   │   ├── pdfGenerator.js            # HTML → PDF conversion
│   │   └── constants.js               # Roles, ICD-10 codes, status enums
│   ├── storage/                       # Local file storage (dev only)
│   │   └── reports/                   # Generated PDFs (gitignored)
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── migrations/                    # Knex migration files
│   │   ├── 001_create_users_table.js
│   │   ├── 002_create_patients_table.js
│   │   ├── 003_create_patient_history_table.js
│   │   ├── 004_create_evaluations_table.js
│   │   ├── 005_create_reports_table.js
│   │   ├── 006_create_audit_logs_table.js
│   │   └── 007_create_refresh_tokens_table.js
│   └── seeds/
│       └── 001_create_admin_user.js
│
├── docs/                              # Clinical reference documents
│   ├── EVFenBlanco (2).docx           # Report template (narrative)
│   └── EXAMENEVF (1).pdf              # Exam form (data capture)
│
├── .github/
│   └── workflows/
│       ├── test.yml                   # Run tests on push to dev / PRs
│       └── deploy.yml                 # Deploy on push to main
│
├── .gitignore
├── .env.example
├── CLAUDE.md                          # Development rules
├── PROMPT.md                          # This file
├── ROADMAP.md                         # Phase-by-phase task list
└── README.md                          # Setup instructions
```

---

## Authentication & Security

### JWT Strategy

```
Login → Server sets two HttpOnly cookies:

1. accessToken (15 min expiry)
   - Payload: { userId, email, role }
   - Cookie: HttpOnly, Secure (prod), SameSite=Strict, Path=/api

2. refreshToken (7 day expiry)
   - Value: random 64-byte hex string
   - Stored in DB: SHA-256 hash of the token
   - Cookie: HttpOnly, Secure (prod), SameSite=Strict, Path=/api/auth/refresh
   - Single-use: rotated on every refresh
```

### Session Management

```
- Access token expires → Axios interceptor calls /api/auth/refresh
- Refresh succeeds → new access token + new refresh token (rotation)
- Refresh fails → user redirected to login
- Idle 15 minutes → frontend shows warning at 13 min → auto-logout at 15 min
- Logout → both cookies cleared, refresh token revoked in DB
```

### Password Policy

```
- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 number
- Hashed with bcrypt (salt rounds: 12)
- Force change on first login
- 5 failed attempts → 15-minute lockout
```

### RBAC Permissions

| Resource | Action | Doctor | Assistant | Secretary |
|---|---|---|---|---|
| Users | Create, Edit, Deactivate | Yes | No | No |
| Patients | Create | Yes | Yes | Yes |
| Patients | View, Edit | Yes | Yes | Yes |
| Patients | Delete (soft) | Yes | No | No |
| Patient History | View, Edit | Yes | Yes | No |
| Evaluations | Create, Edit | Yes | Yes | No |
| Evaluations | View | Yes | Yes | No |
| Evaluations | Delete (soft) | Yes | No | No |
| Evaluations | Change Status | Yes | Yes (to complete) | No |
| Reports | Generate | Yes | No | No |
| Reports | Sign | Yes | No | No |
| Reports | View, Download | Yes | No | No |
| Audit Logs | View | Yes | No | No |

---

## Database Schema

### Table: users

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| role | VARCHAR(20) | NOT NULL, CHECK IN ('doctor', 'assistant', 'secretary') |
| license_number | VARCHAR(50) | Nullable (for doctors) |
| is_active | BOOLEAN | DEFAULT true |
| force_password_change | BOOLEAN | DEFAULT true |
| failed_login_attempts | INTEGER | DEFAULT 0 |
| locked_until | TIMESTAMP | Nullable |
| last_login_at | TIMESTAMP | Nullable |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |
| created_by | UUID | FK → users(id), Nullable |

### Table: patients

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| first_name_encrypted | TEXT | NOT NULL (AES-256-GCM) |
| last_name_encrypted | TEXT | NOT NULL (AES-256-GCM) |
| date_of_birth_encrypted | TEXT | NOT NULL (AES-256-GCM) |
| sex | VARCHAR(1) | NOT NULL, CHECK IN ('M', 'F') |
| school | VARCHAR(255) | Nullable |
| grade | VARCHAR(50) | Nullable |
| referred_by | VARCHAR(255) | Nullable |
| parent_guardian_name_encrypted | TEXT | Nullable (AES-256-GCM) |
| parent_guardian_phone_encrypted | TEXT | Nullable (AES-256-GCM) |
| parent_guardian_email_encrypted | TEXT | Nullable (AES-256-GCM) |
| search_hash | VARCHAR(64) | HMAC-SHA256 for searchable lookup |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |
| created_by | UUID | FK → users(id), NOT NULL |
| updated_by | UUID | FK → users(id), Nullable |
| deleted_at | TIMESTAMP | Nullable (soft delete) |

### Table: patient_history

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| patient_id | UUID | FK → patients(id), NOT NULL |
| visual_history | TEXT | |
| medical_history | TEXT | |
| medications | TEXT | |
| family_ocular_history | TEXT | |
| family_medical_history | TEXT | |
| developmental_birth_weeks | INTEGER | |
| developmental_birth_type | VARCHAR(50) | natural, cesarean |
| developmental_crawled_months | INTEGER | |
| developmental_walked_months | INTEGER | |
| developmental_talked_months | INTEGER | |
| therapies | JSONB | DEFAULT '{}' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |
| created_by | UUID | FK → users(id), NOT NULL |
| updated_by | UUID | FK → users(id) |

### Table: evaluations

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| patient_id | UUID | FK → patients(id), NOT NULL |
| evaluation_date | DATE | NOT NULL |
| status | VARCHAR(20) | DEFAULT 'draft', CHECK IN ('draft', 'complete', 'signed') |
| reason_for_visit | TEXT | |
| **— Visual Acuity Near —** | | |
| va_near_aided_od | VARCHAR(10) | e.g., "20/20" |
| va_near_aided_os | VARCHAR(10) | |
| va_near_aided_ou | VARCHAR(10) | |
| va_near_unaided_od | VARCHAR(10) | |
| va_near_unaided_os | VARCHAR(10) | |
| va_near_unaided_ou | VARCHAR(10) | |
| va_near_method | VARCHAR(20) | snellen, lea, bw, pl |
| **— Visual Acuity Distance —** | | |
| va_distance_aided_od | VARCHAR(10) | |
| va_distance_aided_os | VARCHAR(10) | |
| va_distance_aided_ou | VARCHAR(10) | |
| va_distance_unaided_od | VARCHAR(10) | |
| va_distance_unaided_os | VARCHAR(10) | |
| va_distance_unaided_ou | VARCHAR(10) | |
| va_distance_method | VARCHAR(20) | |
| **— Color & Stereo —** | | |
| color_vision_test | VARCHAR(50) | Default: "ishihara" |
| color_vision_result | VARCHAR(100) | |
| stereo_test | VARCHAR(50) | Default: "randot" |
| stereo_result | VARCHAR(100) | Arc-seconds |
| **— Cover Test —** | | |
| cover_test_distance | TEXT | |
| cover_test_near | TEXT | |
| **— Pursuits & Saccades —** | | |
| pursuits_ou | INTEGER | CHECK BETWEEN 1 AND 4 |
| saccades_ou | INTEGER | CHECK BETWEEN 1 AND 4 |
| **— NPC —** | | |
| npc_1_blur | VARCHAR(20) | cm |
| npc_1_break | VARCHAR(20) | cm |
| npc_1_recovery | VARCHAR(20) | cm |
| npc_2_blur | VARCHAR(20) | |
| npc_2_break | VARCHAR(20) | |
| npc_2_recovery | VARCHAR(20) | |
| **— NPA & Sheard's —** | | |
| npa_od | VARCHAR(20) | |
| npa_os | VARCHAR(20) | |
| sheards_od | VARCHAR(20) | |
| sheards_os | VARCHAR(20) | |
| minimum_aoa | VARCHAR(20) | Auto-calc: 15 - (age/4) |
| **— Refraction —** | | |
| retinoscopy_od | TEXT | JSON: {sphere, cylinder, axis} |
| retinoscopy_os | TEXT | |
| subjective_refraction_od | TEXT | |
| subjective_refraction_os | TEXT | |
| final_rx_od | TEXT | |
| final_rx_os | TEXT | |
| final_rx_add | VARCHAR(20) | |
| **— Post-Refraction VA —** | | |
| post_rx_va_retinoscopy_od | VARCHAR(10) | |
| post_rx_va_retinoscopy_os | VARCHAR(10) | |
| post_rx_va_retinoscopy_ou | VARCHAR(10) | |
| post_rx_va_subjective_od | VARCHAR(10) | |
| post_rx_va_subjective_os | VARCHAR(10) | |
| post_rx_va_subjective_ou | VARCHAR(10) | |
| post_rx_va_final_od | VARCHAR(10) | |
| post_rx_va_final_os | VARCHAR(10) | |
| post_rx_va_final_ou | VARCHAR(10) | |
| **— Phorias —** | | |
| phoria_distance_h | VARCHAR(30) | e.g., "2 exo" |
| phoria_distance_v | VARCHAR(30) | |
| phoria_near_h | VARCHAR(30) | |
| phoria_near_v | VARCHAR(30) | |
| **— Vergences —** | | |
| vergence_distance_bi | TEXT | JSON: {blur, break, recovery} |
| vergence_distance_bo | TEXT | |
| vergence_distance_bu | VARCHAR(20) | |
| vergence_distance_bd | VARCHAR(20) | |
| vergence_near_bi | TEXT | |
| vergence_near_bo | TEXT | |
| vergence_near_bu | VARCHAR(20) | |
| vergence_near_bd | VARCHAR(20) | |
| **— Ocular Health External —** | | |
| ext_lids_lash_od | VARCHAR(100) | |
| ext_lids_lash_os | VARCHAR(100) | |
| ext_conj_od | VARCHAR(100) | |
| ext_conj_os | VARCHAR(100) | |
| ext_cornea_od | VARCHAR(100) | |
| ext_cornea_os | VARCHAR(100) | |
| ext_iris_od | VARCHAR(100) | |
| ext_iris_os | VARCHAR(100) | |
| ext_angles_od | JSONB | [I, II, III, IV] |
| ext_angles_os | JSONB | |
| ext_pupils_od | VARCHAR(100) | |
| ext_pupils_os | VARCHAR(100) | |
| **— Ocular Health Internal —** | | |
| int_lens_od | VARCHAR(100) | |
| int_lens_os | VARCHAR(100) | |
| int_media_od | VARCHAR(100) | |
| int_media_os | VARCHAR(100) | |
| int_cd_od | VARCHAR(20) | Cup-to-disc ratio |
| int_cd_os | VARCHAR(20) | |
| int_av_od | VARCHAR(100) | |
| int_av_os | VARCHAR(100) | |
| int_macula_fr_od | VARCHAR(100) | |
| int_macula_fr_os | VARCHAR(100) | |
| **— RightEye Test —** | | |
| righteye_global_score | DECIMAL(5,2) | Expected > 75 |
| righteye_tracking_score | DECIMAL(5,2) | Expected > 75 |
| righteye_saccadic_score | DECIMAL(5,2) | Expected > 75 |
| righteye_fixation_score | DECIMAL(5,2) | Expected > 75 |
| **— Garner Reversal Test —** | | |
| garner_unknown_errors | INTEGER | |
| garner_unknown_mean | DECIMAL(5,2) | |
| garner_unknown_sd | DECIMAL(5,2) | |
| garner_reversed_errors | INTEGER | |
| garner_reversed_mean | DECIMAL(5,2) | |
| garner_reversed_sd | DECIMAL(5,2) | |
| garner_recognition_errors | INTEGER | |
| garner_recognition_mean | DECIMAL(5,2) | |
| **— Beery VMI —** | | |
| vmi_raw_score | INTEGER | |
| vmi_chronological_age | VARCHAR(20) | "X años con Y meses" |
| vmi_perceptual_age | VARCHAR(20) | |
| vmi_standard_score | INTEGER | |
| vmi_percentile | INTEGER | |
| **— Visual Perception —** | | |
| vp_raw_score | INTEGER | |
| vp_chronological_age | VARCHAR(20) | |
| vp_perceptual_age | VARCHAR(20) | |
| vp_standard_score | INTEGER | |
| vp_percentile | INTEGER | |
| **— Assessment & Plan —** | | |
| assessment_notes | TEXT | Free-text clinical notes |
| diagnoses | JSONB | [{code, name, active}] |
| plan_rx_od | TEXT | |
| plan_rx_os | TEXT | |
| plan_rx_add | VARCHAR(20) | |
| recommendations | JSONB | [{key, text, included}] |
| **— Metadata —** | | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |
| created_by | UUID | FK → users(id), NOT NULL |
| updated_by | UUID | FK → users(id) |
| deleted_at | TIMESTAMP | Soft delete |
| last_auto_saved_at | TIMESTAMP | |

### Table: reports

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| evaluation_id | UUID | FK → evaluations(id), NOT NULL |
| patient_id | UUID | FK → patients(id), NOT NULL |
| version | INTEGER | DEFAULT 1 |
| status | VARCHAR(20) | DEFAULT 'draft', CHECK IN ('draft', 'final', 'signed') |
| report_data | JSONB | Snapshot of all data used to generate |
| pdf_file_path | TEXT | Local path or S3 key |
| pdf_file_hash | VARCHAR(64) | SHA-256 for integrity |
| doctor_signature_data | TEXT | Base64 PNG |
| doctor_signed_at | TIMESTAMP | |
| doctor_signed_by | UUID | FK → users(id) |
| parent_signature_data | TEXT | Base64 PNG |
| parent_signed_at | TIMESTAMP | |
| parent_signer_name | VARCHAR(200) | |
| condition_blocks | JSONB | [{key, included}] |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |
| created_by | UUID | FK → users(id), NOT NULL |

### Table: audit_logs

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| timestamp | TIMESTAMP | DEFAULT NOW() |
| user_id | UUID | FK → users(id) |
| user_email | VARCHAR(255) | Denormalized for log integrity |
| action | VARCHAR(50) | NOT NULL (see action list below) |
| resource | VARCHAR(50) | patients, evaluations, reports, users |
| resource_id | UUID | |
| ip_address | VARCHAR(45) | |
| user_agent | TEXT | |
| details | JSONB | Context (never PHI) |
| created_at | TIMESTAMP | DEFAULT NOW() |

**Audit Actions:**
- AUTH: `LOGIN`, `LOGOUT`, `FAILED_LOGIN`, `TOKEN_REFRESH`, `PASSWORD_CHANGE`
- PATIENT: `PATIENT_CREATE`, `PATIENT_READ`, `PATIENT_UPDATE`, `PATIENT_DELETE`
- EVALUATION: `EVALUATION_CREATE`, `EVALUATION_READ`, `EVALUATION_UPDATE`, `EVALUATION_DELETE`, `EVALUATION_STATUS_CHANGE`
- REPORT: `REPORT_GENERATE`, `REPORT_DOWNLOAD`, `REPORT_SIGN`, `REPORT_VIEW`
- USER: `USER_CREATE`, `USER_UPDATE`, `USER_ROLE_CHANGE`, `USER_DEACTIVATE`

### Table: refresh_tokens

| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users(id), NOT NULL |
| token_hash | VARCHAR(64) | SHA-256 hash, NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| is_revoked | BOOLEAN | DEFAULT false |
| revoked_at | TIMESTAMP | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| ip_address | VARCHAR(45) | |
| user_agent | TEXT | |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth | Roles |
|---|---|---|---|---|
| POST | /api/auth/login | Login | No | — |
| POST | /api/auth/refresh | Refresh tokens | Cookie | — |
| POST | /api/auth/logout | Logout | Yes | All |
| POST | /api/auth/change-password | Change password | Yes | All |
| GET | /api/auth/me | Get current user | Yes | All |

### Users

| Method | Endpoint | Description | Auth | Roles |
|---|---|---|---|---|
| POST | /api/users | Create user | Yes | Doctor |
| GET | /api/users | List users | Yes | Doctor |
| PUT | /api/users/:id | Update user | Yes | Doctor |
| PATCH | /api/users/:id/deactivate | Deactivate user | Yes | Doctor |
| PATCH | /api/users/:id/role | Change role | Yes | Doctor |

### Patients

| Method | Endpoint | Description | Auth | Roles |
|---|---|---|---|---|
| POST | /api/patients | Create patient | Yes | All |
| GET | /api/patients | List/search patients | Yes | All |
| GET | /api/patients/:id | Get patient detail | Yes | All |
| PUT | /api/patients/:id | Update patient | Yes | All |
| DELETE | /api/patients/:id | Soft delete | Yes | Doctor |
| PUT | /api/patients/:id/history | Update history | Yes | Doctor, Assistant |

### Evaluations

| Method | Endpoint | Description | Auth | Roles |
|---|---|---|---|---|
| POST | /api/evaluations | Create evaluation | Yes | Doctor, Assistant |
| GET | /api/evaluations/:id | Get evaluation | Yes | Doctor, Assistant |
| PUT | /api/evaluations/:id | Update evaluation | Yes | Doctor, Assistant |
| PATCH | /api/evaluations/:id/auto-save | Auto-save partial | Yes | Doctor, Assistant |
| PATCH | /api/evaluations/:id/status | Change status | Yes | Doctor, Assistant |
| DELETE | /api/evaluations/:id | Soft delete | Yes | Doctor |
| GET | /api/patients/:patientId/evaluations | List for patient | Yes | Doctor, Assistant |

### Reports

| Method | Endpoint | Description | Auth | Roles |
|---|---|---|---|---|
| POST | /api/reports/generate | Generate report | Yes | Doctor |
| GET | /api/reports/:id/preview | Preview report data | Yes | Doctor |
| GET | /api/reports/:id/download | Download PDF | Yes | Doctor |
| POST | /api/reports/:id/sign/doctor | Doctor signature | Yes | Doctor |
| POST | /api/reports/:id/sign/parent | Parent signature | Yes | Doctor |
| GET | /api/evaluations/:evaluationId/reports | List versions | Yes | Doctor |

### System

| Method | Endpoint | Description | Auth | Roles |
|---|---|---|---|---|
| GET | /api/health | Health check | No | — |

---

## Evaluation Form — 7 Tabs

### Tab 1: Agudeza Visual y Pruebas Básicas

```
┌─────────────────────────────────────────────────────────────────┐
│ AGUDEZA VISUAL - CERCA                                          │
│ Método: [Snellen ▼]  [LEA]  [BW]  [PL]                         │
│                                                                  │
│              │  OD          │  OS          │  OU                  │
│ ─────────────┼──────────────┼──────────────┼─────────            │
│ Con Corrección  │  20/[___]   │  20/[___]   │  20/[___]          │
│ Sin Corrección  │  20/[___]   │  20/[___]   │  20/[___]          │
│                                                                  │
│ AGUDEZA VISUAL - DISTANCIA                                       │
│ (same structure)                                                 │
│                                                                  │
│ VISIÓN A COLOR                                                   │
│ Prueba: [Ishihara ▼]    Resultado: [________________]            │
│                                                                  │
│ ESTEREOPSIS                                                      │
│ Prueba: [Randot ▼]      Resultado: [____] seg. de arco          │
│                                                                  │
│ COVER TEST                                                       │
│ Distancia: [________________________________]                    │
│ Cerca:     [________________________________]                    │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 2: Oculomotor y Acomodación

```
┌─────────────────────────────────────────────────────────────────┐
│ SEGUIMIENTO (Pursuits) OU:     ④  ③  ②  ①                       │
│ SACÁDICOS (Saccades) OU:       ④  ③  ②  ①                       │
│                                                                  │
│ NPC                                                              │
│         │  Borrosidad  │  Ruptura    │  Recuperación             │
│ ────────┼──────────────┼─────────────┼───────────────            │
│ #1      │  [___] cm    │  [___] cm   │  [___] cm                │
│ #2      │  [___] cm    │  [___] cm   │  [___] cm                │
│                                                                  │
│ NPA:    OD [___]    OS [___]                                     │
│ SHEARD: OD [___]    OS [___]                                     │
│ AOA MÍNIMO: [auto-calculated] (15 - Edad/4)                     │
│                                                                  │
│ RIGHTEYE                                                         │
│ Global:     [___] / 75    Seguimiento: [___] / 75               │
│ Sacádico:   [___] / 75    Fijación:    [___] / 75               │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 3: Refracción

```
┌─────────────────────────────────────────────────────────────────┐
│ RETINOSCOPIA                                                     │
│     │  Esfera    │  Cilindro  │  Eje    ║  AV OD    OS    OU    │
│ ────┼────────────┼────────────┼─────────║──────────────────      │
│ OD  │ [±__.__]   │ [±__.__]   │ [___]°  ║ 20/[__]               │
│ OS  │ [±__.__]   │ [±__.__]   │ [___]°  ║ 20/[__] 20/[__]       │
│                                                                  │
│ REFRACCIÓN SUBJETIVA (same structure)                            │
│ PRESCRIPCIÓN FINAL  (same + ADD field)                           │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 4: Visión Binocular

```
┌─────────────────────────────────────────────────────────────────┐
│ FORIAS                                                           │
│            │  Horizontal    │  Vertical                          │
│ ───────────┼────────────────┼────────────                        │
│ Distancia  │  [___] [eso/exo ▼]  │  [___] [hiper ▼]            │
│ Cerca      │  [___] [eso/exo ▼]  │  [___] [hiper ▼]            │
│                                                                  │
│ VERGENCIAS                                                       │
│              │  Borrosidad  │  Ruptura  │  Recuperación          │
│ DISTANCIA    │              │           │                        │
│   BI         │  [___]       │  [___]    │  [___]                │
│   BO         │  [___]       │  [___]    │  [___]                │
│   BU [___]   BD [___]                                            │
│ CERCA        │              │           │                        │
│   BI         │  [___]       │  [___]    │  [___]                │
│   BO         │  [___]       │  [___]    │  [___]                │
│   BU [___]   BD [___]                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 5: Salud Ocular

```
┌─────────────────────────────────────────────────────────────────┐
│ [Todo Normal ✓] ← Quick fill button                             │
│                                                                  │
│ SALUD EXTERNA         │  OD              │  OS                   │
│ ──────────────────────┼──────────────────┼───────────────        │
│ Párpados/Pestañas     │  [____________]  │  [____________]       │
│ Conjuntiva            │  [____________]  │  [____________]       │
│ Córnea                │  [____________]  │  [____________]       │
│ Iris                  │  [____________]  │  [____________]       │
│ Ángulos   I II III IV │  [_][_][_][_]    │  [_][_][_][_]        │
│ Pupilas               │  [____________]  │  [____________]       │
│                                                                  │
│ SALUD INTERNA         │  OD              │  OS                   │
│ ──────────────────────┼──────────────────┼───────────────        │
│ Cristalino            │  [____________]  │  [____________]       │
│ Medios                │  [____________]  │  [____________]       │
│ C/D                   │  [____________]  │  [____________]       │
│ A/V                   │  [____________]  │  [____________]       │
│ Mácula/FR             │  [____________]  │  [____________]       │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 6: Pruebas Perceptuales

```
┌─────────────────────────────────────────────────────────────────┐
│ PRUEBA DE REVERSIÓN GARNER                                       │
│                     │  # Errores  │  Promedio  │  Desv. Est.    │
│ ────────────────────┼─────────────┼────────────┼────────────     │
│ Letras Desconocidas │  [___]      │  [___]     │  [___]         │
│ Letras Revertidas   │  [___]      │  [___]     │  [___]         │
│ Reconocimiento      │  [___]      │  [___]     │                │
│                                                                  │
│ INTEGRACIÓN VISUAL-MOTORA (Beery VMI)                            │
│ Punt. Cruda │ Edad Cron. │ Equiv. Edad │ Punt. Est. │ Percentil │
│ [___]       │ [__ a __ m]│ [__ a __ m] │ [___]      │ [___]     │
│                                                                  │
│ PERCEPCIÓN VISUAL (Beery VP)                                     │
│ (same structure as VMI)                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 7: Evaluación y Plan

```
┌─────────────────────────────────────────────────────────────────┐
│ NOTAS DE EVALUACIÓN                                              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │  (free text area for clinical notes)                        │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ DIAGNÓSTICOS                                                     │
│ ☑ H55.81  - Disfunción Oculomotora                              │
│ ☑ H52.533 - Insuficiencia de Acomodación                        │
│ ☑ H51.11  - Insuficiencia de Convergencia                       │
│ ☐ H51.12  - Exceso de Convergencia                              │
│ ☐ H52.13  - Miopía                                              │
│ ☑ H52.03  - Hipermetropía                                       │
│ ☐ H52.23  - Astigmatismo                                        │
│ + Agregar diagnóstico personalizado                              │
│                                                                  │
│ PLAN / PRESCRIPCIÓN                                              │
│ RX - OD: [____________]  OS: [____________]  ADD: [____]        │
│                                                                  │
│ RECOMENDACIONES                                                  │
│ ☑ Terapia Visual Funcional (1 sesión semanal, 60 min)           │
│ ☑ Espejuelos terapéuticos (uso continuo)                        │
│ ☐ Re-evaluación en [___] meses                                  │
│ ☐ Referido a: [________________________________]                │
│ Notas adicionales: [________________________________]            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Report Generation — Narrative Block System

The report is assembled from **conditional narrative blocks**. Each block is a pre-written text template (matching the original DOCX) with data interpolation points.

### Always-Included Blocks

| Block Key | Content Summary |
|---|---|
| `header` | Clinic logo, name, address, contact info |
| `patient_info` | Patient name, DOB, age, school, grade, evaluation date |
| `reason_for_visit` | Standard boilerplate: "El paciente nos visita para descartar..." |
| `history` | All history sections with patient data filled in |
| `tests_performed` | Checklist of 12 tests performed (with parent-friendly descriptions) |
| `ocular_health` | "Los ojos de [Nombre] están saludables..." (or findings if abnormal) |
| `color_vision` | "Visión a Color encontrada: [result]" |
| `visual_acuity` | VA table + narrative explanation of findings |
| `summary_diagnoses` | List of all active diagnoses with ICD-10 codes |
| `recommendations` | Therapy plan + visual hygiene tips |
| `signatures` | Doctor signature + parent signature + date |

### Conditional Blocks (Based on Selected Diagnoses)

| Block Key | Triggered By | Content |
|---|---|---|
| `refractive_hyperopia` | Diagnosis: Hipermetropía | Parent-friendly explanation of hyperopia |
| `refractive_myopia` | Diagnosis: Miopía | Parent-friendly explanation of myopia |
| `refractive_astigmatism` | Diagnosis: Astigmatismo | Parent-friendly explanation of astigmatism |
| `oculomotor_control` | Diagnosis: Disfunción Oculomotora | Detailed explanation of oculomotor issues |
| `righteye_results` | RightEye scores present | Global score + interpretation |
| `oculomotor_diagnosis` | Diagnosis: Disfunción Oculomotora | Diagnosis statement with impact on school |
| `accommodation` | Diagnosis: Insuficiencia de Acomodación | Accommodation explanation + school impact |
| `convergence_insufficiency` | Diagnosis: Insuficiencia de Convergencia | Flashlight analogy + symptoms |
| `convergence_excess` | Diagnosis: Exceso de Convergencia | Excess convergence explanation |
| `depth_perception` | Stereo result abnormal | Depth perception explanation |
| `garner_reversal` | Garner test performed | Letter reversal findings |
| `vmi_results` | VMI test performed | Visual-motor integration findings |
| `visual_perception` | VP test performed | Visual perception findings |

### Data Interpolation Points

```
[Nombre]              → Patient first name
[NombreCompleto]      → Patient full name
[Edad]                → "X años con Y meses"
[FechaEvaluacion]     → "2 de abril de 2026"
[Escuela]             → School name
[Grado]               → Grade level
[SemanasNacimiento]   → Birth weeks
[GateoMeses]          → Crawled at months
[CaminoMeses]         → Walked at months
[HabloMeses]          → Talked at months
[RightEyeGlobal]      → RightEye global score
[StereoResult]        → Stereo test result in arc-seconds
[VMIEdadPerceptual]   → VMI perceptual age equivalent
[VPEdadPerceptual]    → VP perceptual age equivalent
```

---

## Page Layouts

### Login Page

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              🧠 NEURONITA                        │
│     Clínica de Rehabilitación Neuro-Cognitiva    │
│                                                  │
│         ┌──────────────────────────┐             │
│         │  Correo electrónico      │             │
│         │  [____________________]  │             │
│         │                          │             │
│         │  Contraseña              │             │
│         │  [____________________]  │             │
│         │                          │             │
│         │  [  Iniciar Sesión  ]    │             │
│         └──────────────────────────┘             │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Main Layout (After Login)

```
┌──────────┬───────────────────────────────────────┐
│          │  Header: "Neuronita EVF"    👤 Dr. Cruz│
│ SIDEBAR  │───────────────────────────────────────│
│          │                                       │
│ 🏠 Inicio│         MAIN CONTENT AREA             │
│ 👥 Pacientes                                     │
│ 📋 Evaluaciones     (varies by page)             │
│ 📄 Informes                                      │
│ ⚙ Usuarios │                                     │
│          │                                       │
│          │                                       │
│ [Cerrar  │                                       │
│  Sesión] │                                       │
└──────────┴───────────────────────────────────────┘
```

### Patient List

```
┌─────────────────────────────────────────────────────────────┐
│ Pacientes                          [+ Nuevo Paciente]       │
│                                                             │
│ Buscar: [___________________] 🔍   Escuela: [Todos ▼]      │
│                                                             │
│ ┌─────────┬──────┬──────────┬───────┬─────────┬──────────┐ │
│ │ Nombre  │ Edad │ Escuela  │ Grado │ Última  │ Acciones │ │
│ │         │      │          │       │ Eval.   │          │ │
│ ├─────────┼──────┼──────────┼───────┼─────────┼──────────┤ │
│ │ María G.│ 8a2m │ Colegio X│ 3ro   │ 15/03/26│ [Ver]    │ │
│ │ Juan P. │ 10a5m│ Escuela Y│ 5to   │ 02/02/26│ [Ver]    │ │
│ └─────────┴──────┴──────────┴───────┴─────────┴──────────┘ │
│                                                             │
│ Mostrando 1-25 de 48    [< 1 2 >]                           │
└─────────────────────────────────────────────────────────────┘
```

### Evaluation Form (Tabbed)

```
┌─────────────────────────────────────────────────────────────┐
│ Evaluación — María González          Estado: Borrador       │
│ Fecha: 02/04/2026                                           │
│                                                             │
│ [Tab1 ✓] [Tab2 ✓] [Tab3] [Tab4] [Tab5] [Tab6] [Tab7]      │
│  Agudeza  Oculom.  Refrac. Binoc. Salud  Percep. Plan      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │         (Active tab content renders here)                │ │
│ │         See Tab layouts above                            │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 💾 Guardado automáticamente hace 12 seg.                    │
│                                                             │
│ [Guardar Borrador]                    [Completar Evaluación]│
└─────────────────────────────────────────────────────────────┘
```

---

## Environment Variables

### Server (.env)

```
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=neuronita_evf
DATABASE_USER=postgres
DATABASE_PASSWORD=your_db_password

# JWT
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars

# Encryption (32-byte hex key for AES-256)
ENCRYPTION_KEY=your_64_char_hex_encryption_key

# CORS
CORS_ORIGIN=http://localhost:5173

# File Storage
STORAGE_PATH=./storage/reports
# For production S3:
# AWS_S3_BUCKET=neuronita-evf-reports
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=xxx
# AWS_SECRET_ACCESS_KEY=xxx
```

### Client (.env)

```
VITE_API_URL=http://localhost:3000/api
```

---

## ICD-10 Codes Used in This System

| Code | Spanish Name | English Name |
|---|---|---|
| H55.81 | Disfunción Oculomotora | Oculomotor Dysfunction |
| H52.533 | Insuficiencia de Acomodación | Accommodative Insufficiency |
| H51.11 | Insuficiencia de Convergencia | Convergence Insufficiency |
| H51.12 | Exceso de Convergencia | Convergence Excess |
| H52.13 | Miopía | Myopia |
| H52.03 | Hipermetropía | Hyperopia |
| H52.23 | Astigmatismo | Astigmatism |

---

## HIPAA Compliance Requirements

### Technical Safeguards (Built Into the System)

| Requirement | Implementation |
|---|---|
| Encryption in transit | TLS 1.2+ (HTTPS only in production) |
| Encryption at rest | AES-256-GCM for PII fields, RDS encryption, S3 encryption |
| Access controls | JWT auth + RBAC on every endpoint |
| Unique user IDs | UUID-based, individual accounts (no shared logins) |
| Audit controls | All PHI access logged with user ID, timestamp, action |
| Automatic logoff | 15-minute idle timeout |
| Integrity controls | Parameterized queries, input validation, PDF hash verification |
| Emergency access | Documented admin recovery procedure |

### Administrative Safeguards (Documentation)

| Document | Purpose |
|---|---|
| Risk Assessment | Identify threats, vulnerabilities, mitigations |
| Access Control Policy | Who can access what, how access is granted/revoked |
| Password Policy | Complexity, expiry, lockout rules |
| Incident Response Plan | Steps if a breach is detected |
| Backup & Recovery Plan | RDS backups, recovery procedures, testing schedule |
| BAA with AWS | Signed via AWS Artifact |

### Data Handling Rules

- PII (name, DOB, phone, email) encrypted at application level before database storage
- Audit logs never contain PHI — only resource IDs and action types
- Soft delete only — PHI records are never hard deleted
- PDF reports stored encrypted
- No PHI in URL parameters
- No PHI in browser localStorage/sessionStorage
- No PHI in application logs

---

## Development Rules Summary

1. All config via environment variables — never hardcoded
2. UUID (v4) for all primary keys — never sequential IDs
3. All dates in UTC — convert to America/Puerto_Rico in frontend only
4. Parameterized queries for all SQL — never string concatenation
5. Input validation on every endpoint — Joi or Zod schemas
6. Audit log every PHI access — append-only, never modify/delete
7. RBAC enforced at middleware level — never frontend-only
8. Auto-save every 30 seconds — evaluations take 2 hours
9. Soft delete for all PHI records — never hard delete
10. PDF generated server-side only — never in browser
11. All UI text in Spanish — code in English
12. Consistent API response format: `{ success, data?, error? }`
13. Route → Controller → Service → Model pattern — no shortcuts
14. No PHI in logs — sanitize before logging
15. HttpOnly cookies for JWT — never localStorage
