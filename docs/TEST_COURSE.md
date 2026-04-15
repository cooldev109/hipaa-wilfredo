# Neuronita EVF — Full Manual Test Course

## Access

- **URL**: https://solodevs.net
- **Admin credentials**: `admin@neuronita.com` / `Neuronita2026!` (prompted to change on first login)
- If already changed, use your new password

**Total time for full test**: ~2 hours

---

## Module 1 — Login & Session (5 min)

| # | Action | Expected |
|---|---|---|
| 1.1 | Open https://solodevs.net | Login page with Neuronita logo, EN/ES toggle, theme toggle |
| 1.2 | Enter wrong password 5 times | After 5th attempt, account locked (15 min) |
| 1.3 | Wait 15 min OR run on VPS: `sudo -u postgres psql -d neuronita_evf -c "UPDATE users SET failed_login_attempts=0, locked_until=NULL;"` | Account unlocked |
| 1.4 | Login with correct password | Force password change page loads |
| 1.5 | Try password shorter than 6 chars | Error: "Password must be at least 6 characters" |
| 1.6 | Try mismatched passwords | Error: "Passwords do not match" |
| 1.7 | Set new password `Admin123` | Redirected to login, re-login works |
| 1.8 | Click **EN/ES** toggle | All text switches language, persists on refresh |
| 1.9 | Click **sun/moon** toggle | Theme switches (light/dark), persists on refresh |
| 1.10 | Resize browser to mobile width | Login form becomes centered card, logo on top |

---

## Module 2 — Dashboard (3 min)

| # | Action | Expected |
|---|---|---|
| 2.1 | Login as doctor | Dashboard loads |
| 2.2 | Check welcome banner | Greeting (Good morning/afternoon/evening) + your full name + role + today's date |
| 2.3 | Check stat cards | 3 cards with real numbers: Registered Patients, Evaluations This Month, Pending Reports |
| 2.4 | Check Quick Actions section | 4 buttons: New Patient, New Evaluation, Generate Report, New User |
| 2.5 | Click **New Patient** quick action | Navigates to Patients page |
| 2.6 | Go back to dashboard | Layout intact |
| 2.7 | Switch language EN↔ES | All dashboard text translates |
| 2.8 | Switch theme light↔dark | Welcome banner gradient + cards + sidebar change colors |

---

## Module 3 — Sidebar Navigation (2 min)

| # | Action | Expected |
|---|---|---|
| 3.1 | Check sidebar | Neuronita logo, "EVF System" label, 5 menu items (Home, Patients, Evaluations, Reports, Users) |
| 3.2 | Check user card at bottom | Avatar with initials + name + role |
| 3.3 | Hover each menu item | Background highlights |
| 3.4 | Click each menu item | Active item shows teal accent border on left |

---

## Module 4 — User Management (5 min)

| # | Action | Expected |
|---|---|---|
| 4.1 | Click **Users** in sidebar | Table with admin user |
| 4.2 | Click **+ New User** | Form expands with 6 fields |
| 4.3 | Create: `Maria` `Lopez` `maria@neuronita.com` `Test1234` role `Assistant` | User created, appears in table |
| 4.4 | Create: `Ana` `Rivera` `ana@neuronita.com` `Test1234` role `Secretary` | User created |
| 4.5 | Try creating with password `abc` (less than 6 chars) | Error: password too short |
| 4.6 | Try creating with duplicate email | Error: email already exists |
| 4.7 | Click **Deactivate** on Ana | Status changes to Inactive |

---

## Module 5 — Patient List (5 min)

| # | Action | Expected |
|---|---|---|
| 5.1 | Click **Patients** in sidebar | Table with 5 sample patients |
| 5.2 | Verify columns | Name, Age (y m format), Sex, School, Grade, Referred By, Registered, Actions |
| 5.3 | Check patient names | Should see: Emma Rodriguez Santos, Lucas Martinez Diaz, Sofia Vazquez Morales, Diego Colon Ramirez, Valentina Rivera Ortiz |
| 5.4 | Type `Emma` in search, click Search | Only Emma shows |
| 5.5 | Clear search, search again | All 5 show |
| 5.6 | Hover a row | Highlights |
| 5.7 | Click a row | Patient detail page loads |

---

## Module 6 — Create Patient (10 min)

