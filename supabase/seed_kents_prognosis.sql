-- ==============================================================================
-- HOZONE CLINICAL DATABASE: KENT'S 12 PROGNOSTIC OBSERVATIONS SEED
-- Script: seed_kents_prognosis.sql
-- ==============================================================================

INSERT INTO public.kent_prognostic_rules (
  id,
  observation_number,
  title,
  short_description,
  clinical_significance,
  category,
  hering_compliance,
  physician_action,
  repetition_warning
)
VALUES
  (
    '77777777-0001-0000-0000-000000000001',
    1,
    'Observation 1: Prolonged Aggravation and Final Decline',
    'Severe protracted aggravation with continuous vital decline of the patient.',
    'Deep incurable structural destruction; the vital force is overwhelmed by an overly deep remedy or too high a potency.',
    'Incurable_Destructive',
    'Non_Compliant_Suppression',
    'Antidote immediately if possible; switch to mild low-potency palliative prescribing.',
    'DANGER: Never repeat the remedy or raise the potency.'
  ),
  (
    '77777777-0002-0000-0000-000000000002',
    2,
    'Observation 2: Long Aggravation with Final Slow Improvement',
    'Lengthy severe aggravation lasting weeks followed by very slow, steady recovery.',
    'Borderline curable case with deep structural changes; vital force gradually rallies to establish cellular repair.',
    'Curable_Borderline',
    'Strictly_Compliant',
    'Wait and watch with utmost patience; give placebo (Sac-lac) and support nutrition.',
    'STRICT WARNING: Do not repeat or change the remedy while slow recovery continues.'
  ),
  (
    '77777777-0003-0000-0000-000000000003',
    3,
    'Observation 3: Quick, Short Aggravation Followed by Rapid Recovery',
    'Sharp, brief homeopathic aggravation for a few hours/days followed by vigorous long-lasting cure.',
    'Highest ideal curative response. The remedy is the exact similimum and the disease is completely curable without structural destruction.',
    'Curable_Ideal',
    'Strictly_Compliant',
    'Absolute non-interference; let the curative cycle run undisturbed.',
    'ABSOLUTE DIRECTIVE: Never repeat the medicine as long as improvement progresses.'
  ),
  (
    '77777777-0004-0000-0000-000000000004',
    4,
    'Observation 4: Recovery Without Any Aggravation',
    'Smooth progressive recovery without any noticeable preliminary aggravation.',
    'Acute curable disorder or superficial functional psoric affection with perfect potency alignment.',
    'Curable_Ideal',
    'Strictly_Compliant',
    'Case is cured; discontinue medication and monitor vitality.',
    'No repetition needed; patient has returned to health.'
  ),
  (
    '77777777-0005-0000-0000-000000000005',
    5,
    'Observation 5: Amelioration First, Aggravation Afterward',
    'Immediate superficial relief for a few days followed by severe relapse and worsening.',
    'The remedy acted merely palliatively or was only a superficial partial similimum; underlying pathology is incurable or wrong remedy.',
    'Superficial_Palliative',
    'Non_Compliant_Suppression',
    'Re-case the patient thoroughly from initial totality; avoid superficial prescribing.',
    'Do not repeat the same remedy; re-examine totality.'
  ),
  (
    '77777777-0006-0000-0000-000000000006',
    6,
    'Observation 6: Too Short Relief of Symptoms',
    'Amelioration lasts only a few hours or days before recurring with equal intensity.',
    'High structural destruction, obstacles to cure, or ongoing maintained mechanical or toxic cause.',
    'Incurable_Destructive',
    'Pending',
    'Investigate obstacles to cure (diet, occupational toxins, mechanical strain); may require lower potency repetition in incurables.',
    'Investigate obstacles before modifying prescription.'
  ),
  (
    '77777777-0007-0000-0000-000000000007',
    7,
    'Observation 7: Full Amelioration of Symptoms, No Relief of Patient',
    'Patient claims symptoms vanished yet physical exhaustion, cachexia, and vital signs decline.',
    'Latent organic breakdown; symptoms are removed palliatively while internal destruction progresses quietly.',
    'Incurable_Destructive',
    'Non_Compliant_Suppression',
    'Prognosis is extremely guarded; inform family gently; provide palliative comfort care.',
    'Avoid high potencies; preserve remaining vital energy.'
  ),
  (
    '77777777-0008-0000-0000-000000000008',
    8,
    'Observation 8: Patients Who Prove Every Remedy Administered',
    'Patient develops the pathogenesis and provings of every single remedy taken.',
    'Hyper-sensitive idiosyncratic constitution with exaggerated susceptibility to dynamized medicines.',
    'Prover_Sensitive',
    'Irrelevant',
    'Prescribe in 30C or 200C diluted in multiple water glasses, or via olfactory inhalation.',
    'Do not administer repeated dry globules.'
  ),
  (
    '77777777-0009-0000-0000-000000000009',
    9,
    'Observation 9: Action of the Remedy Upon Provers',
    'Healthy prover ingests remedy and records genuine proving symptoms.',
    'Confirms physiological proving action of the medicinal substance upon healthy human economy.',
    'Prover_Sensitive',
    'Irrelevant',
    'Record proving modalities and symptoms carefully for Materia Medica inclusion.',
    'Allow prover symptoms to clear spontaneously or antidote if distressing.'
  ),
  (
    '77777777-0010-0000-0000-000000000010',
    10,
    'Observation 10: New Symptoms Appear After the Remedy',
    'Entirely new symptom manifestations appear that the patient never experienced before.',
    'The prescription was incorrect; the remedy has created a medicinal pathogenetic disturbance.',
    'Wrong_Remedy',
    'Non_Compliant_Suppression',
    'Antidote immediately if severe, or wait until drug action subsides and prescribe on true totality.',
    'CRITICAL: Discontinue the remedy immediately.'
  ),
  (
    '77777777-0011-0000-0000-000000000011',
    11,
    'Observation 11: Old Symptoms Are Observed to Reappear',
    'Past chronic symptoms (e.g. childhood eczema, old suppressed discharges) reappear in reverse order.',
    'The highest clinical confirmation of Hering’s Law of Cure: disease is retreating along the exact path it entered.',
    'Curable_Ideal',
    'Strictly_Compliant',
    'REJOICE AND WAIT: Reassure the patient that cure is unfolding; administer placebo only.',
    'GOLDEN RULE: Never touch, antidote, or repeat medicine while old symptoms reappear.'
  ),
  (
    '77777777-0012-0000-0000-000000000012',
    12,
    'Observation 12: Symptoms Take the Wrong Direction',
    'Superficial symptoms disappear while deeper vital organs become affected (e.g. skin rash vanishes into asthma).',
    'Dangerous disease suppression. The remedy or application drove pathology inward into deeper embryonic layers.',
    'Suppression_Danger',
    'Non_Compliant_Suppression',
    'ANTIDOTE IMMEDIATELY: Remedy must be antidoted at once to return symptoms to the surface periphery.',
    'EMERGENCY: Halt prescription and antidote to prevent vital organ damage.'
  )
ON CONFLICT (observation_number) DO NOTHING;
