-- ==============================================================================
-- HOZONE CLINICAL DATABASE SEED: PATIENT MANAGEMENT SYSTEM (PMS)
-- Seed: seed_patient_management.sql
-- Module: Patient Management System & Longitudinal EHR
-- PostgreSQL: 17
-- ==============================================================================

-- 1. Patients Seed (5 Realistic Clinical Cases)
INSERT INTO public.patients (
    id, registration_number, first_name, last_name, date_of_birth, age, gender,
    blood_group, phone, email, address, occupation, dominant_miasm, thermal_state,
    allergies, medical_history, family_history, status
) VALUES
(
    'a1111111-1111-4111-8111-111111111111',
    'PT-2026-0001',
    'Eleanor',
    'Vance',
    '1992-04-12',
    34,
    'Female',
    'A+',
    '+1 555-0192',
    'eleanor.vance@example.com',
    '42 Hillcrest Avenue, Boston, MA',
    'Architectural Designer',
    'Psora',
    'Chilly',
    ARRAY['Penicillin', 'Dust mites'],
    'Recurrent right-sided migraine with nausea since age 22. Aggravated by sun and mental exertion.',
    'Maternal migraine history, paternal hypertension.',
    'Active'
),
(
    'a2222222-2222-4222-8222-222222222222',
    'PT-2026-0002',
    'Arthur',
    'Pendelton',
    '1974-08-25',
    52,
    'Male',
    'O+',
    '+1 555-0144',
    'arthur.p@example.com',
    '108 Beacon Street, Brookline, MA',
    'University Professor',
    'Sycosis',
    'Hot',
    ARRAY['Sulfa drugs'],
    'Chronic lumbar spondylosis and early osteoarthritis of right knee. Stiff on beginning motion, better continued motion.',
    'Father had severe rheumatoid arthritis.',
    'Active'
),
(
    'a3333333-3333-4333-8333-333333333333',
    'PT-2026-0003',
    'Clara',
    'Oswald',
    '1998-11-03',
    28,
    'Female',
    'B+',
    '+1 555-0187',
    'clara.oswald@example.com',
    '15 Willow Lane, Cambridge, MA',
    'High School Teacher',
    'Tubercular',
    'Chilly',
    ARRAY['Pollen', 'Shellfish'],
    'Allergic bronchitis triggered by cold dry winds; spasmodic dry cough at 2-3 AM.',
    'Grandmother had tuberculosis; mother has asthma.',
    'Follow-up'
),
(
    'a4444444-4444-4444-8444-444444444444',
    'PT-2026-0004',
    'Jonathan',
    'Archer',
    '1981-02-17',
    45,
    'Male',
    'AB+',
    '+1 555-0163',
    'j.archer@example.com',
    '77 Maritime Drive, Quincy, MA',
    'Civil Engineer',
    'Syphilis',
    'Ambithermal',
    '{}'::TEXT[],
    'Recurrent aphthous stomatitis and nocturnal bone pains. Ulcerative tendency.',
    'Father had peptic ulcer disease and coronary artery disease.',
    'Active'
),
(
    'a5555555-5555-4555-8555-555555555555',
    'PT-2026-0005',
    'Maya',
    'Lin',
    '1987-06-21',
    39,
    'Female',
    'O-',
    '+1 555-0129',
    'maya.lin@example.com',
    '230 Commonwealth Ave, Boston, MA',
    'Software Engineer',
    'Multi-miasmatic',
    'Chilly',
    ARRAY['Latex'],
    'Generalized anxiety disorder, irritable bowel syndrome alternating diarrhea and constipation.',
    'Strong anxiety in maternal lineage.',
    'Active'
)
ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    age = EXCLUDED.age,
    gender = EXCLUDED.gender,
    blood_group = EXCLUDED.blood_group,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    occupation = EXCLUDED.occupation,
    dominant_miasm = EXCLUDED.dominant_miasm,
    thermal_state = EXCLUDED.thermal_state,
    allergies = EXCLUDED.allergies,
    medical_history = EXCLUDED.medical_history,
    family_history = EXCLUDED.family_history,
    status = EXCLUDED.status;