| # | Action | Expected |
|---|---|---|
| 6.1 | From patients list, click **+ New Patient** | Create form with 5 sections |
| 6.2 | **Personal Data**: `Carlos` `Santiago` DOB `2015-03-10` sex `M` School `Colegio San Juan` Grade `4th` Referred By `Dr. Torres` | All fields accept input |
| 6.3 | **Guardian**: Name `Maria Santiago` Phone `787-555-1234` Email `maria@email.com` | All fields accept input |
| 6.4 | **Medical History**: fill visual, medical, medications, family ocular, family medical textareas | Multi-line works |
| 6.5 | **Developmental**: Birth weeks `39` Type `Natural` Crawled `7` Walked `11` Talked `13` | Numeric inputs work |
| 6.6 | **Therapies**: check 3 boxes (Occupational, Speech, Educational) | Checkboxes toggle |
| 6.7 | Click **Save** | Redirected to patient detail page |
| 6.8 | Try saving with empty First Name | Validation error |
| 6.9 | Try saving with empty DOB | Validation error |

---

## Module 7 — Patient Detail (5 min)

| # | Action | Expected |
|---|---|---|
| 7.1 | After creating patient, verify 4 cards | Personal Data, Guardian, Medical History, Developmental |
| 7.2 | Check Personal Data card | Name, DOB, School, Grade, Referred By with icons |
| 7.3 | Check Guardian card | Name, Phone, Email with icons |
| 7.4 | Check Medical History card | All history fields, empty ones show "—" |
| 7.5 | Check Developmental card | Birth weeks, type, milestones + therapy badges (purple pills) |
| 7.6 | Check Evaluations section at bottom | "No evaluations recorded" (for new patients) or list |
| 7.7 | Click **+ New Evaluation** button | Creates evaluation, navigates to 7-tab form |
| 7.8 | Go back, click **Delete** (red button) | **Confirmation dialog** appears (not browser alert) |
| 7.9 | Click Cancel | Nothing happens |
| 7.10 | Click Delete again → Confirm | Toast notification appears, redirected to list |

---

## Module 8 — Evaluation Form — Header & Clinic Branding (2 min)

| # | Action | Expected |
|---|---|---|
| 8.1 | Open an evaluation | Clinic header at top: Neuronita logo + address + phone + "FUNCTIONAL VISION EVALUATION" title |
| 8.2 | Check patient info bar | Date of Evaluation, Name, Sex, DOB |
| 8.3 | Check status badge | "Draft" in orange |
| 8.4 | Fill any field, wait 30 seconds | "Auto-saved HH:MM:SS" indicator appears in green |
| 8.5 | Refresh page | Data persists |

---

## Module 9 — Tab 1: VA & Basic Tests (10 min)

| # | Action | Expected |
|---|---|---|
| 9.1 | Select method radio: **Snellen** | Radio selects |
| 9.2 | Near VA table — click Aided OD cell | Dropdown opens with VA values (20/10 to 20/400, CF, HM, LP, NLP) |
| 9.3 | Select `20/20` for Aided OD | Value saves |
| 9.4 | Fill other cells similarly | All cells work as dropdowns |
| 9.5 | Color Vision — select from Results dropdown | Options: Normal, Abnormal, Deficient R/G, Deficient B/Y |
| 9.6 | Select **"— Other (type custom) —"** | Switches to text input |
| 9.7 | Click **×** button on custom input | Switches back to dropdown |
| 9.8 | Stereo Results dropdown | Options: 20, 25, 30, 40... 800, None |
| 9.9 | Cover Test Distance | Dropdown: Ortho, Eso, Exo, Hyper OD/OS, Intermittent |
| 9.10 | Cover Test Near — select Exo + enter 6 in PD field | Both fields save |
| 9.11 | Pursuits OU — click `3` | Radio selects |
| 9.12 | Saccades OU — click `2` | Radio selects |
| 9.13 | NPC #1 and #2 — fill Blur/Break/Recovery | Numeric inputs |
| 9.14 | NPA OD/OS, Sheard's OD/OS, Minimum AOA | All work |
| 9.15 | Click **Next** or Tab 2 | Tab 2 loads, Tab 1 data persists |

---

## Module 10 — Tab 2: RightEye (2 min)

| # | Action | Expected |
|---|---|---|
| 10.1 | Table: Movement / Score / Expected | 4 rows: Tracking, Saccadic, Fixation, Global |
| 10.2 | Fill scores: 58, 65, 70, 62 | Numeric inputs work |
| 10.3 | Expected column shows `>75` for all | Helper text visible |
| 10.4 | Click **Next** | Tab 3 loads |

---

## Module 11 — Tab 3: Refraction (5 min)

| # | Action | Expected |
|---|---|---|
| 11.1 | Retinoscopy OD: Sphere `+1.00`, Cylinder `-0.50`, Axis `90` | 3 fields in a row, numeric with step 0.25 |
| 11.2 | Retinoscopy OS: fill similarly | Same |
| 11.3 | Subjective Refraction OD/OS | Same pattern |
| 11.4 | Final Prescription OD/OS + ADD `+1.00` | Same + ADD field |
| 11.5 | Post-Rx VA: OD/OS/OU for each section | VA dropdown |
| 11.6 | Click **Next** | Tab 4 loads |

---

