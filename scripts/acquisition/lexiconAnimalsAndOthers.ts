import type { RawRemedy, ThermalState, MiasmType } from './types';

// Animal, Nosode, Sarcode, and Imponderabilia Lexicon
export function getAnimalsAndOthersLexicon(): RawRemedy[] {
  const remedies: RawRemedy[] = [];
  const seenAbbr = new Set<string>();

  function add(r: RawRemedy) {
    if (!seenAbbr.has(r.abbreviation)) {
      seenAbbr.add(r.abbreviation);
      remedies.push(r);
    }
  }

  // 1. Animal Kingdom (Ophidia, Arachnida, Insecta, Mollusca, Mammalia, Marine)
  const animals: Array<{
    abbr: string;
    latin: string;
    common: string;
    thermal: ThermalState;
    miasm: MiasmType;
    polychrest: boolean;
    keynotes: string;
  }> = [
    // Venoms (Ophidia)
    { abbr: 'Both-l.', latin: 'Bothrops Lanceolatus', common: 'Yellow Viper / Fer-de-lance', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Thrombosis, aphasia after stroke, septic cellulitis with gangrene.' },
    { abbr: 'Cench.', latin: 'Cenchris Contortrix', common: 'Copperhead Snake Venom', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Restlessness, constriction of throat, dreams of vivid snakes and water.' },
    { abbr: 'Crot-c.', latin: 'Crotalus Cascavella', common: 'Brazilian Rattlesnake', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Magnetic hallucinations, fears being alone in dark, constriction of throat.' },
    { abbr: 'Crot-h.', latin: 'Crotalus Horridus', common: 'Timber Rattlesnake Venom', thermal: 'Hot', miasm: 'Syphilis', polychrest: true, keynotes: 'Decomposed dark uncoagulated blood, yellow jaundice, malignant septicemia.' },
    { abbr: 'Elaps', latin: 'Elaps Corallinus', common: 'Coral Snake Venom', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Right-sided affections, cold sensation in stomach after drinking cold water.' },
    { abbr: 'Hydroph-c.', latin: 'Hydrophis Cyanocinctus', common: 'Sea Snake Venom', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Sudden respiratory arrest, rapid muscular paralysis without loss of consciousness.' },
    { abbr: 'Naja', latin: 'Naja Tripudians', common: 'Cobra Venom', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Valvular cardiac disease, angina radiating to left nape and arm, suicidal depression.' },
    { abbr: 'Python', latin: 'Python Regia', common: 'Royal Python Venom / Shed Skin', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Constriction as if crushed in powerful coils, suffocative chest spasms.' },
    { abbr: 'Toxicoph.', latin: 'Toxicophis Pugnax', common: 'Moccasin Snake', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Severe bone aching, sudden intermittent neuralgias with edema.' },
    { abbr: 'Vip.', latin: 'Vipera Berus', common: 'German Viper Venom', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Severe bursting venous fullness, patient feels limbs will burst unless elevated.' },
    // Arachnida (Spiders)
    { abbr: 'Aran.', latin: 'Aranea Diadema', common: 'Cross Spider', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Hydrogenoid constitution, bone chill as if bones made of ice, malaria recurrence.' },
    { abbr: 'Aran-s.', latin: 'Aranea Scinencia', common: 'Grey Spider', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Twitching of muscles, cardiac palpitations with sudden trembling.' },
    { abbr: 'Lat-h.', latin: 'Latrodectus Hasselti', common: 'Redback Spider', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Burning agonizing muscle spasms, localized necrosis and hyperesthesia.' },
    { abbr: 'Lat-m.', latin: 'Latrodectus Mactans', common: 'Black Widow Spider', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Precordial cardiac angina with pain shooting down left axilla into hand, fear of death.' },
    { abbr: 'Mygale', latin: 'Mygale Lasiodora', common: 'Black Cuban Tarantula', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Chorea, involuntary jerkings of limbs and facial grimacing, cannot stand quiet.' },
    { abbr: 'Tarent.', latin: 'Tarentula Hispana', common: 'Spanish Hunting Spider', thermal: 'Hot', miasm: 'Sycosis', polychrest: true, keynotes: 'Extreme restlessness relieved by rhythmic dancing and music, destructive hysteria.' },
    { abbr: 'Tarent-c.', latin: 'Tarentula Cubensis', common: 'Cuban Spider', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Malignant boils, anthrax, carbuncles with agonizing burning, purple discoloration.' },
    { abbr: 'Ther.', latin: 'Theridion Curassavicum', common: 'Orange Spider of Curacao', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Hypersensitivity to sound which reverberates through bones, vertigo on closing eyes.' },
    // Insecta & Arthropoda
    { abbr: 'Apis', latin: 'Apis Mellifica', common: 'Honey Bee', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Edematous bag-like swelling under eyes, stinging burning pains, thirstlessness, worse heat.' },
    { abbr: 'Blatta-a.', latin: 'Blatta Americana', common: 'American Cockroach', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Ascites, jaundice, severe dyspnea with thick purulent mucus.' },
    { abbr: 'Blatta-o.', latin: 'Blatta Orientalis', common: 'Indian Cockroach', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Specific for severe bronchial asthma aggravated by damp rainy weather and mold.' },
    { abbr: 'Canth.', latin: 'Cantharis Vesicatoria', common: 'Spanish Fly / Blister Beetle', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Intense burning with unquenchable tenesmus of bladder, drop-by-drop scalded urination.' },
    { abbr: 'Cimx.', latin: 'Cimex Lectularius', common: 'Bedbug', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Intermittent fever with violent aching in all joints, flexor tendons feel shortened.' },
    { abbr: 'Coccus', latin: 'Coccus Cacti', common: 'Cochineal Insect', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Spasmodic paroxysmal cough with thick ropey white mucous threads hanging from mouth.' },
    { abbr: 'Doryph.', latin: 'Doryphora Decemlineata', common: 'Colorado Potato Beetle', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Ulcerative sore throat, dark foul sloughing, urethral burning on urination.' },
    { abbr: 'Form.', latin: 'Formica Rufa', common: 'Red Wood Ant', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Gout and articular rheumatism, right-sided apoplexy, urine bloody with abundant sediment.' },
    { abbr: 'Pedic.', latin: 'Pediculus Capitis', common: 'Head Louse', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Miliary eruptions, irritable skin pruritus, nocturnal tingling along spine.' },
    { abbr: 'Pulex', latin: 'Pulex Irritans', common: 'Human Flea', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Prickling itching all over body, urine smelling like sweet cedar wood.' },
    { abbr: 'Scol.', latin: 'Scolopendra Morsitans', common: 'Centipede', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Violent local inflammation, severe burning neuralgia, phantom sensations.' },
    { abbr: 'Vespa', latin: 'Vespa Crabro', common: 'Live Wasp', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Chemotropic burning erythema, ovarian neuralgias with left-sided soreness.' },
    // Marine & Mollusca
    { abbr: 'Astac.', latin: 'Astacus Fluviatilis', common: 'Crawfish', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Urticaria covering whole body with liver congestion and enlarged lymph nodes.' },
    { abbr: 'Aster.', latin: 'Asterias Rubens', common: 'Red Starfish', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Left breast induration and cancer pains, neuralgias radiating into inner arm.' },
    { abbr: 'Badiaga', latin: 'Badiaga', common: 'Freshwater Sponge', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Soreness of muscles as if beaten, cough flying from teeth into chest, dandruff.' },
    { abbr: 'Cor-r.', latin: 'Corallium Rubrum', common: 'Red Coral', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Explosive rapid firing cough like minute-guns, air feels cold on inspiring.' },
    { abbr: 'Homar.', latin: 'Homarus Gammarus', common: 'Live Lobster', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sore throat with aching teeth, severe dyspepsia after rich seafood diet.' },
    { abbr: 'Medusa', latin: 'Medusa', common: 'Jellyfish', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Vesicular urticaria with burning prickling, edema of face and vocal cords.' },
    { abbr: 'Murex', latin: 'Murex Purpurea', common: 'Purple Snails / Sea Snail', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Violent sexual excitement with pelvic bearing down, crossing legs for relief.' },
    { abbr: 'Pecten', latin: 'Pecten Jacobaeus', common: 'Scallop', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Severe spasmodic asthma with dry teasing nocturnal cough and cyanosis.' },
    { abbr: 'Spong.', latin: 'Spongia Tosta', common: 'Roasted Sea Sponge', thermal: 'Chilly', miasm: 'Tubercular', polychrest: true, keynotes: 'Dry barking croupy cough like a saw driven through pine wood, better warm drinks.' },
    { abbr: 'Venus', latin: 'Venus Mercenaria', common: 'Quahaug Clam', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Gastric acid dyspepsia, frontal headache with eye strain, fatigue after seafood.' },
    // Mammalian Milks & Secretions
    { abbr: 'Ambr.', latin: 'Ambra Grisea', common: 'Ambergris / Secretion of Sperm Whale', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Extreme embarrassment in company of strangers, cannot pass stool in presence of nurse.' },
    { abbr: 'Castor', latin: 'Castoreum Canadense', common: 'Beaver Sac Secretion', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Prostrated nervous females with hysterical spasms, stomach cramps relieved by pressure.' },
    { abbr: 'Fel-t.', latin: 'Fel Tauri', common: 'Ox Gall', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Liquefies thick sluggish bile, duodenal catarrh, obstinate constipation.' },
    { abbr: 'Hippom.', latin: 'Hippomanes', common: 'Allantoic Concretion of Mare', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Extreme physical weakness, icy chilliness of spine, prostatitis, warts.' },
    { abbr: 'Lac-ac.', latin: 'Lac Acinum', common: 'Sour Milk', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Lactic acidosis, gastric acid reflux, sour stomach with nausea.' },
    { abbr: 'Lac-c.', latin: 'Lac Caninum', common: 'Bitch Milk', thermal: 'Ambithermal', miasm: 'Tubercular', polychrest: true, keynotes: 'Erratic symptoms alternating from side to side every few hours, floating sensation.' },
    { abbr: 'Lac-cap.', latin: 'Lac Caprinum', common: 'Goat Milk', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Fear of falling from cliffs and high rocks, suspicious, nervous throat spasms.' },
    { abbr: 'Lac-d.', latin: 'Lac Defloratum', common: 'Skimmed Cow Milk', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Throbbing sick headache with profound chilliness, total aversion to milk.' },
    { abbr: 'Lac-del.', latin: 'Lac Delphinum', common: 'Dolphin Milk', thermal: 'Hot', miasm: 'Tubercular', polychrest: false, keynotes: 'Desire for play, playful socialization, rhythmic movement, respiratory grace.' },
    { abbr: 'Lac-e.', latin: 'Lac Equinum', common: 'Mare Milk', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sensation of running, passionate wild desire for open plains and freedom.' },
    { abbr: 'Lac-f.', latin: 'Lac Felinum', common: 'Cat Milk', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Ciliary neuralgia, sharp needle-like pains darting in eyeballs, independent disposition.' },
    { abbr: 'Lac-l.', latin: 'Lac Leoninum', common: 'Lion Milk', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Regal pride, violent explosive rage when challenged, cardiac palpitations.' },
    { abbr: 'Lac-lup.', latin: 'Lac Lupinum', common: 'Wolf Milk', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Fierce loyalty to inner pack, acute territorial suspicion of outsiders.' },
    { abbr: 'Lac-mat.', latin: 'Lac Maternum', common: 'Human Breast Milk', thermal: 'Ambithermal', miasm: 'Psora', polychrest: false, keynotes: 'Universal alienation, lack of motherly bonding, dissociation from physical body.' },
    { abbr: 'Lac-v.', latin: 'Lac Vaccinum', common: 'Fresh Whole Cow Milk', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Blindness with headache, acute rheumatic pains in knees and ankles.' },
    { abbr: 'Meph.', latin: 'Mephitis Putorius', common: 'Skunk Secretion', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Violent whooping cough with suffocative choking, must sit up and lean forward.' },
    { abbr: 'Mosch.', latin: 'Moschus Moschiferus', common: 'Musk Deer Secretion', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Hysterical paroxysms, fainting from slight emotional excitement, coldness of single parts.' }
  ];

  for (const a of animals) {
    add({
      abbreviation: a.abbr,
      fullName: a.latin,
      commonName: a.common,
      kingdom: 'Animal',
      thermal: a.thermal,
      miasm: a.miasm,
      isPolychrest: a.polychrest,
      shortKeynotes: a.keynotes
    });
  }

  // 2. Nosodes (Chronic, Acute, Bacterial, Viral, Fungal)
  const nosodes: Array<{
    abbr: string;
    latin: string;
    common: string;
    thermal: ThermalState;
    miasm: MiasmType;
    polychrest: boolean;
    keynotes: string;
  }> = [
    { abbr: 'Anthr.', latin: 'Anthracinum', common: 'Anthrax Poison Nosode', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Malignant pustules, gangrenous septic carbuncles with burning agonizing pains.' },
    { abbr: 'Bac.', latin: 'Bacillinum Burnett', common: 'Tuberculous Sputum Nosode', thermal: 'Chilly', miasm: 'Tubercular', polychrest: true, keynotes: 'Incessant muco-purulent catarrh in elderly, ringworm of scalp, grinds teeth sleeping.' },
    { abbr: 'Botul.', latin: 'Botulinum', common: 'Clostridium Botulinum Nosode', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Bilateral ptosis, progressive bulbar palsy, dryness of pharynx and extreme weakness.' },
    { abbr: 'Carc.', latin: 'Carcinosinum', common: 'Malignant Tissue Nosode', thermal: 'Ambithermal', miasm: 'Multi-miasmatic', polychrest: true, keynotes: 'Fastidious perfectionism, insomnia, blue sclera, history of parental suppression.' },
    { abbr: 'Chol.', latin: 'Cholera Nosode', common: 'Vibrio Cholerae Nosode', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Rice-water watery diarrhea with icy cold collapse, cramps in calves.' },
    { abbr: 'Colib.', latin: 'Colibacillinum', common: 'Escherichia Coli Nosode', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Chronic relapsing cystitis, pyelonephritis, intestinal dysbiosis, urinary foul odor.' },
    { abbr: 'Coryb.', latin: 'Corynebacterium Diphtheriae', common: 'Diphtheria Toxin Nosode', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Gray membranous exudate on tonsils, profound prostration, post-diphtheritic paralysis.' },
    { abbr: 'Diph.', latin: 'Diphtherinum', common: 'Diphtheria Membrane Nosode', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Profound septic prostration, croupy laryngeal cough, cardiac failure from toxin.' },
    { abbr: 'Eberth.', latin: 'Eberthinum', common: 'Salmonella Typhi Nosode', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Typhoid state with dull stupor, abdominal tympany, step-ladder fever curve.' },
    { abbr: 'Epst-b.', latin: 'Epstein-Barr Nosode', common: 'Infectious Mononucleosis Virus', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Post-viral chronic fatigue syndrome, cervical lymphadenopathy, persistent fever.' },
    { abbr: 'Influ.', latin: 'Influenzinum', common: 'Influenza Virus Nosode', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Post-influenzal prostration, dry hacking cough, heaviness in limbs, never well since flu.' },
    { abbr: 'Lyssin', latin: 'Lyssinum / Hydrophobinum', common: 'Rabies Saliva Nosode', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Convulsions triggered by sight or sound of running water, involuntary salivation.' },
    { abbr: 'Mal-off.', latin: 'Malaria Officinalis', common: 'Decomposed Marsh Gas Nosode', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Tertian fever paroxysms, splenomegaly, joint aching with profound bone chill.' },
    { abbr: 'Maland.', latin: 'Malandrinum', common: 'Grease in Horse Hoof Nosode', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Ill-effects of vaccination, chronic dry fissured skin on hands and soles of feet.' },
    { abbr: 'Morbill.', latin: 'Morbillinum', common: 'Measles Virus Nosode', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Catarrhal cough, photophobia, maculopapular rash, chronic post-measles otitis.' },
    { abbr: 'Pert.', latin: 'Pertussinum', common: 'Bordetella Pertussis Nosode', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Severe whooping cough with vomiting, paroxysms leaving child limp and cyanotic.' },
    { abbr: 'Pneu.', latin: 'Pneumococcinum', common: 'Streptococcus Pneumoniae', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Consolidation of lung base, rust-colored sputum, stabbing pleuritic pain.' },
    { abbr: 'Psor.', latin: 'Psorinum', common: 'Scabies Vesicle Nosode', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Extremely chilly (wears fur hat in summer), all secretions smell horribly offensive, despair.' },
    { abbr: 'Pyrog.', latin: 'Pyrogenium', common: 'Rotten Lean Beef Infusion', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Discrepancy between pulse and temperature (high pulse low temp or vice versa), bed feels hard.' },
    { abbr: 'Scarl.', latin: 'Scarlatinum', common: 'Scarlet Fever Nosode', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Strawberry tongue, acute throat angina, post-streptococcal nephritis.' },
    { abbr: 'Scirr.', latin: 'Scirrhinum', common: 'Hard Cancerous Tissue Nosode', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Stony induration of glands, cancer of breast or stomach, profound emaciation.' },
    { abbr: 'Staphyl.', latin: 'Staphylococcinum', common: 'Staphylococcus Aureus Nosode', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Recurrent boils, suppurative acne, chronic osteomyelitis with creamy golden pus.' },
    { abbr: 'Strept.', latin: 'Streptococcinum', common: 'Streptococcus Pyogenes Nosode', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Acute recurrent tonsillitis, rheumatic fever, erysipelatous inflammation.' },
    { abbr: 'Tub-a.', latin: 'Tuberculinum Avis', common: 'Avian Tuberculosis Nosode', thermal: 'Ambithermal', miasm: 'Tubercular', polychrest: false, keynotes: 'Bronchial asthma with continuous chest wheezing, dyspnea relieved by open breeze.' },
    { abbr: 'Tub-k.', latin: 'Tuberculinum Koch', common: 'Koch Tuberculin Nosode', thermal: 'Ambithermal', miasm: 'Tubercular', polychrest: false, keynotes: 'Apex of lung consolidation, hectic fever, drenching night sweats, chronic wanderlust.' },
    { abbr: 'Vacc.', latin: 'Vaccininum', common: 'Cowpox Vaccine Lymph Nosode', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Neuralgia, pustular skin eruptions, post-vaccinial headaches and chilliness.' },
    { abbr: 'Variol.', latin: 'Variolinum', common: 'Smallpox Pustule Nosode', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Excruciating lumbar backache as if broken, pustular eruptions with central umbilication.' }
  ];

  for (const n of nosodes) {
    add({
      abbreviation: n.abbr,
      fullName: n.latin,
      commonName: n.common,
      kingdom: 'Nosode',
      thermal: n.thermal,
      miasm: n.miasm,
      isPolychrest: n.polychrest,
      shortKeynotes: n.keynotes
    });
  }

  // 3. Sarcodes (Healthy Physiological & Endocrine Tissues)
  const sarcodes: Array<{
    abbr: string;
    latin: string;
    common: string;
    thermal: ThermalState;
    miasm: MiasmType;
    polychrest: boolean;
    keynotes: string;
  }> = [
    { abbr: 'Adren.', latin: 'Adrenalinum', common: 'Adrenaline / Epinephrine', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sympathetic nervous overdrive, vasoconstriction, sudden blood pressure spikes.' },
    { abbr: 'Chole.', latin: 'Cholesterinum', common: 'Cholesterol', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Gallstone colic, jaundice, induration of liver, burning pain in right hypochondrium.' },
    { abbr: 'Cortic.', latin: 'Corticotropinum (ACTH)', common: 'Adrenocorticotropic Hormone', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Adrenal insufficiency, fluid retention, metabolic suppression, cushingoid state.' },
    { abbr: 'Cortis.', latin: 'Cortisone', common: 'Cortisone Hormone', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Steroid-dependent states, moon face, osteoporosis, suppressed skin eruptions.' },
    { abbr: 'Follic.', latin: 'Folliculinum', common: 'Ovarian Follicle Hormone (Estrone)', thermal: 'Hot', miasm: 'Sycosis', polychrest: false, keynotes: 'Loss of female identity, premenstrual tension, fibrocystic breasts, estrogen dominance.' },
    { abbr: 'Histam.', latin: 'Histaminum Hydrochloricum', common: 'Histamine', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Immediate hypersensitivity, acute urticaria, bronchospasm, hay fever.' },
    { abbr: 'Insul.', latin: 'Insulinum', common: 'Pancreatic Hormone Insulin', thermal: 'Ambithermal', miasm: 'Psora', polychrest: false, keynotes: 'Disorders of glucose metabolism, diabetes mellitus, severe diabetic pruritus.' },
    { abbr: 'Ooph.', latin: 'Oophorinum', common: 'Ovary Extract', thermal: 'Hot', miasm: 'Sycosis', polychrest: false, keynotes: 'Climacteric hot flushes, nervous depression after oophorectomy, cystic ovaries.' },
    { abbr: 'Orch.', latin: 'Orchitinum', common: 'Testicular Tissue Extract', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Premature senility, testicular atrophy, sexual exhaustion, loss of muscular vigor.' },
    { abbr: 'Pancr.', latin: 'Pancreatinum', common: 'Pancreatic Enzyme Complex', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Steatorrhea, foul greasy stools, chronic pancreatic enzyme insufficiency.' },
    { abbr: 'Parath.', latin: 'Parathyroidinum', common: 'Parathyroid Gland Extract', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Hypocalcemic tetany, muscle twitching, osteomalacia, tingling in fingertips.' },
    { abbr: 'Pituit-a.', latin: 'Pituitaria Anterior', common: 'Anterior Pituitary Lobe', thermal: 'Ambithermal', miasm: 'Sycosis', polychrest: false, keynotes: 'Growth and developmental disorders, acromegaly, hypopituitarism.' },
    { abbr: 'Pituit-p.', latin: 'Pituitaria Posterior', common: 'Posterior Pituitary Lobe', thermal: 'Ambithermal', miasm: 'Sycosis', polychrest: false, keynotes: 'Uterine inertia during labor, diabetes insipidus, arterial hypotension.' },
    { abbr: 'Placent.', latin: 'Placenta Humana', common: 'Human Placenta Tissue', thermal: 'Ambithermal', miasm: 'Psora', polychrest: false, keynotes: 'Postpartum fatigue, difficulty attaching to newborn, hormonal depletion.' },
    { abbr: 'Progest.', latin: 'Progesteronum', common: 'Progesterone Hormone', thermal: 'Hot', miasm: 'Sycosis', polychrest: false, keynotes: 'Luteal phase deficiency, miscarriage prevention, mood volatility before menses.' },
    { abbr: 'Secret.', latin: 'Secretinum', common: 'Duodenal Mucosa Secretin', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sluggish pancreatic secretion, duodenal indigestion with acid eructations.' },
    { abbr: 'Splen.', latin: 'Splen Suis', common: 'Spleen Extract', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Splenomegaly, thrombocytopenia, post-infectious immunodeficiency.' },
    { abbr: 'Testos.', latin: 'Testosteronum', common: 'Testosterone Hormone', thermal: 'Hot', miasm: 'Sycosis', polychrest: false, keynotes: 'Hypogonadism, loss of bone density, muscular wasting, lack of assertiveness.' },
    { abbr: 'Thymus', latin: 'Thymus Glandula', common: 'Thymus Gland Extract', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Chronic autoimmune diathesis, recurring pediatric infections, thymus atrophy.' },
    { abbr: 'Thyroid.', latin: 'Thyroidinum', common: 'Dried Thyroid Gland', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Hypothyroidism with chilliness, puffiness of face, alopecia, cold hands and feet.' }
  ];

  for (const s of sarcodes) {
    add({
      abbreviation: s.abbr,
      fullName: s.latin,
      commonName: s.common,
      kingdom: 'Sarcode',
      thermal: s.thermal,
      miasm: s.miasm,
      isPolychrest: s.polychrest,
      shortKeynotes: s.keynotes
    });
  }

  // 4. Imponderabilia (Physical Radiant Energies & Forces)
  const imponderabilia: Array<{
    abbr: string;
    latin: string;
    common: string;
    thermal: ThermalState;
    miasm: MiasmType;
    polychrest: boolean;
    keynotes: string;
  }> = [
    { abbr: 'Electr.', latin: 'Electricity', common: 'Electrical Current Potentized', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Nervous tremors, electric shock-like sensations running along nerves, chorea.' },
    { abbr: 'Galv.', latin: 'Galvanismus', common: 'Galvanic Direct Current', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Continuous tingling in limbs, hyperesthesia of sensory nerves, vertigo.' },
    { abbr: 'Luna', latin: 'Luna', common: 'Moonlight Potentized', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Somnambulism, aggravation during full moon, edema, emotional restlessness.' },
    { abbr: 'Mag-p-amb.', latin: 'Magnetis Poli Ambo', common: 'Both Poles of Magnet', thermal: 'Ambithermal', miasm: 'Psora', polychrest: false, keynotes: 'Disturbed polarity, burning and pricking in whole body, insomnia.' },
    { abbr: 'Mag-p-arc.', latin: 'Magnetis Polus Arcticus', common: 'North Pole of Magnet', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Coldness in affected parts, toothache relieved by cold air, yawning.' },
    { abbr: 'Mag-p-aus.', latin: 'Magnetis Polus Australis', common: 'South Pole of Magnet', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Severe aching in calves and soles, sudden flushes of heat, varicose veins.' },
    { abbr: 'Sol', latin: 'Sol', common: 'Sunlight Potentized', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Sunstroke, photophobia, polymorphous light eruption, summer headache.' },
    { abbr: 'X-ray', latin: 'X-Ray', common: 'Roentgen Ray Energy', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Radiation burns, skin necrosis, persistent dryness of mucous membranes, leukemia.' }
  ];

  for (const imp of imponderabilia) {
    add({
      abbreviation: imp.abbr,
      fullName: imp.latin,
      commonName: imp.common,
      kingdom: 'Imponderabilia',
      thermal: imp.thermal,
      miasm: imp.miasm,
      isPolychrest: imp.polychrest,
      shortKeynotes: imp.keynotes
    });
  }

  return remedies;
}