-- 2. Consultations Seed (8 Longitudinal Consultations)
INSERT INTO public.consultations (
    id, patient_id, consultation_date, chief_complaints, anamnesis_notes, vitals,
    clinical_diagnosis, attached_rubric_ids, attached_rubrics_data,
    remedy_prescribed, potency, potency_scale, dosage_instructions,
    dispensing_label, kent_observation_num, follow_up_progression, next_follow_up_date
) VALUES
-- Eleanor Vance - Consultation 1 (Intake)
(
    'b1111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    '2026-01-15T10:00:00Z',
    'Throbbing right-sided hemicrania with nausea, photophobia, and blurred vision.',
    'Onset after intense computer work under artificial light. Relieved by hard pressure and resting in dark quiet room.',
    '{"bp": "118/76", "pulse": 72, "temperature": "98.4 F", "weight_kg": 58.5}'::JSONB,
    'Right hemicrania (Migraine without aura)',
    ARRAY['head-pain-right-side', 'head-pain-sun-agg', 'stomach-nausea-headache-during'],
    '[{"id": "head-pain-right-side", "path": "HEAD - PAIN - right side", "grade": 3}, {"id": "head-pain-sun-agg", "path": "HEAD - PAIN - sun, from exposure to", "grade": 2}, {"id": "stomach-nausea-headache-during", "path": "STOMACH - NAUSEA - headache, during", "grade": 3}]'::JSONB,
    'Sanguinaria Canadensis',
    '200C',
    'Centesimal',
    '1 dose stat in water, followed by SL globules daily for 7 days.',
    'Sang. Can. 200C (Dispensed)',
    NULL,
    'Initial intake visit. Baseline established.',
    '2026-02-12'
),
-- Eleanor Vance - Consultation 2 (Follow-up)
(
    'b1111111-1111-4111-8111-222222222222',
    'a1111111-1111-4111-8111-111111111111',
    '2026-02-12T10:30:00Z',
    'Follow-up: Right hemicrania frequency reduced by 70%. Mild headache last weekend.',
    'Energy improved, nausea did not reoccur during the mild episode. Sleep quality significantly better.',
    '{"bp": "116/74", "pulse": 70, "temperature": "98.6 F", "weight_kg": 58.8}'::JSONB,
    'Migraine in clinical remission',
    ARRAY['head-pain-right-side'],
    '[{"id": "head-pain-right-side", "path": "HEAD - PAIN - right side", "grade": 1}]'::JSONB,
    'Sanguinaria Canadensis',
    '1M',
    'Centesimal',
    'Single dose 1M, followed by Placebo globules for 3 weeks.',
    'Sang. Can. 1M (Dispensed)',
    4,
    'Kent Observation IV: Recovery without aggravation. Remedy was homeopathic and curative.',
    '2026-03-20'
),
-- Arthur Pendelton - Consultation 1 (Intake)
(
    'b2222222-2222-4222-8222-111111111111',
    'a2222222-2222-4222-8222-222222222222',
    '2026-01-20T14:00:00Z',
    'Severe lumbar stiffness on waking and right knee joint pain aggravated during damp weather.',
    'Modality: Restlessness, must change position constantly. Ameliorated by continued walking and warm applications.',
    '{"bp": "134/86", "pulse": 78, "temperature": "98.5 F", "weight_kg": 84.2}'::JSONB,
    'Lumbar spondylosis with secondary osteoarthritis',
    ARRAY['back-stiffness-lumbar', 'extremities-pain-motion-beginning-agg', 'weather-wet-weather-agg'],
    '[{"id": "back-stiffness-lumbar", "path": "BACK - STIFFNESS - Lumbar region", "grade": 3}, {"id": "extremities-pain-motion-beginning-agg", "path": "EXTREMITIES - PAIN - motion - beginning of, agg.", "grade": 4}, {"id": "weather-wet-weather-agg", "path": "GENERALS - WEATHER - wet weather agg.", "grade": 3}]'::JSONB,
    'Rhus Toxicodendron',
    '200C',
    'Centesimal',
    '1 dose daily in evening for 5 days, then wait.',
    'Rhus Tox 200C (Dispensed)',
    NULL,
    'Initial intake visit. Severe morning stiffness noted.',
    '2026-02-18'
),
-- Arthur Pendelton - Consultation 2 (Follow-up)
(
    'b2222222-2222-4222-8222-222222222222',
    'a2222222-2222-4222-8222-222222222222',
    '2026-02-18T14:30:00Z',
    'Follow-up: Lumbar stiffness markedly relieved. Right knee still stiff after prolonged sitting.',
    'First 3 days had mild transient aggravation followed by substantial easing of pain.',
    '{"bp": "128/82", "pulse": 74, "temperature": "98.4 F", "weight_kg": 83.5}'::JSONB,
    'Osteoarthritis in progression to stability',
    ARRAY['extremities-pain-motion-beginning-agg'],
    '[{"id": "extremities-pain-motion-beginning-agg", "path": "EXTREMITIES - PAIN - motion - beginning of, agg.", "grade": 2}]'::JSONB,
    'Rhus Toxicodendron',
    '1M',
    'Centesimal',
    '1 dose stat, Sac Lac twice daily.',
    'Rhus Tox 1M (Dispensed)',
    1,
    'Kent Observation I: A prolonged aggravation and then rather slow improvement. Remedy deep and correct.',
    '2026-03-25'
),
-- Clara Oswald - Consultation 1 (Intake)
(
    'b3333333-3333-4333-8333-111111111111',
    'a3333333-3333-4333-8333-333333333333',
    '2026-02-01T11:00:00Z',
    'Paroxysmal nocturnal coughing fits waking patient at 2:30 AM with dyspnea.',
    'Cough is dry, barking, aggravated from cold drafts and talking. Thirsty for sips of cold water.',
    '{"bp": "110/70", "pulse": 82, "temperature": "99.1 F", "weight_kg": 54.0, "spo2": 97}'::JSONB,
    'Spasmodic allergic bronchitis',
    ARRAY['cough-night-midnight-after', 'respiration-asthmatic-cold-air-from', 'generalities-cold-air-agg'],
    '[{"id": "cough-night-midnight-after", "path": "COUGH - NIGHT - midnight - after - 2-3 a.m.", "grade": 3}, {"id": "respiration-asthmatic-cold-air-from", "path": "RESPIRATION - ASTHMATIC - cold air, from", "grade": 3}]'::JSONB,
    'Kali Carbonicum',
    '30C',
    'Centesimal',
    '3 globules twice daily for 4 days.',
    'Kali Carb 30C (Dispensed)',
    NULL,
    'Intake visit.',
    '2026-02-22'
),
-- Clara Oswald - Consultation 2 (Follow-up)
(
    'b3333333-3333-4333-8333-222222222222',
    'a3333333-3333-4333-8333-333333333333',
    '2026-02-22T11:30:00Z',
    'Follow-up: 2:30 AM cough stopped completely. Able to sleep through night.',
    'Patient feels warm and clear. Residual mild dry throat in early morning.',
    '{"bp": "112/72", "pulse": 76, "temperature": "98.6 F", "weight_kg": 54.5, "spo2": 99}'::JSONB,
    'Bronchial hypersensitivity resolving',
    ARRAY['cough-dry-morning'],
    '[{"id": "cough-dry-morning", "path": "COUGH - DRY - morning", "grade": 1}]'::JSONB,
    'Kali Carbonicum',
    '200C',
    'Centesimal',
    'Single dose 200C on tongue.',
    'Kali Carb 200C (Dispensed)',
    4,
    'Kent Observation IV: Recovery without aggravation.',
    '2026-04-05'
),
-- Jonathan Archer - Consultation 1 (Intake)
(
    'b4444444-4444-4444-8444-111111111111',
    'a4444444-4444-4444-8444-444444444444',
    '2026-02-10T16:00:00Z',
    'Deep boring nocturnal tibial bone pains and multiple recurrent painful mouth ulcers.',
    'Nightly bone pains worsening from warmth of bed. Profuse salivation during sleep, offensive breath.',
    '{"bp": "126/80", "pulse": 76, "temperature": "98.6 F", "weight_kg": 79.0}'::JSONB,
    'Recurrent aphthous stomatitis with nocturnal periosteal pains',
    ARRAY['mouth-aphthae-painful', 'extremities-pain-bones-night', 'mouth-salivation-sleep-during'],
    '[{"id": "mouth-aphthae-painful", "path": "MOUTH - APHTHAE - painful", "grade": 3}, {"id": "extremities-pain-bones-night", "path": "EXTREMITIES - PAIN - bones - night agg.", "grade": 3}, {"id": "mouth-salivation-sleep-during", "path": "MOUTH - SALIVATION - sleep, during", "grade": 4}]'::JSONB,
    'Mercurius Solubilis',
    '200C',
    'Centesimal',
    '1 dose daily in evening for 3 days.',
    'Merc. Sol. 200C (Dispensed)',
    NULL,
    'Intake visit.',
    '2026-03-10'
),
-- Maya Lin - Consultation 1 (Intake)
(
    'b5555555-5555-4555-8555-111111111111',
    'a5555555-5555-4555-8555-555555555555',
    '2026-02-14T09:30:00Z',
    'Anticipatory anxiety before presentations, bloating immediately after eating small amounts.',
    'Right-sided abdominal distress 4-8 PM. Craves warm drinks and sweets.',
    '{"bp": "114/74", "pulse": 80, "temperature": "98.4 F", "weight_kg": 52.0}'::JSONB,
    'Irritable bowel syndrome with generalized anxiety disorder',
    ARRAY['mind-anxiety-anticipation', 'abdomen-distension-eating-after', 'generalities-time-4-8-pm-agg'],
    '[{"id": "mind-anxiety-anticipation", "path": "MIND - ANXIETY - anticipation, from", "grade": 3}, {"id": "abdomen-distension-eating-after", "path": "ABDOMEN - DISTENSION - eating - after", "grade": 3}, {"id": "generalities-time-4-8-pm-agg", "path": "GENERALS - TIME - 4 to 8 p.m. agg.", "grade": 4}]'::JSONB,
    'Lycopodium Clavatum',
    '200C',
    'Centesimal',
    '1 dose in morning on empty stomach for 2 days.',
    'Lycopodium 200C (Dispensed)',
    NULL,
    'Intake visit.',
    '2026-03-14'
)
ON CONFLICT (id) DO UPDATE SET
    chief_complaints = EXCLUDED.chief_complaints,
    anamnesis_notes = EXCLUDED.anamnesis_notes,
    vitals = EXCLUDED.vitals,
    clinical_diagnosis = EXCLUDED.clinical_diagnosis,
    attached_rubric_ids = EXCLUDED.attached_rubric_ids,
    attached_rubrics_data = EXCLUDED.attached_rubrics_data,
    remedy_prescribed = EXCLUDED.remedy_prescribed,
    potency = EXCLUDED.potency,
    potency_scale = EXCLUDED.potency_scale,
    dosage_instructions = EXCLUDED.dosage_instructions,
    dispensing_label = EXCLUDED.dispensing_label,
    kent_observation_num = EXCLUDED.kent_observation_num,
    follow_up_progression = EXCLUDED.follow_up_progression,
    next_follow_up_date = EXCLUDED.next_follow_up_date;