## Module 12 — Tab 4: Binocular (5 min)

| # | Action | Expected |
|---|---|---|
| 12.1 | Phoria Distance H: dropdown + amount | Dropdown: Ortho/Eso/Exo, then numeric |
| 12.2 | Phoria Distance V: dropdown + amount | Dropdown: Ortho/Hyper OD/Hyper OS |
| 12.3 | Phoria Near H and V | Same structure |
| 12.4 | Vergences Distance BI: Blur/Break/Recovery | 3 numeric inputs |
| 12.5 | Vergences Distance BO, BU, BD | Fill all |
| 12.6 | Vergences Near (same structure) | Fill all |
| 12.7 | Click **Next** | Tab 5 loads |

---

## Module 13 — Tab 5: Ocular Health (5 min)

| # | Action | Expected |
|---|---|---|
| 13.1 | Click **"All Normal"** button | All External + Internal fields auto-fill |
| 13.2 | Click Lids/Lash OD dropdown | Options: Healthy, WNL, Blepharitis, Chalazion, Ptosis, etc. |
| 13.3 | Click Cornea OD dropdown | Options: Clear, WNL, SPK, Abrasion, Dystrophy, etc. |
| 13.4 | Click Lens OD dropdown | Options: Clear, NS 1-4, PSC 1-2, Cortical, IOL, etc. |
| 13.5 | Click C/D OD dropdown | Options: 0.1 to 0.9 in 0.05 increments |
| 13.6 | Click Macula/FR OD dropdown | Options: Flat, Healthy, Drusen, ARMD dry/wet, etc. |
| 13.7 | Click **Next** | Tab 6 loads |

---

## Module 14 — Tab 6: Perceptual (3 min)

| # | Action | Expected |
|---|---|---|
| 14.1 | Garner Reversal: fill Unknown Errors/Mean/SD | Numeric table |
| 14.2 | Fill Reversed and Recognition rows | Same |
| 14.3 | VMI: Raw `18` Chron Age `9y 10m` Percep Age `7y 6m` Std Score `85` Percentile `16` | 5-column scored table |
| 14.4 | VP: fill similarly | Same component |
| 14.5 | Click **Next** | Tab 7 loads |

---

## Module 15 — Tab 7: Assessment & Plan (10 min)

| # | Action | Expected |
|---|---|---|
| 15.1 | Assessment textarea: type clinical notes | Multi-line input |
| 15.2 | Diagnoses: click **Functional Vision** category | Expands to show H55.81, H52.533, H51.11, H51.12, etc. |
| 15.3 | Check H55.81 (Oculomotor Dysfunction) | Chip appears at top with × to remove |
| 15.4 | Check H52.533, H51.11 | Multiple chips accumulate |
| 15.5 | Click **Refractive** category | Expands, shows H52.03, H52.13, etc. |
| 15.6 | Search for "cataract" | Accordion hides, flat list shows matching codes |
| 15.7 | Clear search | Accordion returns |
| 15.8 | Plan RX OD/OS + ADD | PrescriptionInput |
| 15.9 | Lens Type dropdown | Options: Single Vision, Progressive Digital, FT-28, Trifocal, etc. |
| 15.10 | Recommendations: check multiple (Vision Therapy, Therapeutic Glasses, Re-evaluation, Referral to Neurologist) | 12 total options available |
| 15.11 | Click **Save Draft** | Toast: "Saved" |
| 15.12 | Click **Mark as Complete** | Redirected to evaluations list, status = Complete |

---

## Module 16 — Evaluations List (3 min)

| # | Action | Expected |
|---|---|---|
| 16.1 | Click **Evaluations** in sidebar | Table with all evaluations |
| 16.2 | Check columns | Patient, Date, Status, Last Saved, Actions |
| 16.3 | Click **All** / **Draft** / **Complete** / **Signed** filter chips | Filters work |
| 16.4 | Click a row | Opens evaluation form with all data loaded |
| 16.5 | Click **+ New Evaluation** | Form expands with **PatientPicker** dropdown |
| 16.6 | Type in picker | Searches patients by name |
| 16.7 | Click a result | Patient selected, shows name + age + school |
| 16.8 | Click **Create** | New evaluation created |

---

## Module 17 — Report Generation (10 min)

| # | Action | Expected |
|---|---|---|
| 17.1 | Click **Reports** in sidebar | Reports table (may be empty initially) |
| 17.2 | Click **+ Generate Report** | Form with EvaluationPicker |
| 17.3 | Click picker | Dropdown shows completed evaluations with patient names + dates |
| 17.4 | Select an evaluation | Shows selected in pill form |
| 17.5 | Click **Generate** | Loading for ~5 seconds → redirected to report preview |
| 17.6 | Report detail page loads | Version, Status, Evaluation ID, PDF hash visible |
| 17.7 | Click **Download PDF** | PDF downloads (95KB+) |
| 17.8 | Open the PDF | Verify: |
| | | • Neuronita header (address, phone) |
| | | • "Functional Vision Evaluation Report" title |
| | | • Patient info (English) |
| | | • All sections in English |
| | | • VA table with your data |
| | | • RightEye scores |
| | | • Selected diagnoses with ICD-10 codes + descriptions |
| | | • Recommendations list |
| | | • Intervention Plan (7 points) |
| | | • Signature lines |

