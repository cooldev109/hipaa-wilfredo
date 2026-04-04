# HIPAA-Compliant EVF System — Development Roadmap

## MVP Goal

> Login → Create Patient → Fill Evaluation → Generate Signed PDF Report
> All encrypted, all audited, all in Spanish.

---

## Phase 0 — Project Foundation (Week 1)

### 0.1 Project Initialization

- [ ] Initialize Git repository and push to private GitHub repo
- [ ] Create `.gitignore` (node_modules, .env, dist, coverage, *.pdf generated)
- [ ] Create `.env.example` with all required environment variables
- [ ] Setup project root with `client/` and `server/` directories

### 0.2 Backend Scaffold (Node.js + Express)

- [ ] Initialize `server/` with `npm init`
- [ ] Install core dependencies:
  - express, cors, helmet, morgan
  - pg (PostgreSQL driver), knex (query builder + migrations)
  - jsonwebtoken, bcrypt
  - joi or zod (validation)
  - pino or winston (structured logging)
  - cookie-parser
  - uuid
  - dotenv
- [ ] Create folder structure:
  ```
  server/
  ├── index.js                 # Entry point
  ├── app.js                   # Express app setup
  ├── config/
  │   ├── database.js          # PostgreSQL connection pool
  │   ├── environment.js       # Env variable validation and export
  │   └── knexfile.js          # Knex migration config
  ├── routes/
  │   ├── index.js             # Route aggregator
  │   ├── authRoutes.js
  │   ├── patientRoutes.js
  │   ├── evaluationRoutes.js
  │   ├── reportRoutes.js
  │   └── userRoutes.js
  ├── controllers/
  │   ├── authController.js
  │   ├── patientController.js
  │   ├── evaluationController.js
  │   ├── reportController.js
  │   └── userController.js
  ├── services/
  │   ├── authService.js
  │   ├── patientService.js
  │   ├── evaluationService.js
  │   ├── reportService.js
  │   └── userService.js
  ├── models/
  │   ├── userModel.js
  │   ├── patientModel.js
  │   ├── evaluationModel.js
  │   ├── reportModel.js
  │   └── auditLogModel.js
  ├── middleware/
  │   ├── authenticate.js      # JWT verification
  │   ├── authorize.js         # RBAC middleware
  │   ├── auditLog.js          # PHI access logging
  │   ├── errorHandler.js      # Centralized error handler
  │   ├── rateLimiter.js       # Login attempt limiter
  │   └── validateRequest.js   # Schema validation wrapper
  └── utils/
      ├── encryption.js        # AES-256 encrypt/decrypt for PII
      ├── logger.js            # Structured JSON logger
      ├── pdfGenerator.js      # Report PDF creation
      └── constants.js         # Roles, status enums, ICD-10 codes
  ```
- [ ] Create Express app with middleware chain:
  1. helmet (security headers)
  2. cors (whitelist frontend origin)
  3. cookie-parser
  4. express.json (body parser, limit: 10mb)
  5. morgan or pino-http (request logging, sanitized)
  6. routes
  7. errorHandler (catch-all)
- [ ] Create environment config that validates all required env vars on startup:
  ```
  DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET,
  ENCRYPTION_KEY, CORS_ORIGIN, PORT, NODE_ENV
  ```
- [ ] Create database connection pool with pg
- [ ] Create structured logger (JSON format, no PHI in logs)
- [ ] Create centralized error handler middleware
- [ ] Verify server starts and responds to `GET /api/health`

### 0.3 Frontend Scaffold (React + Vite)

- [ ] Initialize `client/` with `npm create vite@latest` (React template)
- [ ] Install core dependencies:
  - react-router-dom
  - axios
  - dayjs (date handling)
- [ ] Create folder structure:
  ```
  client/src/
  ├── App.jsx                  # Router setup
  ├── main.jsx                 # Entry point
  ├── components/
  │   ├── common/
  │   │   ├── Button.jsx
  │   │   ├── Input.jsx
  │   │   ├── Select.jsx
  │   │   ├── Modal.jsx
  │   │   ├── LoadingSpinner.jsx
  │   │   └── Alert.jsx
  │   ├── forms/
  │   │   ├── OdOsInput.jsx          # Reusable OD/OS pair input
  │   │   ├── VisualAcuityInput.jsx  # 20/___ fraction input
  │   │   ├── PrescriptionInput.jsx  # Sphere/Cylinder/Axis
  │   │   ├── ScaleRating.jsx        # 1-2-3-4 scale
  │   │   └── SignatureCanvas.jsx    # Digital signature capture
  │   └── layout/
  │       ├── AppLayout.jsx          # Main layout with sidebar
  │       ├── Header.jsx
  │       ├── Sidebar.jsx
  │       └── ProtectedRoute.jsx     # Auth guard
  ├── pages/
  │   ├── auth/
  │   │   └── LoginPage.jsx
  │   ├── patients/
  │   │   ├── PatientListPage.jsx
  │   │   ├── PatientCreatePage.jsx
  │   │   └── PatientDetailPage.jsx
  │   ├── evaluations/
  │   │   ├── EvaluationListPage.jsx
  │   │   └── EvaluationFormPage.jsx  # Tabbed form (7 tabs)
  │   ├── reports/
  │   │   ├── ReportListPage.jsx
  │   │   └── ReportPreviewPage.jsx
  │   └── admin/
  │       └── UserManagementPage.jsx
  ├── context/
  │   └── AuthContext.jsx      # Auth state, login/logout, token refresh
  ├── services/
  │   ├── api.js               # Axios instance with interceptors
  │   ├── authService.js       # login, logout, refresh
  │   ├── patientService.js    # CRUD operations
  │   ├── evaluationService.js # CRUD + auto-save
  │   ├── reportService.js     # Generate, download, sign
  │   └── userService.js       # Admin user management
  ├── hooks/
  │   ├── useAuth.js           # Auth context consumer
  │   ├── useAutoSave.js       # 30-second auto-save for evaluations
  │   └── useIdleTimeout.js    # 15-min inactivity logout
  └── utils/
      ├── formatters.js        # Date, age, prescription formatters
      ├── validators.js        # Form validation helpers
      └── constants.js         # Roles, routes, form options
  ```
- [ ] Create Axios instance (`api.js`) with:
  - Base URL from env
  - `withCredentials: true` (for HttpOnly cookies)
  - Response interceptor: on 401 → attempt token refresh → retry or redirect to login
  - Request interceptor: attach CSRF token if implemented