-- 3. Prescriptions Seed (8 Posology Records)
INSERT INTO public.prescriptions (
    id, consultation_id, patient_id, prescription_date, remedy_name, potency, scale, form, repetition, dispensing_status
) VALUES
(
    'c1111111-1111-4111-8111-111111111111',
    'b1111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    '2026-01-15T10:15:00Z',
    'Sanguinaria Canadensis',
    '200C',
    'Centesimal',
    'Globules',
    'Stat 1 dose, then SL for 7 days',
    'Dispensed'
),
(
    'c1111111-1111-4111-8111-222222222222',
    'b1111111-1111-4111-8111-222222222222',
    'a1111111-1111-4111-8111-111111111111',
    '2026-02-12T10:45:00Z',
    'Sanguinaria Canadensis',
    '1M',
    'Centesimal',
    'Globules',
    'Single dose, placebo for 3 weeks',
    'Dispensed'
),
(
    'c2222222-2222-4222-8222-111111111111',
    'b2222222-2222-4222-8222-111111111111',
    'a2222222-2222-4222-8222-222222222222',
    '2026-01-20T14:20:00Z',
    'Rhus Toxicodendron',
    '200C',
    'Centesimal',
    'Globules',
    'Once daily evening for 5 days',
    'Dispensed'
),
(
    'c2222222-2222-4222-8222-222222222222',
    'b2222222-2222-4222-8222-222222222222',
    'a2222222-2222-4222-8222-222222222222',
    '2026-02-18T14:45:00Z',
    'Rhus Toxicodendron',
    '1M',
    'Centesimal',
    'Globules',
    'Single dose stat, Placebo bid',
    'Dispensed'
),
(
    'c3333333-3333-4333-8333-111111111111',
    'b3333333-3333-4333-8333-111111111111',
    'a3333333-3333-4333-8333-333333333333',
    '2026-02-01T11:20:00Z',
    'Kali Carbonicum',
    '30C',
    'Centesimal',
    'Globules',
    '3 globules bid for 4 days',
    'Dispensed'
),
(
    'c3333333-3333-4333-8333-222222222222',
    'b3333333-3333-4333-8333-222222222222',
    'a3333333-3333-4333-8333-333333333333',
    '2026-02-22T11:45:00Z',
    'Kali Carbonicum',
    '200C',
    'Centesimal',
    'Drops',
    'Single dose in water',
    'Dispensed'
),
(
    'c4444444-4444-4444-8444-111111111111',
    'b4444444-4444-4444-8444-111111111111',
    'a4444444-4444-4444-8444-444444444444',
    '2026-02-10T16:20:00Z',
    'Mercurius Solubilis',
    '200C',
    'Centesimal',
    'Globules',
    'Once daily evening for 3 days',
    'Dispensed'
),
(
    'c5555555-5555-4555-8555-111111111111',
    'b5555555-5555-4555-8555-111111111111',
    'a5555555-5555-4555-8555-555555555555',
    '2026-02-14T09:45:00Z',
    'Lycopodium Clavatum',
    '200C',
    'Centesimal',
    'Globules',
    'Once morning for 2 days',
    'Dispensed'
)
ON CONFLICT (id) DO UPDATE SET
    remedy_name = EXCLUDED.remedy_name,
    potency = EXCLUDED.potency,
    scale = EXCLUDED.scale,
    form = EXCLUDED.form,
    repetition = EXCLUDED.repetition,
    dispensing_status = EXCLUDED.dispensing_status;