---

## Module 18 — Digital Signatures (5 min)

| # | Action | Expected |
|---|---|---|
| 18.1 | On report preview, click **Doctor Signature** | Signature canvas modal opens |
| 18.2 | Draw signature with mouse/touch | Line appears |
| 18.3 | Click **Clear** | Canvas clears |
| 18.4 | Draw again, click **Save signature** | Modal closes, status shows "Doctor signed at..." |
| 18.5 | Click **Parent/Guardian Signature** | Name input modal appears |
| 18.6 | Type `Maria Santiago` | Input works |
| 18.7 | Click **Next** | Signature canvas opens |
| 18.8 | Draw, click **Save** | Modal closes, status changes to **"Signed"** (green badge) |
| 18.9 | Click **Download PDF** again | New PDF has both signatures embedded |

---

## Module 19 — RBAC / Security (10 min)

Login as **assistant** (`maria@neuronita.com` / `Test1234`, then change password to `Asst1234`):

| # | Action | Expected |
|---|---|---|
| 19.1 | Check sidebar | Only: Home, Patients, Evaluations (NO Reports, NO Users) |
| 19.2 | Navigate to `/informes` in URL | Redirected to home |
| 19.3 | Navigate to `/usuarios` in URL | Redirected to home |
| 19.4 | Go to Patients — can view and create | Works |
| 19.5 | Go to patient detail | **No delete button visible** |
| 19.6 | Go to Evaluations — can create and fill | Works |
| 19.7 | Logout |

Login as **secretary** (`ana@neuronita.com` / `Test1234`, then change password):

| # | Action | Expected |
|---|---|---|
| 19.8 | Check sidebar | Only: Home, Patients (NO Evaluations, NO Reports, NO Users) |
| 19.9 | Go to Patients — can create | Works |
| 19.10 | Go to patient detail | Can edit, cannot delete, cannot see history (or read-only) |

---

## Module 20 — Idle Timeout (15+ min test)

| # | Action | Expected |
|---|---|---|
| 20.1 | Login and leave the tab idle (no mouse/keyboard) for **13 minutes** | Warning modal: "Session about to expire" |
| 20.2 | Click **Continue session** | Modal closes, timer resets |
| 20.3 | Leave idle for full **15 minutes** | Auto-logout, redirected to login |

---

## Module 21 — Theme + Language Persistence (2 min)

| # | Action | Expected |
|---|---|---|
| 21.1 | Set dark theme + ES language | Everything dark + Spanish |
| 21.2 | Navigate between all pages | Persists |
| 21.3 | Logout | Login page still dark + Spanish |
| 21.4 | Close browser, reopen URL | Still dark + Spanish |
| 21.5 | Hard refresh (Ctrl+Shift+R) | Still dark + Spanish |

---

## Module 22 — Responsive Mobile Test (5 min)

| # | Action | Expected |
|---|---|---|
| 22.1 | Open DevTools, toggle device toolbar, set iPhone size | Login page: form centered, logo on top, no side panel |
| 22.2 | Login on mobile | Dashboard responsive |
| 22.3 | Check sidebar | May be hidden/drawer on mobile |
| 22.4 | Fill a patient form on mobile | Inputs work |

---

## Module 23 — Audit & Encryption (Terminal — 2 min)

Run on VPS:

```bash
sudo -u postgres psql -d neuronita_evf -c "SELECT action, user_email, resource, timestamp FROM audit_logs ORDER BY timestamp DESC LIMIT 20;"
```

**Expected**: LOGIN, PATIENT_CREATE, PATIENT_READ, EVALUATION_CREATE, EVALUATION_UPDATE, REPORT_GENERATE, REPORT_SIGN, USER_CREATE, FAILED_LOGIN entries

```bash
sudo -u postgres psql -d neuronita_evf -c "SELECT first_name_encrypted FROM patients LIMIT 1;"
```

**Expected**: Hex string (not readable) — confirms PII is encrypted at rest

---

## What to Report If Something Fails

For each failed test, capture:

1. **Module + step number** (e.g., "Module 17, step 17.7")
2. **What you saw** vs **what was expected**
3. **Browser console errors** (F12 → Console tab)
4. **Server logs** on VPS: `pm2 logs neuronita-evf --lines 30 --nostream`
