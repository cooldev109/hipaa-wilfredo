const path = require('path');
const crypto = require('crypto');
const dotenv = require(path.join(__dirname, '..', '..', 'server', 'node_modules', 'dotenv'));

dotenv.config({ path: path.join(__dirname, '..', '..', 'server', '.env') });

const ALGORITHM = 'aes-256-gcm';

function encrypt(plainText) {
  if (!plainText) return null;
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(String(plainText), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function createSearchHash(text) {
  if (!text) return null;
  const normalized = String(text).toLowerCase().trim();
  return crypto.createHmac('sha256', process.env.ENCRYPTION_KEY).update(normalized).digest('hex');
}

const samplePatients = [
  {
    firstName: 'Emma',
    lastName: 'Rodriguez Santos',
    dateOfBirth: '2016-03-22',
    sex: 'F',
    school: 'Academia Santa Maria',
    grade: '3rd',
    referredBy: 'Dr. Ana Torres, Pediatrician',
    guardianName: 'Carmen Santos Lopez',
    guardianPhone: '787-555-0101',
    guardianEmail: 'carmen.santos@email.com',
    history: {
      visualHistory: 'Last eye exam 1 year ago. No previous correction. Parents noticed frequent squinting while reading.',
      medicalHistory: 'Healthy. No chronic conditions. Up to date with vaccinations.',
      medications: 'None',
      familyOcularHistory: 'Mother wears glasses for myopia since age 12. Maternal grandfather has glaucoma.',
      familyMedicalHistory: 'No significant family medical history.',
      developmentalBirthWeeks: 39,
      developmentalBirthType: 'natural',
      developmentalCrawledMonths: 7,
      developmentalWalkedMonths: 11,
      developmentalTalkedMonths: 13,
      therapies: {
        occupational: true,
        occupationalSensory: false,
        speech: true,
        physical: false,
        educational: true,
        psychological: false,
        functionalVision: false
      }
    }
  },
  {
    firstName: 'Lucas',
    lastName: 'Martinez Diaz',
    dateOfBirth: '2014-09-10',
    sex: 'M',
    school: 'Colegio Bautista',
    grade: '5th',
    referredBy: 'Mrs. Rivera, School Counselor',
    guardianName: 'Pedro Martinez Colon',
    guardianPhone: '787-555-0202',
    guardianEmail: 'pedro.martinez@email.com',
    history: {
      visualHistory: 'First comprehensive visual evaluation. Teacher reports difficulty copying from board and frequent loss of place while reading.',
      medicalHistory: 'ADHD diagnosed at age 6. Otherwise healthy.',
      medications: 'Methylphenidate 10mg daily',
      familyOcularHistory: 'Father has astigmatism. No other ocular conditions in family.',
      familyMedicalHistory: 'Father has ADHD. Paternal uncle has dyslexia.',
      developmentalBirthWeeks: 37,
      developmentalBirthType: 'cesarean',
      developmentalCrawledMonths: 9,
      developmentalWalkedMonths: 14,
      developmentalTalkedMonths: 18,
      therapies: {
        occupational: true,
        occupationalSensory: true,
        speech: false,
        physical: false,
        educational: true,
        psychological: true,
        functionalVision: false
      }
    }
  },
  {
    firstName: 'Sofia',
    lastName: 'Vazquez Morales',
    dateOfBirth: '2018-01-05',
    sex: 'F',
    school: 'Robinson School',
    grade: '1st',
    referredBy: 'Dr. Miguel Ortiz, Developmental Pediatrician',
    guardianName: 'Maria Morales Figueroa',
    guardianPhone: '787-555-0303',
    guardianEmail: 'maria.morales@email.com',
    history: {
      visualHistory: 'No previous eye exams. Parents concerned about letter reversals (b/d confusion) and slow reading progress.',
      medicalHistory: 'Premature birth at 34 weeks. Spent 2 weeks in NICU. Mild developmental delays resolved by age 3.',
      medications: 'Vitamin D supplement',
      familyOcularHistory: 'Both parents wear glasses. Mother has high myopia (-6.00). Father has hyperopia.',
      familyMedicalHistory: 'Maternal grandmother has diabetes type 2.',
      developmentalBirthWeeks: 34,
      developmentalBirthType: 'cesarean',
      developmentalCrawledMonths: 10,
      developmentalWalkedMonths: 15,
      developmentalTalkedMonths: 20,
      therapies: {
        occupational: false,
        occupationalSensory: false,
        speech: true,
        physical: true,
        educational: false,
        psychological: false,
        functionalVision: false
      }
    }
  },
  {
    firstName: 'Diego',
    lastName: 'Colon Ramirez',
    dateOfBirth: '2015-07-18',
    sex: 'M',
    school: 'Academia del Perpetuo Socorro',
    grade: '4th',
    referredBy: 'Self-referred (parents)',
    guardianName: 'Laura Ramirez Cruz',
    guardianPhone: '787-555-0404',
    guardianEmail: 'laura.ramirez@email.com',
    history: {
      visualHistory: 'Wears glasses since age 5 for hyperopia. Current Rx: OD +2.00, OS +1.75. Parents report headaches after homework.',
      medicalHistory: 'Chronic allergies (seasonal). Occasional migraines.',
      medications: 'Cetirizine 5mg as needed for allergies',
      familyOcularHistory: 'Mother had strabismus surgery at age 4. Father wears progressive lenses.',
      familyMedicalHistory: 'Mother has migraines. Paternal grandfather had macular degeneration.',
      developmentalBirthWeeks: 40,
      developmentalBirthType: 'natural',
      developmentalCrawledMonths: 8,
      developmentalWalkedMonths: 12,
      developmentalTalkedMonths: 15,
      therapies: {
        occupational: false,
        occupationalSensory: false,
        speech: false,
        physical: false,
        educational: true,
        psychological: false,
        functionalVision: true
      }
    }
  },
  {
    firstName: 'Valentina',
    lastName: 'Rivera Ortiz',
    dateOfBirth: '2017-11-30',
    sex: 'F',
    school: 'Escuela Elemental Padre Rufo',
    grade: '2nd',
    referredBy: 'Dr. Laura Mendez, Neurologist',
    guardianName: 'Jose Rivera Santiago',
    guardianPhone: '787-555-0505',
    guardianEmail: 'jose.rivera@email.com',
    history: {
      visualHistory: 'First functional vision evaluation. Previous standard eye exam showed 20/20 acuity bilaterally but parents and teachers report significant reading difficulties.',
      medicalHistory: 'Mild sensory processing disorder. No other conditions.',
      medications: 'None',
      familyOcularHistory: 'No significant ocular history in immediate family.',
      familyMedicalHistory: 'Older brother diagnosed with convergence insufficiency at age 8.',
      developmentalBirthWeeks: 41,
      developmentalBirthType: 'natural',
      developmentalCrawledMonths: 6,
      developmentalWalkedMonths: 10,
      developmentalTalkedMonths: 12,
      therapies: {
        occupational: true,
        occupationalSensory: true,
        speech: false,
        physical: false,
        educational: true,
        psychological: false,
        functionalVision: false
      }
    }
  }
];

exports.seed = async function (knex) {
  const existing = await knex('patients').whereNotNull('id').first();
  if (existing) {
    console.log('Sample patients already exist, skipping seed.');
    return;
  }

  const doctor = await knex('users').where({ role: 'doctor' }).first();
  if (!doctor) {
    console.log('No doctor user found, skipping patient seed.');
    return;
  }

  for (const p of samplePatients) {
    const patientId = crypto.randomUUID();

    await knex('patients').insert({
      id: patientId,
      first_name_encrypted: encrypt(p.firstName),
      last_name_encrypted: encrypt(p.lastName),
      date_of_birth_encrypted: encrypt(p.dateOfBirth),
      sex: p.sex,
      school: p.school,
      grade: p.grade,
      referred_by: p.referredBy,
      parent_guardian_name_encrypted: encrypt(p.guardianName),
      parent_guardian_phone_encrypted: encrypt(p.guardianPhone),
      parent_guardian_email_encrypted: encrypt(p.guardianEmail),
      search_hash: createSearchHash(`${p.firstName} ${p.lastName}`),
      created_by: doctor.id
    });

    await knex('patient_history').insert({
      patient_id: patientId,
      visual_history: p.history.visualHistory,
      medical_history: p.history.medicalHistory,
      medications: p.history.medications,
      family_ocular_history: p.history.familyOcularHistory,
      family_medical_history: p.history.familyMedicalHistory,
      developmental_birth_weeks: p.history.developmentalBirthWeeks,
      developmental_birth_type: p.history.developmentalBirthType,
      developmental_crawled_months: p.history.developmentalCrawledMonths,
      developmental_walked_months: p.history.developmentalWalkedMonths,
      developmental_talked_months: p.history.developmentalTalkedMonths,
      therapies: JSON.stringify(p.history.therapies),
      created_by: doctor.id
    });

    console.log(`  Created: ${p.firstName} ${p.lastName}`);
  }

  console.log(`\nSample patients seeded: ${samplePatients.length} patients created.`);
};