-- 4. Appointments Seed (5 Clinical Appointments)
INSERT INTO public.appointments (
    id, patient_id, appointment_date, purpose, status, notes
) VALUES
(
    'd1111111-1111-4111-8111-111111111111',
    'a1111111-1111-4111-8111-111111111111',
    '2026-03-20T10:00:00Z',
    'Routine 6-week migraine follow-up and posology evaluation',
    'Scheduled',
    'Check if any pre-menstrual headaches arose during March cycle.'
),
(
    'd2222222-2222-4222-8222-111111111111',
    'a2222222-2222-4222-8222-222222222222',
    '2026-03-25T14:00:00Z',
    'Knee motility and lumbar stiffness check',
    'Scheduled',
    'Assess response to Rhus Tox 1M.'
),
(
    'd3333333-3333-4333-8333-111111111111',
    'a3333333-3333-4333-8333-333333333333',
    '2026-04-05T11:00:00Z',
    'Seasonal respiratory check ahead of spring pollen surge',
    'Scheduled',
    'Review chest auscultation and nocturnal cough recurrence.'
),
(
    'd4444444-4444-4444-8444-111111111111',
    'a4444444-4444-4444-8444-444444444444',
    '2026-03-10T16:00:00Z',
    'Aphthous stomatitis and nocturnal pain follow-up',
    'Scheduled',
    'Inspect oral mucosa for ulcer healing.'
),
(
    'd5555555-5555-4555-8555-111111111111',
    'a5555555-5555-4555-8555-555555555555',
    '2026-03-14T09:30:00Z',
    'IBS digestive evaluation & anxiety assessment',
    'Scheduled',
    'Review bloating diary and 4-8 PM aggravation.'
)
ON CONFLICT (id) DO UPDATE SET
    appointment_date = EXCLUDED.appointment_date,
    purpose = EXCLUDED.purpose,
    status = EXCLUDED.status,
    notes = EXCLUDED.notes;
