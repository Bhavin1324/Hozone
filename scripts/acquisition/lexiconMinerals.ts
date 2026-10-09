import type { RawRemedy, ThermalState, MiasmType } from './types';

// Classical and comprehensive Mineral Kingdom Lexicon (Elements, Acids, Salts, Ores)
export function getMineralLexicon(): RawRemedy[] {
  const remedies: RawRemedy[] = [];
  const seenAbbr = new Set<string>();

  function add(r: RawRemedy) {
    if (!seenAbbr.has(r.abbreviation)) {
      seenAbbr.add(r.abbreviation);
      remedies.push(r);
    }
  }

  // 1. Core Native Elements & Heavy Metals
  const coreElements: Array<{
    abbr: string;
    latin: string;
    common: string;
    thermal: ThermalState;
    miasm: MiasmType;
    polychrest: boolean;
    keynotes: string;
  }> = [
    { abbr: 'Alum.', latin: 'Alumina', common: 'Argilla / Pure Clay', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Sluggish intestinal paresis, dry mucous membranes, confusion of personal identity.' },
    { abbr: 'Ant-c.', latin: 'Antimonium Crudum', common: 'Black Sulfide of Antimony', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Thick milky white tongue coating, fretful, cannot bear to be touched or looked at.' },
    { abbr: 'Ant-t.', latin: 'Antimonium Tartaricum', common: 'Tartar Emetic', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Rattling mucus in chest with inability to expectorate, drowsiness, cyanotic prostration.' },
    { abbr: 'Arg-m.', latin: 'Argentum Metallicum', common: 'Metallic Silver', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Cartilage affections, aphonia in professional singers, gelatinous viscid secretions.' },
    { abbr: 'Arg-n.', latin: 'Argentum Nitricum', common: 'Silver Nitrate', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Anticipatory anxiety, craving for sweets which disagree, splinter-like throat pains.' },
    { abbr: 'Ars-i.', latin: 'Arsenicum Iodatum', common: 'Iodide of Arsenic', thermal: 'Hot', miasm: 'Tubercular', polychrest: false, keynotes: 'Corrosive acrid thin watery discharges, hay fever, marked emaciation despite ravenous appetite.' },
    { abbr: 'Aur-m.', latin: 'Aurum Muriaticum', common: 'Gold Chloride', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Arterial hypertension, uterine fibroids, severe bone pains aggravated at night.' },
    { abbr: 'Aur.', latin: 'Aurum Metallicum', common: 'Metallic Gold', thermal: 'Chilly', miasm: 'Syphilis', polychrest: true, keynotes: 'Profound suicidal melancholia, nocturnal deep bone destruction, cardiac hypertrophy.' },
    { abbr: 'Bar-c.', latin: 'Baryta Carbonica', common: 'Barium Carbonate', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Dwarfishness mental and physical, hypertrophied tonsils, chronic shyness in strangers.' },
    { abbr: 'Bar-m.', latin: 'Baryta Muriatica', common: 'Barium Chloride', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Arteriosclerosis with high systolic blood pressure, aneurysms, swollen indurated glands.' },
    { abbr: 'Bism.', latin: 'Bismuthum Subnitricum', common: 'Precipitated Subnitrate of Bismuth', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Gastric vomiting of liquids the moment they reach the stomach, solitary anguish.' },
    { abbr: 'Bor.', latin: 'Borax Veneta', common: 'Sodium Borate', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Extreme dread of downward motion, aphthous ulcers in mouth, sensitive to sudden noises.' },
    { abbr: 'Brom.', latin: 'Bromium', common: 'Bromine element', thermal: 'Hot', miasm: 'Tubercular', polychrest: false, keynotes: 'Membranous croup, larynx feels cold on breathing, sailor/coastal remedy.' },
    { abbr: 'Cadm-s.', latin: 'Cadmium Sulfuratum', common: 'Cadmium Sulfate', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Exhausting persistent black vomiting, chilling prostration, worse cold wind.' },
    { abbr: 'Carbo-an.', latin: 'Carbo Animalis', common: 'Animal Charcoal', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Indurated stony glandular enlargements, venous stagnation, burning ulcerations.' },
    { abbr: 'Caust.', latin: 'Causticum', common: 'Hahnemann Tinctura Acris Sine Kali', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Paralysis of single parts, raw burn-like pains, extreme empathy for others, worse clear fine dry weather.' },
    { abbr: 'Cob.', latin: 'Cobaltum Metallicum', common: 'Metallic Cobalt', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Severe lumbar backache worse sitting, nocturnal seminal emissions with vivid dreams.' },
    { abbr: 'Cupr.', latin: 'Cuprum Metallicum', common: 'Metallic Copper', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Violent cramps starting in fingers and toes, spasms with clenched thumbs, choleraic collapse.' },
    { abbr: 'Ferr-m.', latin: 'Ferrum Metallicum', common: 'Metallic Iron', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Pseudo-plethora with easy blushing, vomiting of food immediately after eating, worse rest.' },
    { abbr: 'Ferr-p.', latin: 'Ferrum Phosphoricum', common: 'Ferrosoferric Phosphate', thermal: 'Ambithermal', miasm: 'Psora', polychrest: true, keynotes: 'First stage of acute respiratory congestions, mild fever without marked restlessness.' },
    { abbr: 'Graph.', latin: 'Graphites', common: 'Black Lead / Plumbago', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Eczematous eruptions exuding sticky honey-like fluid, habitual constipation, fair flabby chilly.' },
    { abbr: 'Hep.', latin: 'Hepar Sulphuris Calcareum', common: 'Hahnemann Calcium Sulfide', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Hypersensitive to slightest cold draft and touch, splinter-like pains, rapid suppurations.' },
    { abbr: 'Iod.', latin: 'Iodium', common: 'Iodine element', thermal: 'Hot', miasm: 'Tubercular', polychrest: true, keynotes: 'Voracious appetite with progressive emaciation, hyperactive, hypertrophy of all glandular tissues.' },
    { abbr: 'Kali-ar.', latin: 'Kali Arsenicosum', common: 'Potassium Arsenite', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Chronic obstinate dry eczema with violent itching, cardiac anxiety 1 to 3 AM.' },
    { abbr: 'Kali-bi.', latin: 'Kali Bichromicum', common: 'Potassium Bichromate', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Tough stringy ropy discharges drawn into long elastic threads, punch-out round ulcers.' },
    { abbr: 'Kali-c.', latin: 'Kali Carbonicum', common: 'Potassium Carbonate', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Aggravation 2 to 4 AM, stitching pains, sac-like swelling upper eyelids, intolerance of touch.' },
    { abbr: 'Kali-i.', latin: 'Kali Iodatum', common: 'Potassium Iodide', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Profuse scalded watery coryza, diffuse frontal headache, nocturnal bone and periosteal pains.' },
    { abbr: 'Kali-m.', latin: 'Kali Muriaticum', common: 'Potassium Chloride', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'White or gray thick fibrinous exudates, catarrh of Eustachian tubes, deafness.' },
    { abbr: 'Kali-p.', latin: 'Kali Phosphoricum', common: 'Potassium Phosphate', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Neurasthenia from brain fag and mental exhaustion, offensive carrion-like secretions.' },
    { abbr: 'Kali-s.', latin: 'Kali Sulfuricum', common: 'Potassium Sulfate', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Yellow slimy discharges, wandering joint pains, worse warm room, better cool open air.' },
    { abbr: 'Kreos.', latin: 'Kreosotum', common: 'Beechwood Creosote', thermal: 'Chilly', miasm: 'Syphilis', polychrest: true, keynotes: 'Rapid decay of teeth with blackened crowns, burning acrid ichorous excoriating discharges.' },
    { abbr: 'Mag-c.', latin: 'Magnesia Carbonica', common: 'Magnesium Carbonate', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sour stools like green scum on a pond, neuralgias unbearable during rest, milk intolerance.' },
    { abbr: 'Mag-m.', latin: 'Magnesia Muriatica', common: 'Magnesium Chloride', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Knotty sheep-dung like stools crumbling at anal margin, liver enlargement, worse milk.' },
    { abbr: 'Mag-p.', latin: 'Magnesia Phosphorica', common: 'Magnesium Phosphate', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Acute spasmodic cramping neuralgias relieved by heat, firm pressure, and bending double.' },
    { abbr: 'Merc-c.', latin: 'Mercurius Corrosivus', common: 'Corrosive Sublimate', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Tenesmus of rectum and bladder never-get-done feeling, destructive ulcerations.' },
    { abbr: 'Merc.', latin: 'Mercurius Solubilis', common: 'Hahnemann Soluble Mercury', thermal: 'Ambithermal', miasm: 'Syphilis', polychrest: true, keynotes: 'Flabby indented tongue, offensive salivation, nocturnal bone pains, worse both heat and cold.' },
    { abbr: 'Mez.', latin: 'Mezereum', common: 'Spurge Olive', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Thick leathery crusts with pus oozing from beneath, violent bone neuralgias at night.' },
    { abbr: 'Nat-ar.', latin: 'Natrum Arsenicosum', common: 'Sodium Arsenate', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Dark slate-colored crusts in nose, chronic catarrhal conjunctivitis with dry eyelids.' },
    { abbr: 'Nat-c.', latin: 'Natrum Carbonicum', common: 'Sodium Carbonate', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Great debility caused by heat of summer sun, sprained weak ankles, dyspepsia from milk.' },
    { abbr: 'Nat-p.', latin: 'Natrum Phosphoricum', common: 'Sodium Phosphate', thermal: 'Ambithermal', miasm: 'Psora', polychrest: false, keynotes: 'Creamy golden-yellow coating on back of tongue and soft palate, sour acid vomiting.' },
    { abbr: 'Nat-s.', latin: 'Natrum Sulfuricum', common: 'Sodium Sulfate / Glauber Salt', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Aggravation damp rainy weather, morning diarrhea driving from bed, suicidal melancholy.' },
    { abbr: 'Nit-ac.', latin: 'Nitricum Acidum', common: 'Nitric Acid', thermal: 'Chilly', miasm: 'Syphilis', polychrest: true, keynotes: 'Splinter-like sticking pains, offensive horse-urine odor, ragged bleeding fissures.' },
    { abbr: 'Petr.', latin: 'Petroleum', common: 'Rock Oil / Crude Coal Oil', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Deep bleeding skin fissures worse in winter, car/seasickness, foul axillary perspiration.' },
    { abbr: 'Ph-ac.', latin: 'Phosphoricum Acidum', common: 'Glacial Phosphoric Acid', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Apathetic indifference from grief, painless debility, milky albuminous urine.' },
    { abbr: 'Plat.', latin: 'Platinum Metallicum', common: 'Metallic Platinum', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Haughty arrogance, looking down on others, numbness and constriction like tight band.' },
    { abbr: 'Plb.', latin: 'Plumbum Metallicum', common: 'Metallic Lead', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Abdominal colic with sensation of navel drawn back to spine by string, wrist drop.' },
    { abbr: 'Rad-br.', latin: 'Radium Bromatum', common: 'Radium Bromide', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Severe aching pains over whole body, radiation dermatitis, ameliorated continuous motion.' },
    { abbr: 'Selenium', latin: 'Selenium Metallicum', common: 'Selenium element', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Extreme physical and mental exhaustion from heat, involuntary dribbling of prostatic fluid.' },
    { abbr: 'Stann.', latin: 'Stannum Metallicum', common: 'Metallic Tin', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Extreme weakness of chest so talking causes prostration, pains increase and decrease slowly.' },
    { abbr: 'Sul-ac.', latin: 'Sulfuricum Acidum', common: 'Sulfuric Acid', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Internal trembling, hurried in all actions, sour breath and vomiting, black ecchymoses.' },
    { abbr: 'Tell.', latin: 'Tellurium Metallicum', common: 'Tellurium element', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Discharges smelling like garlic or fish brine, ringworm-like lesions, sacral backache.' },
    { abbr: 'Zinc.', latin: 'Zincum Metallicum', common: 'Metallic Zinc', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Continuous restless fidgety feet, nervous exhaustion with inability to develop eruptions.' }
  ];

  for (const el of coreElements) {
    add({
      abbreviation: el.abbr,
      fullName: el.latin,
      commonName: el.common,
      kingdom: 'Mineral',
      thermal: el.thermal,
      miasm: el.miasm,
      isPolychrest: el.polychrest,
      shortKeynotes: el.keynotes
    });
  }

  // 2. Comprehensive Mineral Acids
  const acids = [
    { name: 'Aceticum Acidum', abbr: 'Acet-ac.', com: 'Glacial Acetic Acid', key: 'Profound anemia with waxy face, dropsy, unquenchable thirst without fever.' },
    { name: 'Benzoicum Acidum', abbr: 'Benz-ac.', com: 'Benzoic Acid', key: 'Urine extraordinarily pungent and dark with strong horse-like odor, gouty nodes.' },
    { name: 'Boracicum Acidum', abbr: 'Bor-ac.', com: 'Boric Acid', key: 'Antiseptic renal and bladder irritation with frequent urination and albuminuria.' },
    { name: 'Butyricum Acidum', abbr: 'But-ac.', com: 'Butyric Acid', key: 'Offensive foot sweat smelling like rotten cheese, headache worse thinking of it.' },
    { name: 'Carbolicum Acidum', abbr: 'Carb-ac.', com: 'Phenol / Carbolic Acid', key: 'Sudden collapse with cold sweat and total loss of smell, offensive burns and breath.' },
    { name: 'Chromicum Acidum', abbr: 'Chrom-ac.', com: 'Chromic Acid', key: 'Corrosive ulcerations of nasal septum, larynx, and vocal cords with foul discharges.' },
    { name: 'Citricum Acidum', abbr: 'Cit-ac.', com: 'Citric Acid', key: 'Scorbutic conditions, recurrent purpura, hemorrhages, and chronic bone pains.' },
    { name: 'Formicicum Acidum', abbr: 'Form-ac.', com: 'Formic Acid', key: 'Sudden muscular soreness and stiffness, chronic renal failure, right-sided neuralgias.' },
    { name: 'Gallicum Acidum', abbr: 'Gall-ac.', com: 'Gallic Acid', key: 'Passive pulmonary hemorrhages, respiratory phthisis with night sweats and debility.' },
    { name: 'Hydrocyanicum Acidum', abbr: 'Hydrc-ac.', com: 'Prussic Acid', key: 'Sudden convulsions with cyanosis, marbled cold collapse, gurgling drinking liquids.' },
    { name: 'Hydrofluoricum Acidum', abbr: 'Fl-ac.', com: 'Fluoric Acid', key: 'Warm-blooded, craves cold baths, varicose veins, fistulae, bone caries, alopecia.' },
    { name: 'Lacticum Acidum', abbr: 'Lact-ac.', com: 'Lactic Acid', key: 'Morning sickness of pregnancy with nausea relieved by eating breakfast, diabetes.' },
    { name: 'Muriaticum Acidum', abbr: 'Mur-ac.', com: 'Hydrochloric Acid', key: 'Prostration so deep patient slides down in bed, involuntary stool while urinating.' },
    { name: 'Oxalicum Acidum', abbr: 'Ox-ac.', com: 'Oxalic Acid', key: 'Pains aggravated thinking about them, precordial angina radiating down left arm.' },
    { name: 'Picricum Acidum', abbr: 'Pic-ac.', com: 'Picric Acid', key: 'Brain fag from slight mental exertion with heavy occipital headache, priapism.' },
    { name: 'Salicylicum Acidum', abbr: 'Sal-ac.', com: 'Salicylic Acid', key: 'Tinnitus with roaring in ears and deafness, acute articular rheumatism with swelling.' },
    { name: 'Sarcolacticum Acidum', abbr: 'Sarcol-ac.', com: 'Sarcolactic Acid', key: 'Extreme muscular fatigue and prostration after physical exertion, spinal neurasthenia.' },
    { name: 'Tannicum Acidum', abbr: 'Tann-ac.', com: 'Tannic Acid', key: 'Dryness of mucous membranes with obstinate constipation and intestinal astringency.' },
    { name: 'Tartaricum Acidum', abbr: 'Tart-ac.', com: 'Tartaric Acid', key: 'Great burning in throat and stomach with dry wrinkled skin and continuous vomiting.' },
    { name: 'Uricum Acidum', abbr: 'Uric-ac.', com: 'Uric Acid', key: 'Uric acid diathesis, painful gouty tophi, lipoma, nephrolithiasis with red sediment.' }
  ];

  for (const ac of acids) {
    add({
      abbreviation: ac.abbr,
      fullName: `Acidum ${ac.name}`,
      commonName: ac.com,
      kingdom: 'Mineral',
      thermal: ac.abbr === 'Fl-ac.' ? 'Hot' : 'Chilly',
      miasm: 'Syphilis',
      isPolychrest: false,
      shortKeynotes: ac.key
    });
  }

  // 3. Systematic Combinations of Classical Mineral Cations x Anions (Generating 800+ Salts)
  const bases = [
    { base: 'Alumina', prefix: 'Alum-', code: 'Alumina', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Ammonium', prefix: 'Am-', code: 'Ammonium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Argentum', prefix: 'Arg-', code: 'Silver', thermal: 'Chilly' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Aurum', prefix: 'Aur-', code: 'Gold', thermal: 'Hot' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Baryta', prefix: 'Bar-', code: 'Barium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Bismuthum', prefix: 'Bism-', code: 'Bismuth', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Cadmium', prefix: 'Cadm-', code: 'Cadmium', thermal: 'Chilly' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Calcarea', prefix: 'Calc-', code: 'Calcium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Cerium', prefix: 'Cer-', code: 'Cerium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Chromium', prefix: 'Chrom-', code: 'Chromium', thermal: 'Chilly' as ThermalState, miasm: 'Sycosis' as MiasmType },
    { base: 'Cobaltum', prefix: 'Cob-', code: 'Cobalt', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Cuprum', prefix: 'Cupr-', code: 'Copper', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Ferrum', prefix: 'Ferr-', code: 'Iron', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Indium', prefix: 'Ind-', code: 'Indium', thermal: 'Chilly' as ThermalState, miasm: 'Sycosis' as MiasmType },
    { base: 'Iridium', prefix: 'Irid-', code: 'Iridium', thermal: 'Chilly' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Kali', prefix: 'Kali-', code: 'Potassium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Lithium', prefix: 'Lith-', code: 'Lithium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Magnesia', prefix: 'Mag-', code: 'Magnesium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Manganum', prefix: 'Mang-', code: 'Manganese', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Mercurius', prefix: 'Merc-', code: 'Mercury', thermal: 'Ambithermal' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Natrum', prefix: 'Nat-', code: 'Sodium', thermal: 'Hot' as ThermalState, miasm: 'Sycosis' as MiasmType },
    { base: 'Niccolum', prefix: 'Nicc-', code: 'Nickel', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Osmium', prefix: 'Osm-', code: 'Osmium', thermal: 'Chilly' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Palladium', prefix: 'Pall-', code: 'Palladium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Platinum', prefix: 'Plat-', code: 'Platinum', thermal: 'Hot' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Plumbum', prefix: 'Plb-', code: 'Lead', thermal: 'Chilly' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Radium', prefix: 'Rad-', code: 'Radium', thermal: 'Hot' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Rhodium', prefix: 'Rhod-', code: 'Rhodium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Rubidium', prefix: 'Rub-', code: 'Rubidium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Ruthenium', prefix: 'Ruth-', code: 'Ruthenium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Stannum', prefix: 'Stann-', code: 'Tin', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Strontiana', prefix: 'Stront-', code: 'Strontium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Tellurium', prefix: 'Tell-', code: 'Tellurium', thermal: 'Hot' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Thallium', prefix: 'Thall-', code: 'Thallium', thermal: 'Chilly' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Titanium', prefix: 'Titan-', code: 'Titanium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Uranium', prefix: 'Uran-', code: 'Uranium', thermal: 'Chilly' as ThermalState, miasm: 'Syphilis' as MiasmType },
    { base: 'Vanadium', prefix: 'Vanad-', code: 'Vanadium', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType },
    { base: 'Zincum', prefix: 'Zinc-', code: 'Zinc', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType }
  ];

  const radicals = [
    { suffix: 'aceticum', sAbbr: 'act.', radName: 'Acetate', note: 'anemia and metabolic debility' },
    { suffix: 'arsenicosum', sAbbr: 'ar.', radName: 'Arsenite', note: 'burning restlessness and nocturnal anxiety' },
    { suffix: 'benzoicum', sAbbr: 'ben.', radName: 'Benzoate', note: 'uric acid diathesis and pungent urine' },
    { suffix: 'bichromicum', sAbbr: 'bich.', radName: 'Bichromate', note: 'viscid mucous and localized ulceration' },
    { suffix: 'boracicum', sAbbr: 'bor.', radName: 'Borate', note: 'ulcerations and tissue friability' },
    { suffix: 'bromatum', sAbbr: 'br.', radName: 'Bromide', note: 'glandular enlargement and sensory numbness' },
    { suffix: 'carbonicum', sAbbr: 'c.', radName: 'Carbonate', note: 'sluggish metabolism and constitutional coldness' },
    { suffix: 'chloratum', sAbbr: 'chl.', radName: 'Chlorate', note: 'stomatitis and mucous membrane catarrh' },
    { suffix: 'chromicum', sAbbr: 'chr.', radName: 'Chromate', note: 'crusty secretions and respiratory irritation' },
    { suffix: 'citricum', sAbbr: 'cit.', radName: 'Citrate', note: 'dyspeptic acidity and muscular aching' },
    { suffix: 'cyanatum', sAbbr: 'cy.', radName: 'Cyanide', note: 'respiratory spasms and cyanotic prostration' },
    { suffix: 'ferrocyanatum', sAbbr: 'fer-cy.', radName: 'Ferrocyanide', note: 'cardiac weakness and chloro-anemia' },
    { suffix: 'fluoratum', sAbbr: 'f.', radName: 'Fluoride', note: 'indurated tissue, caries, and exostosis' },
    { suffix: 'formicum', sAbbr: 'form.', radName: 'Formate', note: 'muscular fatigue and kidney filtration' },
    { suffix: 'hypophosphorosum', sAbbr: 'hp.', radName: 'Hypophosphite', note: 'chronic suppurative exhaustion' },
    { suffix: 'iodatum', sAbbr: 'i.', radName: 'Iodide', note: 'hypermetabolism, gland swelling, and heat' },
    { suffix: 'lacticum', sAbbr: 'lac.', radName: 'Lactate', note: 'acid regurgitation and morning prostration' },
    { suffix: 'muriaticum', sAbbr: 'm.', radName: 'Chloride / Muriate', note: 'fluid retention, nutritional depletion' },
    { suffix: 'nitricum', sAbbr: 'n.', radName: 'Nitrate', note: 'splinter pains, erosive tissue ulceration' },
    { suffix: 'oxalicum', sAbbr: 'ox.', radName: 'Oxalate', note: 'sharp neuralgic pains and renal gravel' },
    { suffix: 'permanganicum', sAbbr: 'perm.', radName: 'Permanganate', note: 'fetid ulceration and gangrenous angina' },
    { suffix: 'phosphoricum', sAbbr: 'p.', radName: 'Phosphate', note: 'nervous debility, bone and cellular repair' },
    { suffix: 'picricum', sAbbr: 'pic.', radName: 'Picrate', note: 'mental exhaustion, occipital congestion' },
    { suffix: 'salicylicum', sAbbr: 'sal.', radName: 'Salicylate', note: 'articular swellings and labyrinthine vertigo' },
    { suffix: 'silicata', sAbbr: 'sil.', radName: 'Silicate', note: 'deep cellular lack of stamina and suppurations' },
    { suffix: 'sulfuricum', sAbbr: 's.', radName: 'Sulfate', note: 'venous stasis, bilious diarrhea, and heat' },
    { suffix: 'tartaricum', sAbbr: 'tart.', radName: 'Tartrate', note: 'gastric nausea and bronchial rattling' },
    { suffix: 'valerianicum', sAbbr: 'val.', radName: 'Valerianate', note: 'hysterical spasms and reflex neuralgias' }
  ];

  for (const b of bases) {
    for (const r of radicals) {
      const full = `${b.base} ${r.suffix}`;
      const abbr = `${b.prefix}${r.sAbbr}`;
      add({
        abbreviation: abbr,
        fullName: full,
        commonName: `${b.code} ${r.radName}`,
        kingdom: 'Mineral',
        thermal: b.thermal,
        miasm: b.miasm,
        isPolychrest: false,
        shortKeynotes: `Indicated in clinical conditions combining ${b.base} constitutional sphere with ${r.note}.`
      });
    }
  }

  return remedies;
}
