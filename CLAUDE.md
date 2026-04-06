# HIPAA-Compliant EVF System — Development Rules

## Project Overview

Electronic Health Record system for functional vision evaluations (Evaluacion Vision Funcional).
Built for a developmental optometry clinic in Puerto Rico (3-4 users).
Full HIPAA compliance required. All UI and reports in Spanish.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL
- **Auth:** JWT (HttpOnly cookies + refresh tokens)
- **PDF Generation:** Server-side (Puppeteer or React-PDF)
- **Deployment:** AWS (EC2, RDS, S3) — deployed in final phase
- **CI/CD:** GitHub Actions — configured in final phase
- **Process Manager:** PM2 (production)

## Architecture Rules

### General
- Use environment variables for ALL configuration. Never hardcode credentials, secrets, or connection strings.
- Every API endpoint must be authenticated except `/auth/login` and `/auth/refresh`.
- Every API endpoint that touches PHI must produce an audit log entry.
- All responses must use consistent JSON format: `{ success: boolean, data?: any, error?: string }`.
- Use UUID (v4) for all primary keys. Never expose sequential IDs.
- All dates stored in UTC. Convert to local timezone (America/Puerto_Rico) only in the frontend.

### Frontend (React)
- Use functional components with hooks only. No class components.
- Use React Router for navigation.
- Use React Context for auth state. No Redux (project is too small for it).
- Forms must auto-save every 30 seconds for the evaluation module.
- Never store JWT tokens in localStorage or sessionStorage. Tokens are managed via HttpOnly cookies only.
- All API calls go through a centralized `api.js` service module.
- Display loading states and error messages in Spanish.
- Component file naming: PascalCase (e.g., `PatientForm.jsx`).
- One component per file.

### Backend (Node.js / Express)
- Follow the route → controller → service → model pattern.
- Routes define endpoints and attach middleware.
- Controllers handle request/response. No business logic in controllers.
- Services contain business logic. No direct DB queries in services.
- Models contain database queries only.
- Use parameterized queries for ALL database operations. Never concatenate SQL strings.
- Validate all input at the controller level using a validation library (e.g., Joi or Zod).
- File naming: camelCase (e.g., `patientService.js`).

### Database (PostgreSQL)
- Use migrations for ALL schema changes. Never modify the database manually.
- Encrypt PII fields at the application level (name, DOB, phone, etc.) before storing.
- Every table that stores PHI must include: `created_at`, `updated_at`, `created_by`, `updated_by`.
- Use foreign keys and constraints. Do not rely on application-level referential integrity alone.
- Soft delete for patient and evaluation records (add `deleted_at` column). Never hard delete PHI.
- Index all foreign keys and frequently queried fields.

### Authentication & Security
- Access tokens: 15-minute expiry.
- Refresh tokens: 7-day expiry, stored server-side, single-use (rotate on refresh).
- Auto-logout after 15 minutes of inactivity (frontend timer + backend validation).
- Passwords: bcrypt with salt rounds = 12.
- Rate limit login attempts: 5 failed attempts → 15-minute lockout.
- All cookies: HttpOnly, Secure (in production), SameSite=Strict.
- CORS: whitelist only the frontend origin.
- Use Helmet middleware for HTTP security headers.

### Audit Logging (HIPAA Requirement)
- Log format: `{ timestamp, userId, action, resource, resourceId, ipAddress, details }`.
- Actions to log:
  - AUTH: login, logout, failed_login, token_refresh, password_change
  - PATIENT: create, read, update, delete (soft)
  - EVALUATION: create, read, update, delete (soft), status_change
  - REPORT: generate, download, sign, view
  - USER: create, update, role_change, deactivate
- Audit logs are append-only. Never update or delete audit log entries.
- Store audit logs in a separate database table (`audit_logs`).

### RBAC (Role-Based Access Control)
- Three roles: `doctor`, `assistant`, `secretary`.
- Doctor: full access to all modules.
- Assistant: create/edit patients and evaluations, view reports. Cannot generate or sign reports.
- Secretary: create/edit patients only. Cannot access evaluations or reports.
- RBAC enforced at the middleware level on every route. Never rely on frontend-only checks.

### PDF Reports
- Generated server-side only. Never generate PDFs in the browser.
- Store generated PDFs with encryption.
- Use signed URLs (or equivalent) for secure download. URLs expire after 15 minutes.
- Reports include: doctor digital signature, parent/guardian signature, date.
- Report versioning: every regeneration creates a new version, previous versions are preserved.

### Error Handling
- Never expose stack traces, database errors, or internal details to the client.
- Log full error details server-side.
- Return user-friendly error messages in Spanish.
- Use a centralized error handling middleware.

## Project Structure

```
hipaa-evf/
├── client/                    # React frontend
│   ├── public/
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── common/        # Buttons, inputs, modals
│       │   ├── forms/         # OD/OS pairs, prescription inputs, scales
│       │   └── layout/        # Header, sidebar, protected route
│       ├── pages/             # Route-level pages
│       │   ├── auth/          # Login
│       │   ├── patients/      # List, create, detail
│       │   ├── evaluations/   # Form (tabbed), list
│       │   ├── reports/       # Preview, list
│       │   └── admin/         # User management
│       ├── context/           # Auth context
│       ├── services/          # API call functions
│       ├── hooks/             # Custom hooks
│       └── utils/             # Formatters, validators, constants
├── server/                    # Node.js backend
│   ├── routes/                # Express route definitions
│   ├── controllers/           # Request/response handling
│   ├── services/              # Business logic
│   ├── models/                # Database queries
│   ├── middleware/            # Auth, RBAC, audit, error handler, validation
│   ├── utils/                 # Encryption, PDF generator, logger
│   └── config/                # DB connection, env config
├── database/
│   └── migrations/            # SQL migration files
├── docs/                      # Clinical reference forms
├── .env.example               # Template for environment variables
├── CLAUDE.md                  # This file
└── README.md                  # Setup instructions
```

## Development Workflow

1. All code lives in a private GitHub repository.
2. Branch strategy: `main` (production), `dev` (integration), `feature/*` (work branches).
3. All features are developed in `feature/*` branches and merged into `dev`.
4. Only stable, tested code is merged from `dev` into `main`.
5. Infrastructure and deployment are configured in the final phase (Week 9).

## Language & Localization

- All UI text in Spanish.
- All report content in Spanish (per clinical templates).
- Code (variable names, comments, commit messages) in English.
- Database column names in English.

## Testing Protocol

After completing each phase (or major step within a phase):

1. **Self-test first:** Run and verify all functionality built in that step — start servers, hit endpoints, test UI flows, check database records, confirm audit logs, and validate edge cases. Fix any issues found before presenting to the user.
2. **Provide test instructions:** Give the user clear, step-by-step instructions to test the feature themselves, including:
   - How to start/run the system
   - Exact actions to perform (click X, fill Y, submit Z)
   - What to expect (expected results, where to look)
   - What to report if something fails
3. **Wait for user confirmation:** Do not proceed to the next phase until the user has tested and approved the current step.

## What NOT to Do

- Never store PHI in logs. Sanitize patient names, DOB, and other PII before logging.
- Never use `console.log` in production code. Use the structured logger.
- Never disable CORS or security headers, even in development.
- Never commit `.env` files or any file containing secrets.
- Never use `SELECT *` in database queries. Always specify columns.
- Never trust frontend-only validation. Always validate on the backend.
- Never store passwords in plain text or reversible encryption.
- Never expose internal IDs, stack traces, or system info in API responses.