- [ ] Create AuthContext with:
  - `user` state (id, name, role)
  - `login(email, password)` function
  - `logout()` function
  - `isAuthenticated` boolean
  - Auto-refresh on app mount (check if refresh token is valid)
- [ ] Create ProtectedRoute component (redirects to login if not authenticated)
- [ ] Create AppLayout with sidebar navigation
- [ ] Create basic Login page (functional, no styling yet)
- [ ] Verify frontend starts, routes work, login page renders

### 0.4 Database Schema Design

- [ ] Install and configure Knex for migrations
- [ ] Create migration: `001_create_users_table.js`
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('doctor', 'assistant', 'secretary')),
    license_number VARCHAR(50),          -- For doctors
    is_active BOOLEAN DEFAULT true,
    force_password_change BOOLEAN DEFAULT true,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
  );
  ```

- [ ] Create migration: `002_create_patients_table.js`
  ```sql
  CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name_encrypted TEXT NOT NULL,       -- AES-256 encrypted
    last_name_encrypted TEXT NOT NULL,        -- AES-256 encrypted
    date_of_birth_encrypted TEXT NOT NULL,    -- AES-256 encrypted
    sex VARCHAR(1) NOT NULL CHECK (sex IN ('M', 'F')),
    school VARCHAR(255),
    grade VARCHAR(50),
    referred_by VARCHAR(255),
    parent_guardian_name_encrypted TEXT,      -- AES-256 encrypted
    parent_guardian_phone_encrypted TEXT,     -- AES-256 encrypted
    parent_guardian_email_encrypted TEXT,     -- AES-256 encrypted
    search_hash VARCHAR(64),                 -- HMAC hash of name for searching
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP                     -- Soft delete
  );
  ```

- [ ] Create migration: `003_create_patient_history_table.js`
  ```sql
  CREATE TABLE patient_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    visual_history TEXT,
    medical_history TEXT,
    medications TEXT,
    family_ocular_history TEXT,
    family_medical_history TEXT,
    developmental_birth_weeks INTEGER,
    developmental_birth_type VARCHAR(50),       -- natural, cesarean
    developmental_crawled_months INTEGER,
    developmental_walked_months INTEGER,
    developmental_talked_months INTEGER,
    therapies JSONB DEFAULT '{}',
    -- therapies structure:
    -- {
    --   "occupational": boolean,
    --   "occupational_sensory": boolean,
    --   "speech": boolean,
    --   "physical": boolean,
    --   "educational": boolean,
    --   "psychological": boolean,
    --   "functional_vision": boolean
    -- }
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
  );
  ```

- [ ] Create migration: `004_create_evaluations_table.js`
  ```sql
  CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    evaluation_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'complete', 'signed')),
    reason_for_visit TEXT,

    -- Visual Acuity (Near)
    va_near_aided_od VARCHAR(10),          -- e.g., "20/20"
    va_near_aided_os VARCHAR(10),
    va_near_aided_ou VARCHAR(10),
    va_near_unaided_od VARCHAR(10),
    va_near_unaided_os VARCHAR(10),
    va_near_unaided_ou VARCHAR(10),
    va_near_method VARCHAR(20),            -- snellen, lea, bw, pl

    -- Visual Acuity (Distance)
    va_distance_aided_od VARCHAR(10),
    va_distance_aided_os VARCHAR(10),
    va_distance_aided_ou VARCHAR(10),
    va_distance_unaided_od VARCHAR(10),
    va_distance_unaided_os VARCHAR(10),
    va_distance_unaided_ou VARCHAR(10),
    va_distance_method VARCHAR(20),

    -- Color Vision
    color_vision_test VARCHAR(50),         -- "ishihara"
    color_vision_result VARCHAR(100),

    -- Stereo
    stereo_test VARCHAR(50),              -- "randot"
    stereo_result VARCHAR(100),

    -- Cover Test
    cover_test_distance TEXT,
    cover_test_near TEXT,

    -- Pursuits & Saccades
    pursuits_ou INTEGER CHECK (pursuits_ou BETWEEN 1 AND 4),
    saccades_ou INTEGER CHECK (saccades_ou BETWEEN 1 AND 4),

    -- NPC
    npc_1_blur VARCHAR(20),
    npc_1_break VARCHAR(20),
    npc_1_recovery VARCHAR(20),
    npc_2_blur VARCHAR(20),
    npc_2_break VARCHAR(20),
    npc_2_recovery VARCHAR(20),

    -- NPA & Sheard's
    npa_od VARCHAR(20),
    npa_os VARCHAR(20),
    sheards_od VARCHAR(20),
    sheards_os VARCHAR(20),
    minimum_aoa VARCHAR(20),               -- Auto-calculated: 15 - (age/4)

    -- Refraction: Retinoscopy
    retinoscopy_od TEXT,                   -- Stored as JSON string: {"sphere":,"cylinder":,"axis":}
    retinoscopy_os TEXT,

    -- Refraction: Subjective
    subjective_refraction_od TEXT,
    subjective_refraction_os TEXT,

    -- Refraction: Final Prescription
    final_rx_od TEXT,
    final_rx_os TEXT,
    final_rx_add VARCHAR(20),

    -- Post-Refraction Visual Acuity
    post_rx_va_retinoscopy_od VARCHAR(10),
    post_rx_va_retinoscopy_os VARCHAR(10),
    post_rx_va_retinoscopy_ou VARCHAR(10),
    post_rx_va_subjective_od VARCHAR(10),
    post_rx_va_subjective_os VARCHAR(10),
    post_rx_va_subjective_ou VARCHAR(10),
    post_rx_va_final_od VARCHAR(10),
    post_rx_va_final_os VARCHAR(10),
    post_rx_va_final_ou VARCHAR(10),

    -- Phorias
    phoria_distance_h VARCHAR(30),
    phoria_distance_v VARCHAR(30),
    phoria_near_h VARCHAR(30),
    phoria_near_v VARCHAR(30),

    -- Vergences
    vergence_distance_bi TEXT,             -- JSON: {"blur":,"break":,"recovery":}
    vergence_distance_bo TEXT,
    vergence_distance_bu VARCHAR(20),
    vergence_distance_bd VARCHAR(20),
    vergence_near_bi TEXT,
    vergence_near_bo TEXT,
    vergence_near_bu VARCHAR(20),
    vergence_near_bd VARCHAR(20),

    -- Ocular Health: External
    ext_lids_lash_od VARCHAR(100),
    ext_lids_lash_os VARCHAR(100),
    ext_conj_od VARCHAR(100),
    ext_conj_os VARCHAR(100),
    ext_cornea_od VARCHAR(100),
    ext_cornea_os VARCHAR(100),
    ext_iris_od VARCHAR(100),
    ext_iris_os VARCHAR(100),
    ext_angles_od JSONB,                   -- [I, II, III, IV]
    ext_angles_os JSONB,
    ext_pupils_od VARCHAR(100),
    ext_pupils_os VARCHAR(100),

    -- Ocular Health: Internal
    int_lens_od VARCHAR(100),
    int_lens_os VARCHAR(100),
    int_media_od VARCHAR(100),
    int_media_os VARCHAR(100),
    int_cd_od VARCHAR(20),
    int_cd_os VARCHAR(20),
    int_av_od VARCHAR(100),
    int_av_os VARCHAR(100),
    int_macula_fr_od VARCHAR(100),
    int_macula_fr_os VARCHAR(100),

    -- RightEye Test
    righteye_global_score DECIMAL(5,2),
    righteye_tracking_score DECIMAL(5,2),
    righteye_saccadic_score DECIMAL(5,2),
    righteye_fixation_score DECIMAL(5,2),

    -- Garner Reversal Test
    garner_unknown_errors INTEGER,
    garner_unknown_mean DECIMAL(5,2),
    garner_unknown_sd DECIMAL(5,2),
    garner_reversed_errors INTEGER,
    garner_reversed_mean DECIMAL(5,2),
    garner_reversed_sd DECIMAL(5,2),
    garner_recognition_errors INTEGER,
    garner_recognition_mean DECIMAL(5,2),

    -- Beery VMI
    vmi_raw_score INTEGER,
    vmi_chronological_age VARCHAR(20),
    vmi_perceptual_age VARCHAR(20),
    vmi_standard_score INTEGER,
    vmi_percentile INTEGER,

    -- Visual Perception (Beery VP)
    vp_raw_score INTEGER,
    vp_chronological_age VARCHAR(20),
    vp_perceptual_age VARCHAR(20),
    vp_standard_score INTEGER,
    vp_percentile INTEGER,

    -- Assessment & Plan
    assessment_notes TEXT,
    diagnoses JSONB DEFAULT '[]',
    -- diagnoses structure:
    -- [
    --   {"code": "H55.81", "name": "Disfuncion Oculomotora", "active": true},
    --   {"code": "H52.533", "name": "Insuficiencia de Acomodacion", "active": true},
    --   ...
    -- ]
    plan_rx_od TEXT,
    plan_rx_os TEXT,
    plan_rx_add VARCHAR(20),
    recommendations JSONB DEFAULT '[]',

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP,
    last_auto_saved_at TIMESTAMP
  );
  ```

- [ ] Create migration: `005_create_reports_table.js`
  ```sql
  CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'signed')),
    report_data JSONB NOT NULL,             -- Snapshot of data used to generate
    pdf_file_path TEXT,                     -- Local path or S3 key
    pdf_file_hash VARCHAR(64),             -- SHA-256 hash for integrity verification
    doctor_signature_data TEXT,             -- Base64 signature image
    doctor_signed_at TIMESTAMP,
    doctor_signed_by UUID REFERENCES users(id),
    parent_signature_data TEXT,             -- Base64 signature image
    parent_signed_at TIMESTAMP,
    parent_signer_name VARCHAR(200),
    condition_blocks JSONB DEFAULT '[]',    -- Which narrative blocks are included
    -- condition_blocks structure:
    -- [
    --   {"key": "oculomotor_dysfunction", "included": true},
    --   {"key": "convergence_insufficiency", "included": true},
    --   {"key": "accommodation_difficulty", "included": true},
    --   {"key": "hyperopia", "included": false},
    --   {"key": "myopia", "included": true},
    --   {"key": "astigmatism", "included": true},
    --   ...
    -- ]
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id)
  );
  ```

- [ ] Create migration: `006_create_audit_logs_table.js`
  ```sql
  CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    user_email VARCHAR(255),
    action VARCHAR(50) NOT NULL,
    -- Actions: LOGIN, LOGOUT, FAILED_LOGIN, TOKEN_REFRESH,
    -- PASSWORD_CHANGE, PATIENT_CREATE, PATIENT_READ,
    -- PATIENT_UPDATE, PATIENT_DELETE, EVALUATION_CREATE,
    -- EVALUATION_READ, EVALUATION_UPDATE, EVALUATION_DELETE,
    -- EVALUATION_STATUS_CHANGE, REPORT_GENERATE, REPORT_DOWNLOAD,
    -- REPORT_SIGN, REPORT_VIEW, USER_CREATE, USER_UPDATE,
    -- USER_ROLE_CHANGE, USER_DEACTIVATE
    resource VARCHAR(50),                  -- patients, evaluations, reports, users
    resource_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,                         -- Additional context (never contains PHI)
    -- details examples:
    -- { "status_from": "draft", "status_to": "complete" }
    -- { "fields_modified": ["assessment_notes", "diagnoses"] }
    -- { "reason": "invalid_password" }
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- Index for querying audit logs
  CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
  CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, resource_id);
  CREATE INDEX idx_audit_logs_action ON audit_logs(action);
  CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
  ```

- [ ] Create migration: `007_create_refresh_tokens_table.js`
  ```sql
  CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    token_hash VARCHAR(64) NOT NULL,        -- SHA-256 hash of the refresh token
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT
  );

  CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
  CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
  ```

- [ ] Create seed: `001_create_admin_user.js`
  ```
  Insert default admin/doctor account:
  email: admin@neuronita.com
  password: (generated, must change on first login)
  role: doctor
  ```

- [ ] Run all migrations and verify schema

### 0.5 Development Environment Verification

- [ ] Backend starts on port 3000, connects to PostgreSQL
- [ ] Frontend starts on port 5173, proxy to backend works
- [ ] Health endpoint returns `{ success: true }`
- [ ] Migrations run and rollback cleanly
- [ ] Seed creates admin user
- [ ] `.env.example` documents all required variables
- [ ] `.gitignore` excludes sensitive files
- [ ] Push initial commit to GitHub

---

## Phase 1 — Authentication & User Management (Week 2)

### 1.1 Authentication Backend

- [ ] Create `authService.js`:
  - `login(email, password)` → validate credentials, generate access + refresh tokens
  - `refresh(refreshToken)` → validate refresh token, rotate tokens, revoke old
  - `logout(refreshToken)` → revoke refresh token
  - `changePassword(userId, oldPassword, newPassword)` → validate old, hash new
- [ ] Create `authController.js`:
  - `POST /api/auth/login` → set HttpOnly cookies (accessToken + refreshToken)
  - `POST /api/auth/refresh` → rotate tokens
  - `POST /api/auth/logout` → clear cookies, revoke token
  - `POST /api/auth/change-password` → requires current password
  - `GET /api/auth/me` → return current user profile
- [ ] Implement JWT token generation:
  - Access token payload: `{ userId, email, role }`, expires 15min
  - Refresh token: random bytes, hashed in DB, expires 7 days
- [ ] Set cookies:
  ```
  accessToken:  HttpOnly, Secure (prod), SameSite=Strict, Path=/api, Max-Age=900
  refreshToken: HttpOnly, Secure (prod), SameSite=Strict, Path=/api/auth/refresh, Max-Age=604800
  ```
- [ ] Implement `authenticate.js` middleware:
  - Extract access token from cookie
  - Verify JWT signature and expiry
  - Attach `req.user = { userId, email, role }` to request
  - Return 401 if invalid/expired
- [ ] Implement `rateLimiter.js`:
  - Track failed login attempts per email in DB (`failed_login_attempts` column)
  - After 5 failures → lock account for 15 minutes (`locked_until`)
  - Reset counter on successful login
- [ ] Audit logging for all auth events:
  - LOGIN (success), FAILED_LOGIN (with reason), LOGOUT, TOKEN_REFRESH, PASSWORD_CHANGE

### 1.2 Authentication Frontend

- [ ] Create `LoginPage.jsx`:
  - Email + password form
  - Error messages in Spanish ("Credenciales incorrectas", "Cuenta bloqueada")
  - Loading state during login
  - Redirect to dashboard on success
- [ ] Implement `AuthContext.jsx`:
  - On app mount: call `GET /api/auth/me` to restore session
  - `login()` → call API → store user in state → redirect
  - `logout()` → call API → clear state → redirect to login
  - `isAuthenticated`, `user`, `role` exposed via context
- [ ] Create `ProtectedRoute.jsx`:
  - Wraps routes that require authentication
  - Redirects to `/login` if not authenticated
  - Optional `allowedRoles` prop for RBAC
- [ ] Implement `useIdleTimeout.js` hook:
  - Track mouse/keyboard/touch events
  - After 15 minutes of inactivity → auto-logout
  - Show warning modal at 13 minutes ("Su sesion expirara en 2 minutos")
- [ ] Configure Axios interceptor:
  - On 401 response → try `POST /api/auth/refresh`
  - If refresh succeeds → retry original request
  - If refresh fails → logout and redirect to login
- [ ] Create force-password-change flow:
  - If `user.force_password_change === true` → redirect to change password form
  - Block access to all other pages until password is changed

### 1.3 User Management

- [ ] Create `userController.js` (doctor-only endpoints):
  - `POST /api/users` → create new user (admin generates initial password)
  - `GET /api/users` → list all users
  - `PUT /api/users/:id` → update user details
  - `PATCH /api/users/:id/deactivate` → soft deactivate (set is_active=false)
  - `PATCH /api/users/:id/role` → change role
- [ ] Create `authorize.js` middleware:
  ```javascript
  // Usage: authorize('doctor', 'assistant')
  // Returns 403 if user role not in allowed list
  ```
- [ ] Create `UserManagementPage.jsx`:
  - Table of users (name, email, role, status, last login)
  - Create user modal (first name, last name, email, role)
  - Edit user modal
  - Deactivate user button with confirmation
  - Only accessible to doctor role
- [ ] Audit logging for user management events

### 1.4 Phase 1 Verification

- [ ] Login works with valid credentials
- [ ] Login fails and locks after 5 attempts
- [ ] Access token expires after 15 minutes, refresh works
- [ ] Idle timeout logs out user after 15 minutes
- [ ] Force password change works on first login
- [ ] Doctor can create/edit/deactivate users
- [ ] Assistant and secretary cannot access user management
- [ ] All auth events appear in audit_logs table

---

## Phase 2 — Patient Management (Week 3)

### 2.1 Encryption Utility

- [ ] Create `encryption.js` utility:
  - `encrypt(plainText)` → AES-256-GCM encrypted string (iv + authTag + ciphertext)
  - `decrypt(encryptedText)` → original plain text
  - `createSearchHash(text)` → HMAC-SHA256 hash for searchable encrypted fields
  - Uses `ENCRYPTION_KEY` from environment (32-byte key)
- [ ] Write tests for encrypt/decrypt round-trip
- [ ] Write test for search hash consistency

### 2.2 Patient Backend

- [ ] Create `patientModel.js`:
  - `create(patientData)` → insert with encrypted PII fields
  - `findById(id)` → select and decrypt PII fields
  - `findAll(filters)` → list with decrypted names (paginated)
  - `search(nameQuery)` → search by HMAC hash
  - `update(id, patientData)` → update with re-encrypted PII
  - `softDelete(id)` → set deleted_at timestamp
- [ ] Create `patientService.js`:
  - Business logic: validate patient data, check duplicates, encrypt before save
  - Calculate age from DOB (years and months)
  - Merge patient + history in detail view
- [ ] Create `patientController.js`:
  - `POST /api/patients` → create patient + history (roles: all)
  - `GET /api/patients` → list patients with search/filter (roles: all)
  - `GET /api/patients/:id` → patient detail with history (roles: all, audit logged)
  - `PUT /api/patients/:id` → update patient info (roles: all)
  - `PUT /api/patients/:id/history` → update patient history (roles: doctor, assistant)
  - `DELETE /api/patients/:id` → soft delete (roles: doctor only)
- [ ] Apply middleware to all patient routes:
  - `authenticate` → verify JWT
  - `authorize(roles)` → check RBAC
  - `auditLog` → log PHI access
- [ ] Input validation schemas (Joi/Zod):
  - Patient: first_name (required), last_name (required), date_of_birth (required, valid date), sex (M/F)
  - History: all fields optional, developmental fields are integers when provided
  - Therapies: object with boolean values

### 2.3 Patient Frontend

- [ ] Create `PatientListPage.jsx`:
  - Table: patient name, age, school, grade, last evaluation date
  - Search bar (search by name)
  - Filter by school, grade
  - Pagination (25 per page)
  - "Nuevo Paciente" button
  - Click row → navigate to patient detail
- [ ] Create `PatientCreatePage.jsx`:
  - Form sections:
    - Datos Personales: nombre, apellido, fecha nacimiento, sexo, escuela, grado, referido por
    - Padre/Encargado: nombre, telefono, email
    - Historial Visual, Historial Medico, Medicamentos
    - Historial Familiar Ocular, Historial Medico Familiar
    - Desarrollo Motor: semanas de nacimiento, tipo de parto, gateo (meses), camino (meses), hablo (meses)
    - Terapias: 7 checkboxes (TO, TOS, THL, TP, TE, TPSIC, VF)
  - Validation: required fields highlighted, error messages in Spanish
  - On submit → redirect to patient detail page
- [ ] Create `PatientDetailPage.jsx`:
  - Display all patient info and history
  - Edit button → inline editing or modal
  - List of evaluations for this patient (with dates and status)
  - "Nueva Evaluacion" button → navigate to evaluation form
  - "Eliminar Paciente" button (doctor only, with confirmation modal)
- [ ] Create reusable form components:
  - `PatientInfoForm.jsx` — personal data fields
  - `PatientHistoryForm.jsx` — medical/developmental history
  - `TherapiesCheckboxGroup.jsx` — 7 therapy checkboxes

### 2.4 Phase 2 Verification

- [ ] Create patient with all fields, verify PII is encrypted in database
- [ ] Search patient by name, verify results are correct
- [ ] View patient detail, verify PII is decrypted correctly
- [ ] Edit patient and history, verify audit log entries created
- [ ] Soft delete patient, verify record still exists with deleted_at set
- [ ] Secretary can create/edit patients
- [ ] Secretary cannot see evaluations section
- [ ] All patient access events appear in audit_logs

---

## Phase 3 — Evaluation Form (Weeks 4-5)

### 3.1 Evaluation Backend

- [ ] Create `evaluationModel.js`:
  - `create(evaluationData)` → insert new evaluation (status: draft)
  - `findById(id)` → full evaluation with patient info
  - `findByPatientId(patientId)` → list evaluations for a patient
  - `update(id, evaluationData)` → update fields, set updated_at
  - `updateStatus(id, status)` → change draft → complete → signed
  - `autoSave(id, partialData)` → partial update, set last_auto_saved_at
  - `softDelete(id)` → set deleted_at
- [ ] Create `evaluationService.js`:
  - Auto-calculate minimum AOA: `15 - (patientAge / 4)`
  - Validate status transitions: draft → complete → signed (never backwards)
  - Validate clinical data ranges where applicable
- [ ] Create `evaluationController.js`:
  - `POST /api/evaluations` → create for patient (roles: doctor, assistant)
  - `GET /api/evaluations/:id` → get full evaluation (roles: doctor, assistant)
  - `PUT /api/evaluations/:id` → update evaluation (roles: doctor, assistant)
  - `PATCH /api/evaluations/:id/auto-save` → auto-save partial data (roles: doctor, assistant)
  - `PATCH /api/evaluations/:id/status` → change status (complete: doctor/assistant, signed: doctor)
  - `DELETE /api/evaluations/:id` → soft delete (roles: doctor)
  - `GET /api/patients/:patientId/evaluations` → list for patient (roles: doctor, assistant)
- [ ] Audit logging for all evaluation operations

### 3.2 Evaluation Form Frontend — Reusable Components

- [ ] Create `OdOsInput.jsx`:
  - Two-column layout: OD (right eye) | OS (left eye)
  - Accepts any child input type
  - Used across 10+ sections of the form
- [ ] Create `VisualAcuityInput.jsx`:
  - Displays as "20/" with numeric input after
  - Validates range (20/10 to 20/400)
- [ ] Create `PrescriptionInput.jsx`:
  - Three fields: Sphere (+/- diopters), Cylinder (+/- diopters), Axis (0-180 degrees)
  - Step increments of 0.25 for sphere/cylinder
- [ ] Create `ScaleRating.jsx`:
  - Horizontal radio buttons: 4 — 3 — 2 — 1
  - Used for pursuits and saccades
- [ ] Create `NpcInput.jsx`:
  - Three fields in a row: Blur | Break | Recovery
  - Numeric inputs (cm)
- [ ] Create `VergenceInput.jsx`:
  - Fields for BI/BO with Blur/Break/Recovery sub-fields
- [ ] Create `OcularHealthTable.jsx`:
  - Two-column table for OD/OS
  - Rows for each structure (lids, cornea, etc.)
  - Text input per cell, with "normal" quick-fill button
- [ ] Create `ScoredTestTable.jsx`:
  - Reusable for Garner, VMI, and VP tables
  - Columns: raw score, age, perceptual age, standard score, percentile

### 3.3 Evaluation Form Frontend — Tabbed Form Page

- [ ] Create `EvaluationFormPage.jsx`:
  - Tab navigation with 7 tabs
  - Visual indicator for completed/incomplete tabs
  - "Guardar Borrador" (Save Draft) button — always visible
  - "Completar Evaluacion" button — only when all required tabs are filled
  - Auto-save indicator ("Guardado automaticamente hace X segundos")
  - Unsaved changes warning when navigating away

- [ ] **Tab 1: Agudeza Visual y Pruebas Basicas**
  - Visual Acuity Near: OD/OS/OU × Aided/Unaided (6 fraction inputs) + method selector
  - Visual Acuity Distance: same structure (6 fraction inputs) + method selector
  - Color Vision: test name (Ishihara default) + result (Normal/Anormal + details)
  - Stereo: test name (Randot default) + result (arc-seconds)
  - Cover Test: Distance (text) + Near (text)

- [ ] **Tab 2: Oculomotor y Acomodacion**
  - Pursuits OU: ScaleRating (4-3-2-1)
  - Saccades OU: ScaleRating (4-3-2-1)
  - NPC #1: Blur / Break / Recovery
  - NPC #2: Blur / Break / Recovery
  - NPA: OD / OS
  - Sheard's: OD / OS
  - Minimum AOA: auto-calculated, displayed read-only
  - RightEye Scores: Global, Tracking, Saccadic, Fixation (numeric, expected >75 shown)

- [ ] **Tab 3: Refraccion**
  - Retinoscopy: OD + OS (PrescriptionInput)
  - Subjective Refraction: OD + OS (PrescriptionInput)
  - Final Prescription: OD + OS + ADD (PrescriptionInput + ADD field)
  - Post-Refraction VA table: 3 rows (retinoscopy, subjective, final) × OD/OS/OU

- [ ] **Tab 4: Vision Binocular**
  - Phorias: Distance H/V, Near H/V (numeric + eso/exo/hyper selector)
  - Vergences Distance: BI (blur/break/recovery), BO (blur/break/recovery), BU, BD
  - Vergences Near: BI (blur/break/recovery), BO (blur/break/recovery), BU, BD

- [ ] **Tab 5: Salud Ocular**
  - External Health Table: Lids/Lash, Conj, Cornea, Iris, Angles (I-IV), Pupils — OD/OS
  - Internal Health Table: Lens, Media, C/D, A/V, Macula/FR — OD/OS
  - "Todo Normal" quick-fill button for each table

- [ ] **Tab 6: Pruebas Perceptuales**
  - Garner Reversal Test table: Unknown/Reversed/Recognition × Errors/Mean/SD
  - Beery VMI table: Raw Score, Chronological Age, Perceptual Age, Standard Score, Percentile
  - Visual Perception table: same structure as VMI

- [ ] **Tab 7: Evaluacion y Plan**
  - Assessment: rich text area for clinical notes
  - Diagnoses: checkboxes with pre-loaded ICD-10 codes:
    - H55.81 — Disfuncion Oculomotora
    - H52.533 — Insuficiencia de Acomodacion
    - H51.11 — Insuficiencia de Convergencia
    - H51.12 — Exceso de Convergencia
    - H52.13 — Miopia
    - H52.03 — Hipermetropia
    - H52.23 — Astigmatismo
    - (option to add custom diagnosis)
  - Plan RX: OD, OS, ADD (PrescriptionInput)
  - Recommendations: checklist of pre-built options:
    - Terapia Visual Funcional
    - Espejuelos terapeuticos
    - Re-evaluacion en X meses
    - (free text for additional recommendations)

### 3.4 Auto-Save Implementation

- [ ] Create `useAutoSave.js` hook:
  ```
  - Track form state changes via a dirty flag
  - Every 30 seconds, if dirty:
    - Send PATCH /api/evaluations/:id/auto-save with changed fields only
    - Update last_auto_saved_at display
    - Reset dirty flag
  - On tab change within form: trigger immediate save
  - On browser close/navigate away: trigger save (via beforeunload)
  ```
- [ ] Backend auto-save endpoint:
  - Accepts partial data (only fields that changed)
  - Does NOT change evaluation status
  - Updates `last_auto_saved_at` timestamp
  - Minimal validation (just type checking, not completeness)

### 3.5 Phase 3 Verification

- [ ] Create new evaluation for a patient
- [ ] Fill all 7 tabs with test data
- [ ] Auto-save fires every 30 seconds, data persists on page reload
- [ ] Tab completion indicators work correctly
- [ ] Save as draft, close, reopen — all data intact
- [ ] Mark as complete — validate required fields
- [ ] Minimum AOA auto-calculates from patient age
- [ ] OD/OS components render correctly across all sections
- [ ] Secretary cannot access evaluation pages
- [ ] All evaluation access/edit events in audit_logs

---

## Phase 4 — Report Generation & Digital Signatures (Weeks 6-7)

### 4.1 Report Template Engine

- [ ] Create `reportTemplateService.js`:
  - Define all narrative blocks from the DOCX template as structured text:
    ```
    BLOCKS:
    - header (always included)
    - reason_for_visit (always included)
    - history (always included)
    - tests_performed (always included)
    - ocular_health (always included)
    - color_vision (always included)
    - visual_acuity (always included)
    - refractive_state_hyperopia (conditional)
    - refractive_state_myopia (conditional)
    - refractive_state_astigmatism (conditional)
    - oculomotor_control (conditional)
    - righteye_results (conditional)
    - oculomotor_dysfunction_diagnosis (conditional)
    - accommodation (conditional)
    - accommodation_difficulty (conditional)
    - binocular_integration (conditional)
    - convergence_insufficiency (conditional)
    - convergence_excess (conditional)
    - depth_perception (conditional)
    - garner_reversal (conditional)
    - vmi_results (conditional)
    - visual_perception_results (conditional)
    - summary_diagnoses (always included)
    - recommendations (always included)
    - visual_hygiene (always included)
    - signatures (always included)
    ```
  - Each block is a function that receives evaluation + patient data and returns formatted text/HTML
  - Conditional blocks are activated based on selected diagnoses

- [ ] Create data interpolation logic:
  - Replace `[Nombre]` with patient name throughout
  - Insert scores, ages, measurements into narrative text
  - Format dates in Spanish (e.g., "2 de abril de 2026")
  - Format age as "X anos con Y meses"

- [ ] Create `reportAssemblyService.js`:
  - Input: evaluation ID + selected condition blocks
  - Process:
    1. Load evaluation + patient data
    2. Determine which blocks to include (from condition_blocks selection)
    3. Call each block's template function with the data
    4. Assemble blocks in order into complete document
  - Output: complete HTML/structured content for PDF rendering

### 4.2 PDF Generation

- [ ] Install and configure Puppeteer (or alternative: pdf-lib, pdfmake)
- [ ] Create `pdfGenerator.js`:
  - Input: assembled HTML report content
  - Apply clinic branding:
    - Header: Neuronita logo, clinic address, phone, fax, email
    - Footer: page numbers
    - Font: professional, readable
  - Layout: Letter size (8.5 x 11), margins
  - Include visual acuity table, test score tables
  - Include digital signature images (doctor + parent)
  - Output: PDF buffer
- [ ] Create `reportController.js`:
  - `POST /api/reports/generate` → create report from evaluation (roles: doctor)
    - Body: `{ evaluationId, conditionBlocks: [...] }`
    - Saves report record + generates PDF
  - `GET /api/reports/:id/preview` → return report data for on-screen preview (roles: doctor)
  - `GET /api/reports/:id/download` → stream PDF file (roles: doctor, audit logged)
  - `GET /api/evaluations/:evaluationId/reports` → list report versions (roles: doctor)
  - `POST /api/reports/:id/sign/doctor` → attach doctor signature (roles: doctor)
  - `POST /api/reports/:id/sign/parent` → attach parent signature (roles: doctor)
- [ ] PDF storage:
  - Development: save to `server/storage/reports/` directory (gitignored)
  - Production: S3 (configured via env variable, implemented in Week 9)
  - File naming: `report_{patientId}_{evaluationDate}_v{version}.pdf`

### 4.3 Digital Signatures

- [ ] Create `SignatureCanvas.jsx`:
  - HTML5 Canvas for freehand signature drawing
  - Clear button to reset
  - Outputs Base64 PNG data
  - Touch-compatible (for tablet use in the office)
  - Border and "Firme aqui" instruction text
- [ ] Doctor signature flow:
  1. Doctor clicks "Firmar Informe" on report preview
  2. Signature canvas modal opens
  3. Doctor draws signature
  4. Signature saved to report record + embedded in PDF
  5. Report status → 'signed'
  6. PDF regenerated with embedded signature
- [ ] Parent/Guardian signature flow:
  1. Doctor opens report in "signature mode" (e.g., hands tablet to parent)
  2. Parent sees simplified view: report summary + signature canvas
  3. Parent types name + draws signature
  4. Signature saved + embedded in PDF
  5. Final PDF generated with both signatures
- [ ] Signature data stored as Base64 in the `reports` table
- [ ] Once both signatures are captured, PDF is finalized (cannot be modified)

### 4.4 Report Frontend

- [ ] Create `ReportPreviewPage.jsx`:
  - On-screen HTML preview of the assembled report
  - Condition block selector:
    - Checklist of all possible diagnostic blocks
    - Pre-checked based on evaluation diagnoses
    - Doctor can toggle blocks on/off before generating
  - "Generar PDF" button → calls generate endpoint
  - "Vista Previa" updates in real-time as blocks are toggled
  - After PDF generated: "Descargar PDF", "Firmar", "Enviar" buttons

- [ ] Create `ReportListPage.jsx`:
  - Table: patient name, evaluation date, report version, status, actions
  - Filter by status (draft, final, signed)
  - Quick actions: download, view, sign

- [ ] Create report generation flow:
  1. From patient detail → select evaluation → click "Generar Informe"
  2. Report preview page loads with all data interpolated
  3. Doctor reviews, toggles condition blocks as needed
  4. Doctor clicks "Generar PDF"
  5. System creates report record, generates PDF, returns for preview/download
  6. Doctor signs → parent signs → report finalized

### 4.5 Phase 4 Verification

- [ ] Generate report from a complete evaluation
- [ ] All patient data correctly interpolated into narrative
- [ ] Condition blocks toggle on/off correctly
- [ ] PDF renders with correct layout, tables, and formatting
- [ ] Clinic header (Neuronita) appears on PDF
- [ ] Doctor signature captured and embedded in PDF
- [ ] Parent signature captured and embedded in PDF
- [ ] Report versioning works (regenerate creates v2, v1 preserved)
- [ ] Download triggers audit log entry
- [ ] PDF file stored locally with correct naming
- [ ] Only doctor role can generate and sign reports

---

## Phase 5 — Testing, Polish & Localization (Week 8)

### 5.1 Comprehensive Testing

- [ ] Backend API testing:
  - Auth: login, logout, refresh, lockout, password change
  - Patients: CRUD, search, encryption verification, RBAC
  - Evaluations: CRUD, auto-save, status transitions, RBAC
  - Reports: generate, download, sign, versioning, RBAC
  - Audit: verify all actions produce log entries
- [ ] Frontend testing:
  - Login flow (success, failure, lockout)
  - Patient creation with all fields
  - Full evaluation form (all 7 tabs, all field types)
  - Auto-save behavior
  - Report generation and signing flow
  - Idle timeout
  - RBAC (verify secretary cannot access evaluations)
- [ ] End-to-end workflow testing:
  1. Login as doctor
  2. Create patient with full history
  3. Create evaluation, fill all tabs
  4. Generate report with specific condition blocks
  5. Sign report (doctor + parent)
  6. Download final PDF
  7. Verify audit trail covers entire workflow
- [ ] Security testing:
  - SQL injection attempts on all inputs
  - XSS attempts in text fields
  - Direct API calls without authentication
  - Role escalation attempts (secretary trying doctor endpoints)
  - Token manipulation
  - Expired token handling

### 5.2 Spanish Localization

- [ ] Audit all UI text — ensure everything is in Spanish:
  - Navigation: Pacientes, Evaluaciones, Informes, Usuarios, Cerrar Sesion
  - Buttons: Guardar, Cancelar, Crear, Editar, Eliminar, Buscar
  - Form labels: match clinical terminology from the original forms
  - Error messages: all user-facing errors in Spanish
  - Confirmation dialogs: all in Spanish
  - Loading states: "Cargando...", "Guardando..."
  - Empty states: "No se encontraron pacientes", "Sin evaluaciones"
- [ ] Date formatting: "2 de abril de 2026" format throughout
- [ ] Report narrative: verify all template blocks match the DOCX template exactly

### 5.3 UI/UX Polish

- [ ] Consistent styling across all pages
- [ ] Responsive layout (desktop primary, tablet secondary for in-office use)
- [ ] Form validation feedback (inline errors, highlighted fields)
- [ ] Loading skeletons for data fetches
- [ ] Success toast notifications ("Paciente creado exitosamente")
- [ ] Confirmation modals for destructive actions
- [ ] Keyboard navigation for forms (tab order)
- [ ] Print-friendly view for reports (besides PDF download)

### 5.4 Bug Fixes & Edge Cases

- [ ] Handle evaluation with partially filled tabs
- [ ] Handle concurrent auto-save conflicts
- [ ] Handle session expiry during long evaluation (2+ hours)
- [ ] Handle PDF generation with missing optional data
- [ ] Handle patients with no evaluations
- [ ] Handle evaluations with no reports
- [ ] Verify soft-deleted records don't appear in lists
- [ ] Verify encrypted fields decrypt correctly after updates

### 5.5 Phase 5 Verification

- [ ] Full workflow tested by someone other than the developer
- [ ] All text is in Spanish
- [ ] No console errors in browser
- [ ] No unhandled exceptions in backend logs
- [ ] PDF output matches the style of the original DOCX template
- [ ] Performance acceptable (page loads < 2s, PDF generation < 10s)

---

## Phase 6 — AWS Deployment & HIPAA Hardening (Week 9)

### 6.1 AWS Account Setup

- [ ] Create AWS account (or use existing)
- [ ] Sign BAA via AWS Artifact (free, required for HIPAA)
- [ ] Create IAM user for deployment (GitHub Actions)
- [ ] Enable CloudTrail for API auditing
- [ ] Set up billing alerts ($50, $100, $150 thresholds)

### 6.2 Infrastructure Provisioning

- [ ] **RDS PostgreSQL:**
  - Instance: db.t3.micro
  - Enable encryption at rest (AES-256)
  - Enable automated backups (35-day retention)
  - Restrict Security Group: only allow EC2 instance IP on port 5432
  - Run migrations on production database
  - Create production admin user seed

- [ ] **EC2 Instance (Node.js API):**
  - Instance: t3.micro (or t3.small if needed)
  - Install Node.js + PM2
  - Security Group: only port 443 (HTTPS) open to public
  - Set environment variables via Secrets Manager or SSM Parameter Store
  - Configure PM2 ecosystem file for auto-restart
  - Deploy backend code, run with PM2

- [ ] **S3 Buckets:**
  - Bucket 1: React frontend static files (public, CloudFront)
  - Bucket 2: Generated PDF reports (private, encrypted, server-side access only)
  - Enable S3 default encryption (AES-256)
  - Enable versioning on PDF bucket
  - Block all public access on PDF bucket

- [ ] **CloudFront (CDN for frontend):**
  - Point to S3 frontend bucket
  - HTTPS only (redirect HTTP → HTTPS)
  - ACM certificate for custom domain (if applicable)

- [ ] **Route 53 (optional):**
  - Custom domain setup
  - DNS records for frontend (CloudFront) and API (EC2)

### 6.3 Security Hardening

- [ ] Enable TLS 1.2+ on all connections (CloudFront, EC2, RDS)
- [ ] Verify all cookies set with `Secure` flag in production
- [ ] Verify CORS allows only the production frontend domain
- [ ] Verify Helmet headers active in production
- [ ] Verify no PHI in application logs (CloudWatch)
- [ ] Verify database encryption at rest (RDS settings)
- [ ] Verify S3 encryption on PDF bucket
- [ ] Verify Security Groups: minimal open ports
- [ ] Verify IAM: least-privilege policies
- [ ] Run basic security scan (OWASP ZAP or similar)

### 6.4 CI/CD Pipeline (GitHub Actions)

- [ ] Store AWS credentials in GitHub Secrets:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `S3_FRONTEND_BUCKET`
  - `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`
- [ ] Create `.github/workflows/deploy.yml`:
  ```
  Trigger: push to main
  Steps:
    1. Checkout code
    2. Install dependencies (client + server)
    3. Run tests
    4. Build React app
    5. Upload build to S3 frontend bucket
    6. Invalidate CloudFront cache
    7. SSH into EC2 → git pull → npm install → pm2 restart
  ```
- [ ] Create `.github/workflows/test.yml`:
  ```
  Trigger: push to dev, pull requests
  Steps:
    1. Checkout code
    2. Install dependencies
    3. Run backend tests
    4. Run frontend tests (if any)
  ```
- [ ] Test full deploy pipeline: push to main → live in production

### 6.5 HIPAA Compliance Documentation

- [ ] **Risk Assessment Document:**
  - Identify all systems that handle PHI
  - Assess threats (unauthorized access, data loss, interception)
  - Document mitigations for each threat
- [ ] **Security Policies:**
  - Access control policy (who can access what)
  - Password policy (complexity, rotation)
  - Incident response plan (what to do if breach detected)
  - Data backup and recovery procedures
  - Workforce training requirements
- [ ] **Technical Controls Checklist:**
  - [ ] Encryption in transit: TLS 1.2+ on all connections
  - [ ] Encryption at rest: RDS (AES-256), S3 (AES-256), app-level PII encryption
  - [ ] Access controls: JWT auth, RBAC, session timeout
  - [ ] Audit controls: all PHI access logged with timestamp and user ID
  - [ ] Integrity controls: parameterized queries, input validation, PDF hash verification
  - [ ] Transmission security: HTTPS only, no HTTP fallback
  - [ ] Unique user identification: UUID-based user IDs, individual accounts
  - [ ] Emergency access: documented procedure for admin access recovery
  - [ ] Automatic logoff: 15-minute idle timeout
  - [ ] Backup: RDS automated daily backups, 35-day retention
- [ ] **BAA Documentation:**
  - AWS BAA signed and filed
  - No other third-party services handling PHI (or BAAs signed with them too)

### 6.6 Production Verification

- [ ] Full workflow tested on production:
  1. Login at production URL
  2. Create patient
  3. Create evaluation, fill all tabs
  4. Generate signed report
  5. Download PDF
  6. Verify audit logs in production database
- [ ] Verify HTTPS works correctly (no mixed content)
- [ ] Verify cookies are secure in production
- [ ] Verify auto-deploy works: push code → live in minutes
- [ ] Verify RDS backup: take snapshot, restore to verify
- [ ] Verify monitoring: set up CloudWatch alarms for:
  - EC2 CPU > 80%
  - RDS storage > 80%
  - 5xx error rate > 1%
- [ ] Hand off to client:
  - Production URL
  - Admin credentials (force change on first login)
  - User guide (brief, in Spanish)
  - Support contact information

---

## Post-Launch Backlog (Future)

| Priority | Feature | Description |
|---|---|---|
| 1 | Standard visual exam module | Client's Phase 2: regular eye exam form |
| 2 | 2FA authentication | When user count grows beyond trusted office staff |
| 3 | Patient portal | Parents access reports online via secure link |
| 4 | Appointment scheduling | Calendar integration for evaluation bookings |
| 5 | Dashboard analytics | Evaluation counts, common diagnoses, trends |
| 6 | Email notifications | Secure report delivery to parents via encrypted email |
| 7 | Multi-clinic support | Multiple office locations under one system |
| 8 | Data export | CSV/Excel export of anonymized evaluation data for research |
