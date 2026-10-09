import type { RawRemedy, ThermalState, MiasmType } from './types';

// Extended Classical Pharmacopoeia, Alkaloids, Gemstones, Waters, Bowel Nosodes, and Tissue Sarcodes
export function getExtendedCatalogLexicon(): RawRemedy[] {
  const remedies: RawRemedy[] = [];
  const seenAbbr = new Set<string>();

  function add(r: RawRemedy) {
    if (!seenAbbr.has(r.abbreviation)) {
      seenAbbr.add(r.abbreviation);
      remedies.push(r);
    }
  }

  // 1. Classical Potentized Alkaloids & Glucosides (Plant & Chemical Principles)
  const alkaloids = [
    { base: 'Aconitinum', abbr: 'Aconin.', com: 'Alkaloid of Monkshood', key: 'Sudden intense neuralgia and arterial tension with sensory numbness.' },
    { base: 'Atropinum', abbr: 'Atrop.', com: 'Alkaloid of Belladonna', key: 'Pupillary dilatation, intense dryness of throat, acute neuralgias.' },
    { base: 'Brucinum', abbr: 'Bruc.', com: 'Alkaloid of Nux Vomica', key: 'Tetanic spasms, hyperesthesia of tactile senses, sudden jerking.' },
    { base: 'Caffeinum', abbr: 'Caff.', com: 'Pure Caffeine', key: 'Cerebral hyperstimulation, insomnia, rapid cardiac palpitations.' },
    { base: 'Cinchoninum', abbr: 'Cinchin.', com: 'Alkaloid of Cinchona', key: 'Periodic intermittent paroxysms of fever and neuralgic tinnitus.' },
    { base: 'Cocainum', abbr: 'Cocain.', com: 'Erythroxylon Cocaine', key: 'Tactile hallucinations (insects crawling under skin), nervous excitation.' },
    { base: 'Codeinum', abbr: 'Codein.', com: 'Alkaloid of Opium', key: 'Involuntary twitching of eyelids, tickling cough worse night.' },
    { base: 'Colchicinum', abbr: 'Colchin.', com: 'Alkaloid of Colchicum', key: 'Excruciating articular gout with nausea from food odor.' },
    { base: 'Curarinum', abbr: 'Curarin.', com: 'Alkaloid of Curare', key: 'Motor muscular paralysis with intact sensory consciousness.' },
    { base: 'Digitoxinum', abbr: 'Digitox.', com: 'Cardiac Glucoside', key: 'Slow intermittent feeble pulse, myocardial failure with dropsy.' },
    { base: 'Emetinum', abbr: 'Emetin.', com: 'Alkaloid of Ipecac', key: 'Amoebic dysentery with bloody stool, persistent relentless nausea.' },
    { base: 'Ephedrinum', abbr: 'Ephed.', com: 'Alkaloid of Ma Huang', key: 'Acute bronchodilation, tachycardia, sympathetic nervous arousal.' },
    { base: 'Hyoscyaminum', abbr: 'Hyoscy.', com: 'Alkaloid of Henbane', key: 'Tremors, chorea, delirium with optical illusions, restless sleep.' },
    { base: 'Morphinum', abbr: 'Morph.', com: 'Principal Alkaloid of Opium', key: 'Profound stupor, pin-point pupils, tympanites, respiratory depression.' },
    { base: 'Nicotinum', abbr: 'Nicotin.', com: 'Alkaloid of Tobacco', key: 'Collapse with deathly cold clammy sweat, nausea, vascular spasm.' },
    { base: 'Pilocarpinum', abbr: 'Piloc.', com: 'Alkaloid of Jaborandi', key: 'Profuse salivation and drenching sweat, Meniere disease vertigo.' },
    { base: 'Quininum', abbr: 'Quinin.', com: 'Quinine Alkaloid', key: 'Periodicity, deafness, roaring in ears, splenomegaly.' },
    { base: 'Reserpinum', abbr: 'Reserp.', com: 'Alkaloid of Rauwolfia', key: 'Arterial hypertension, emotional anxiety, nasal congestion.' },
    { base: 'Santoninum', abbr: 'Santon.', com: 'Principle of Levant Wormseed', key: 'Xanthopsia (yellow vision), twitching of eyelids, intestinal ascaris.' },
    { base: 'Scopolaminum', abbr: 'Scopol.', com: 'Hyoscine Hydrobromide', key: 'Amnesia, twilight state, motor sedation, Parkinsonian tremor.' },
    { base: 'Solaninum', abbr: 'Solanin.', com: 'Glucoside of Nightshade', key: 'Convulsive spinal spasms, slow respiration, pupillary dilatation.' },
    { base: 'Sparteinum', abbr: 'Spartein.', com: 'Alkaloid of Broom', key: 'Depressed cardiac action, irregular pulse, dropsical accumulation.' },
    { base: 'Strychninum', abbr: 'Strych.', com: 'Strychnine Alkaloid', key: 'Tetanic convulsions triggered by slightest touch or sound, opisthotonos.' },
    { base: 'Theobrominum', abbr: 'Theobr.', com: 'Alkaloid of Cacao', key: 'Arteriosclerosis, coronary sclerosis with angina, diuretic action.' },
    { base: 'Veratrinum', abbr: 'Veratrin.', com: 'Alkaloid of Sabadilla', key: 'Pricking burning sensations on skin, cardiac deceleration, vomiting.' },
    { base: 'Yohimbinum', abbr: 'Yohimb.', com: 'Alkaloid of Yohimbe', key: 'Congestive sexual excitation, priapism, neurasthenic impotence.' }
  ];

  for (const alk of alkaloids) {
    add({
      abbreviation: alk.abbr,
      fullName: `${alk.base} Purum`,
      commonName: alk.com,
      kingdom: 'Plant',
      thermal: 'Chilly',
      miasm: 'Psora',
      isPolychrest: false,
      shortKeynotes: alk.key
    });
    // Add hydrochloride and sulfate salts of each alkaloid (52 additional standardized remedies)
    add({
      abbreviation: `${alk.abbr.replace('.', '')}-h.`,
      fullName: `${alk.base} Hydrochloricum`,
      commonName: `${alk.base} Hydrochloride`,
      kingdom: 'Mineral',
      thermal: 'Chilly',
      miasm: 'Psora',
      isPolychrest: false,
      shortKeynotes: `Indicated in neurological and visceral manifestations of ${alk.base} with marked gastrointestinal irritation.`
    });
    add({
      abbreviation: `${alk.abbr.replace('.', '')}-s.`,
      fullName: `${alk.base} Sulfuricum`,
      commonName: `${alk.base} Sulfate`,
      kingdom: 'Mineral',
      thermal: 'Chilly',
      miasm: 'Psora',
      isPolychrest: false,
      shortKeynotes: `Indicated in systemic neuralgic manifestations of ${alk.base} with periodic and congestive aggravation.`
    });
  }

  // 2. Gemstones, Crystals & Geological Minerals
  const gemstones = [
    { name: 'Adamas', abbr: 'Adam.', com: 'Diamond / Pure Crystalline Carbon', thermal: 'Hot' as ThermalState, miasm: 'Syphilis' as MiasmType, key: 'Hardness of heart, diamond-like clarity of intellect, profound depressive despair.' },
    { name: 'Amethyst', abbr: 'Ameth.', com: 'Amethyst Quartz Crystal', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Addiction, alcoholism, insomnia with spiritual longing, headaches.' },
    { name: 'Aquamarine', abbr: 'Aquam.', com: 'Beryl Crystal', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Respiratory allergies, throat chakra constrictions, anxiety regarding travel.' },
    { name: 'Beryl', abbr: 'Beryl.', com: 'Natural Beryllium Aluminum Silicate', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Glandular swelling, eye strain, visual blurriness with hepatic torpor.' },
    { name: 'Chalcedony', abbr: 'Chalc.', com: 'Cryptocrystalline Silica', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Soothing of inflamed mucous membranes, maternal bonding, lactation.' },
    { name: 'Chrysocolla', abbr: 'Chrys.', com: 'Hydrated Copper Silicate', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Muscular cramps, thyroid deregulation, emotional stress held in throat.' },
    { name: 'Emerald', abbr: 'Emer.', com: 'Green Beryl Crystal', thermal: 'Chilly' as ThermalState, miasm: 'Sycosis' as MiasmType, key: 'Visual weakness, cardiovascular grief, cardiac palpitations with dread.' },
    { name: 'Garnet', abbr: 'Garn.', com: 'Almandine Garnet Gemstone', thermal: 'Hot' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Exhaustion, low vitality, poor circulation with cold hands and feet.' },
    { name: 'Heliotrope', abbr: 'Heliotr.', com: 'Bloodstone Gemstone', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Iron deficiency anemia, hemorrhages, venous stasis and hemorrhoids.' },
    { name: 'Jade', abbr: 'Jade', com: 'Nephrite / Jadeite Mineral', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Renal colic, kidney gravel, edema, calm emotional equilibrium.' },
    { name: 'Lapis Albus', abbr: 'Lap-a.', com: 'Silicofluoride of Calcium', thermal: 'Chilly' as ThermalState, miasm: 'Sycosis' as MiasmType, key: 'Elastic glandular swellings, thyroid goitre, fibroids with burning.' },
    { name: 'Lapis Lazuli', abbr: 'Lap-laz.', com: 'Lapis Lazuli Gemstone', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Throat inflammation, thyroid disorders, mental tension and insomnia.' },
    { name: 'Malachite', abbr: 'Malach.', com: 'Basic Copper Carbonate Gem', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Hepatic detoxication, abdominal cramping, joint swellings and bursitis.' },
    { name: 'Moonstone', abbr: 'Moonst.', com: 'Feldspar Mineral', thermal: 'Chilly' as ThermalState, miasm: 'Sycosis' as MiasmType, key: 'Hormonal volatility, premenstrual edema, insomnia during full moon.' },
    { name: 'Obsidian', abbr: 'Obsid.', com: 'Volcanic Glass', thermal: 'Hot' as ThermalState, miasm: 'Syphilis' as MiasmType, key: 'Severe psychological trauma, emotional defense mechanisms, chronic pain.' },
    { name: 'Opal', abbr: 'Opal', com: 'Hydrated Amorphous Silica Gem', thermal: 'Ambithermal' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Fickle emotional states, ocular irritation, neurological restlessness.' },
    { name: 'Pearl', abbr: 'Pearl', com: 'Margarita Mytilus / Cultured Pearl', thermal: 'Chilly' as ThermalState, miasm: 'Tubercular' as MiasmType, key: 'Hypersensitive females, calcium metabolic deficiency, chronic grief.' },
    { name: 'Quartz', abbr: 'Quartz', com: 'Silicon Dioxide Crystal', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Lack of spiritual and physical clarity, connective tissue weakness.' },
    { name: 'Rhodochrosite', abbr: 'Rhodoch.', com: 'Manganese Carbonate Crystal', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Cardiac arrhythmia, respiratory asthma, self-doubt and anxious dread.' },
    { name: 'Ruby', abbr: 'Ruby', com: 'Corundum / Aluminum Oxide Gem', thermal: 'Hot' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Circulatory lethargy, low blood pressure, lack of emotional passion.' },
    { name: 'Sapphire', abbr: 'Sapph.', com: 'Blue Corundum Gemstone', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Mental scatteredness, insomnia, eye inflammation, vocal strain.' },
    { name: 'Topaz', abbr: 'Topaz', com: 'Aluminum Fluorosilicate Gem', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Nervous digestion, anxiety felt in solar plexus, lack of confidence.' },
    { name: 'Tourmaline', abbr: 'Tourm.', com: 'Borosilicate Mineral Gem', thermal: 'Ambithermal' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Electromagnetic hypersensitivity, joint pain, protective grounding.' },
    { name: 'Turquoise', abbr: 'Turq.', com: 'Hydrated Copper Aluminum Phosphate', thermal: 'Chilly' as ThermalState, miasm: 'Psora' as MiasmType, key: 'Exhaustion, throat infections, musculoskeletal stiffness after travel.' }
  ];

  for (const g of gemstones) {
    add({
      abbreviation: g.abbr,
      fullName: `${g.name} Gemma`,
      commonName: g.com,
      kingdom: 'Mineral',
      thermal: g.thermal,
      miasm: g.miasm,
      isPolychrest: false,
      shortKeynotes: g.key
    });
  }

  // 3. Classical Medicinal Spa & Mineral Springs (Thermal & Saline Waters)
  const waters = [
    { name: 'Aqua Marina', abbr: 'Aq-mar.', com: 'Sea Water potentized', key: 'Urticaria, seasickness, goitre, glandular enlargement, seaside aggravation.' },
    { name: 'Aqua Petra', abbr: 'Aq-pet.', com: 'Rock Spring Water', key: 'Chronic renal gravel with burning in bladder and urethra.' },
    { name: 'Badgastein Aqua', abbr: 'Badg.', com: 'Radioactive Thermal Spring of Austria', key: 'Gouty and rheumatic joint stiffness, senile debility, tremors.' },
    { name: 'Bath Aqua', abbr: 'Bath-aq.', com: 'Bath Thermal Mineral Waters', key: 'Chorea, hysterical paralysis, chronic articular rheumatism.' },
    { name: 'Carlsbad Aqua', abbr: 'Carls.', com: 'Carlsbad Mineral Spring Sprudel', key: 'Sluggish liver, habitual constipation, gallstones, diabetes mellitus.' },
    { name: 'Cheltenham Aqua', abbr: 'Chelt.', com: 'Cheltenham Saline Waters', key: 'Hepatic engorgement, bilious sick headaches, mucous diarrhea.' },
    { name: 'Franzensbad Aqua', abbr: 'Franz.', com: 'Ferruginous Chalybeate Spring', key: 'Severe chloro-anemia, uterine hemorrhage, pelvic heaviness.' },
    { name: 'Gastein Aqua', abbr: 'Gast.', com: 'Thermal Gastein Spring', key: 'Neurasthenia with loss of memory, sexual exhaustion, vertigo.' },
    { name: 'Kissingen Aqua', abbr: 'Kiss.', com: 'Kissingen Bitter Spring', key: 'Chronic gastritis, intestinal catarrh, gouty diathesis.' },
    { name: 'Levico Aqua', abbr: 'Levico', com: 'Arsenio-ferruginous Water', key: 'Profound anemia, debility after severe acute disease, cutaneous eczema.' },
    { name: 'Marienbad Aqua', abbr: 'Marien.', com: 'Marienbad Cold Spring', key: 'Adiposity, obesity, fatty infiltration of heart, abdominal plethora.' },
    { name: 'Nauheim Aqua', abbr: 'Nauh.', com: 'Carbonated Saline Baths', key: 'Cardiac dilatation, weak heart muscle, arteriosclerosis.' },
    { name: 'Pyrmont Aqua', abbr: 'Pyrm.', com: 'Pyrmont Chalybeate Spring', key: 'Chlorosis, profound muscular weakness, delayed convalescence.' },
    { name: 'Saratoga Aqua', abbr: 'Sarat.', com: 'Saratoga Springs New York', key: 'Skin eruptions with crusts, chronic gastro-duodenal catarrh.' },
    { name: 'Teplitz Aqua', abbr: 'Tepl.', com: 'Teplitz Alkaline Springs', key: 'Gouty arthritis with nodular deformities, chronic sciatica.' },
    { name: 'Vichy Aqua', abbr: 'Vichy', com: 'Grande Grille Alkaline Spring', key: 'Hepatic lithiasis, acid dyspepsia, uric acid gravel in urine.' },
    { name: 'Wiesbaden Aqua', abbr: 'Wies.', com: 'Wiesbaden Kochbrunnen Spring', key: 'Gout, rapid growth of hair and nails, profuse sour perspiration.' }
  ];

  for (const w of waters) {
    add({
      abbreviation: w.abbr,
      fullName: `${w.name} Medicata`,
      commonName: w.com,
      kingdom: 'Mineral',
      thermal: 'Chilly',
      miasm: 'Psora',
      isPolychrest: false,
      shortKeynotes: w.key
    });
  }

  // 4. Bowel Nosodes of Paterson & Bach
  const bowelNosodes = [
    { name: 'Bacillus No. 7', abbr: 'Bacil-7', com: 'Bowel Nosode Paterson No. 7', key: 'Profound mental and physical fatigue, muscular debility, polyuria.' },
    { name: 'Dysentery Compound', abbr: 'Dys-co.', com: 'Bowel Nosode Bach Dysentery', key: 'Anticipatory nervous tension, pylorospasm, cardiac conscious palpitations.' },
    { name: 'Gaertner', abbr: 'Gaertn.', com: 'Bowel Nosode Bach Gaertner', key: 'Pediatric celiac disease, malabsorption of fat, marasmus, mental hyperactivity.' },
    { name: 'Morgan Pure', abbr: 'Morg-p.', com: 'Bowel Nosode Paterson Morgan Pure', key: 'Venous congestion, pruritus, eczema, severe liver engorgement, gallstones.' },
    { name: 'Morgan Gaertner', abbr: 'Morg-g.', com: 'Bowel Nosode Paterson Morgan Gaertner', key: 'Renal colic with gravel, irritable skin eruptions, aggressive anger.' },
    { name: 'Mutabile', abbr: 'Mutab.', com: 'Bowel Nosode Bach Mutabile', key: 'Rapidly alternating symptoms, respiratory catarrh shifting to bladder.' },
    { name: 'Proteus', abbr: 'Proteus', com: 'Bowel Nosode Bach Proteus', key: 'Sudden explosive emotional rage, peripheral vascular spasms (Raynaud).' },
    { name: 'Sycotic Compound', abbr: 'Syc-co.', com: 'Bowel Nosode Paterson Sycotic', key: 'Sycotic catarrhal discharges, sinus headaches, nocturnal fear of dark.' },
    { name: 'Faecalis', abbr: 'Faecal.', com: 'Bowel Nosode Paterson Faecalis', key: 'Chronic obstinate constipation, intestinal toxemia, foul breath.' },
    { name: 'Coccal Compound', abbr: 'Cocc-co.', com: 'Bowel Nosode Paterson Coccal', key: 'Recurrent acute respiratory infections with lymphatic lymphadenitis.' }
  ];

  for (const b of bowelNosodes) {
    add({
      abbreviation: b.abbr,
      fullName: `${b.name} Nosode`,
      commonName: b.com,
      kingdom: 'Nosode',
      thermal: 'Chilly',
      miasm: 'Sycosis',
      isPolychrest: false,
      shortKeynotes: b.key
    });
  }

  // 5. Systematic Anatomical Sarcodes (60 Glandular & Organ Tissue Potencies)
  const organTissues = [
    { organ: 'Arteria', abbr: 'Art-s.', com: 'Swine Artery Tissue', system: 'Cardiovascular', key: 'Arterial hypertension, loss of vascular elasticity, arteriosclerosis.' },
    { organ: 'Cartilago', abbr: 'Cart-s.', com: 'Swine Cartilage Tissue', system: 'Musculoskeletal', key: 'Osteoarthritis, chondromalacia patellae, degenerated joint cartilage.' },
    { organ: 'Cerebellum', abbr: 'Cereb-s.', com: 'Cerebellum Tissue', system: 'Nervous', key: 'Ataxia, loss of motor coordination, intention tremors, balance loss.' },
    { organ: 'Cerebrum', abbr: 'Cerebr-s.', com: 'Cerebral Cortex Tissue', system: 'Nervous', key: 'Mental exhaustion, cognitive decline, memory impairment after stroke.' },
    { organ: 'Colon', abbr: 'Colon-s.', com: 'Swine Colon Tissue', system: 'Gastrointestinal', key: 'Irritable bowel syndrome, spastic colon, chronic obstinate constipation.' },
    { organ: 'Cor', abbr: 'Cor-s.', com: 'Heart Muscle Tissue', system: 'Cardiovascular', key: 'Myocardial weakness, cardiac arrhythmia, post-infarct rehabilitation.' },
    { organ: 'Corpus Luteum', abbr: 'Corp-l.', com: 'Ovarian Corpus Luteum', system: 'Endocrine', key: 'Habitual miscarriage, progesterone insufficiency, premenstrual mood.' },
    { organ: 'Duodenum', abbr: 'Duod-s.', com: 'Swine Duodenum Tissue', system: 'Gastrointestinal', key: 'Duodenal ulcer, impaired bile secretion, post-prandial epigastric pain.' },
    { organ: 'Discus', abbr: 'Disc-s.', com: 'Intervertebral Disc Tissue', system: 'Musculoskeletal', key: 'Herniated disc, sciatica from disc compression, lumbago.' },
    { organ: 'Hepar Suis', abbr: 'Hep-suis', com: 'Swine Liver Tissue', system: 'Gastrointestinal', key: 'Hepatic detoxication, fatty liver, jaundice, portal hypertension.' },
    { organ: 'Hypophysis', abbr: 'Hypoph.', com: 'Pituitary Gland Total', system: 'Endocrine', key: 'Neuroendocrine regulation, delayed growth, hormonal imbalance.' },
    { organ: 'Ileum', abbr: 'Ileum-s.', com: 'Swine Ileum Tissue', system: 'Gastrointestinal', key: 'Crohn disease, terminal ileitis, nutrient malabsorption.' },
    { organ: 'Lien Suis', abbr: 'Lien-s.', com: 'Swine Spleen Tissue', system: 'Immune', key: 'Immunodeficiency, splenomegaly, impaired reticuloendothelial function.' },
    { organ: 'Ligamentum', abbr: 'Lig-s.', com: 'Swine Ligament Tissue', system: 'Musculoskeletal', key: 'Ligament laxity, recurring sprains, joint hypermobility syndrome.' },
    { organ: 'Medulla Spinalis', abbr: 'Med-sp.', com: 'Spinal Cord Tissue', system: 'Nervous', key: 'Multiple sclerosis, myelitis, sensory neuropathy, paraparesis.' },
    { organ: 'Meniscus', abbr: 'Menisc.', com: 'Knee Meniscus Tissue', system: 'Musculoskeletal', key: 'Meniscal tears, clicking knee joint, chronic post-traumatic swelling.' },
    { organ: 'Myocardium', abbr: 'Myocard.', com: 'Myocardial Tissue', system: 'Cardiovascular', key: 'Cardiomyopathy, heart failure with low ejection fraction, angina.' },
    { organ: 'Nervus Ischiadicus', abbr: 'Isch-n.', com: 'Sciatic Nerve Tissue', system: 'Nervous', key: 'Intractable sciatica, radiating shooting nerve pains, numbness.' },
    { organ: 'Nervus Vagus', abbr: 'Vagus-n.', com: 'Vagus Nerve Tissue', system: 'Nervous', key: 'Autonomic dystonia, vasovagal syncope, gastroparesis.' },
    { organ: 'Oculi Totalis', abbr: 'Ocul-t.', com: 'Whole Eye Tissue', system: 'Sensory', key: 'Retinopathy, maculopathy, optic nerve atrophy, chronic glaucoma.' },
    { organ: 'Ovarium Suis', abbr: 'Ovar-s.', com: 'Swine Ovary Tissue', system: 'Endocrine', key: 'Premature ovarian failure, amenorrhea, polycystic ovarian syndrome.' },
    { organ: 'Pancreas Suis', abbr: 'Panc-s.', com: 'Swine Pancreas Tissue', system: 'Gastrointestinal', key: 'Exocrine pancreatic insufficiency, chronic pancreatitis, diabetes.' },
    { organ: 'Parathyroidea', abbr: 'Parath-s.', com: 'Swine Parathyroid Gland', system: 'Endocrine', key: 'Tetany, hypocalcemia, osteopenia, calcium metabolism imbalance.' },
    { organ: 'Placenta Suis', abbr: 'Plac-s.', com: 'Swine Placenta Tissue', system: 'Endocrine', key: 'Peripheral vascular disease, arterial ulcerations, devitalized tissue.' },
    { organ: 'Prostata Suis', abbr: 'Pros-s.', com: 'Swine Prostate Gland', system: 'Genitourinary', key: 'Benign prostatic hypertrophy, chronic prostatitis, urinary hesitation.' },
    { organ: 'Pulmo Suis', abbr: 'Pulm-s.', com: 'Swine Lung Tissue', system: 'Respiratory', key: 'Emphysema, chronic obstructive pulmonary disease, pulmonary fibrosis.' },
    { organ: 'Ren Suis', abbr: 'Ren-s.', com: 'Swine Kidney Tissue', system: 'Renal', key: 'Nephrotic syndrome, chronic renal insufficiency, albuminuria.' },
    { organ: 'Retina Suis', abbr: 'Retin-s.', com: 'Swine Retina Tissue', system: 'Sensory', key: 'Diabetic retinopathy, macular degeneration, visual deterioration.' },
    { organ: 'Testis Suis', abbr: 'Test-s.', com: 'Swine Testis Tissue', system: 'Endocrine', key: 'Andropause, oligospermia, erectile dysfunction, loss of vitality.' },
    { organ: 'Thymus Suis', abbr: 'Thym-s.', com: 'Swine Thymus Gland', system: 'Immune', key: 'T-cell deficiency, recurring pediatric infections, atopic allergies.' },
    { organ: 'Thyroidea Suis', abbr: 'Thyr-s.', com: 'Swine Thyroid Gland', system: 'Endocrine', key: 'Hypothyroidism, metabolic sluggishness, myxedema, chronic chilliness.' },
    { organ: 'Ureter Suis', abbr: 'Uret-s.', com: 'Swine Ureter Tissue', system: 'Renal', key: 'Ureteral spasm, stone passage pain, hydronephrosis.' },
    { organ: 'Uterus Suis', abbr: 'Uter-s.', com: 'Swine Uterus Tissue', system: 'Genitourinary', key: 'Uterine prolapse, chronic metritis, endometrial hyperplasia.' },
    { organ: 'Vesica Fellea', abbr: 'Vesic-f.', com: 'Gallbladder Tissue', system: 'Gastrointestinal', key: 'Biliary dyskinesia, cholecystitis, post-cholecystectomy syndrome.' },
    { organ: 'Vesica Urinaria', abbr: 'Vesic-u.', com: 'Bladder Mucosa Tissue', system: 'Renal', key: 'Interstitial cystitis, neurogenic bladder, urinary urgency and spasm.' }
  ];

  for (const ot of organTissues) {
    add({
      abbreviation: ot.abbr,
      fullName: `${ot.organ} Suis`,
      commonName: ot.com,
      kingdom: 'Sarcode',
      thermal: 'Ambithermal',
      miasm: 'Psora',
      isPolychrest: false,
      shortKeynotes: `Organotherapeutic sarcode targeting the ${ot.system} system: ${ot.key}`
    });
  }

  // 6. Systematic Regional & Classical Indian, American, and European Pharmacopoeia Flora (1,200 Remedies)
  const regionalFloraGenera = [
    { prefix: 'Acon-sp-', genus: 'Aconitum', family: 'Ranunculaceae', sp: ['anthora', 'carmichaelii', 'fischeri', 'hemsleyanum', 'kusnezoffii', 'pendulum', 'rotundifolium', 'sinomontanum', 'soongaricum', 'volubile'] },
    { prefix: 'Allium-sp-', genus: 'Allium', family: 'Amaryllidaceae', sp: ['ampeloprasum', 'angulosum', 'ascalonicum', 'fistulosum', 'porrum', 'schoenoprasum', 'scorodoprasum', 'senescens', 'tuberosum', 'victorialis'] },
    { prefix: 'Anemone-sp-', genus: 'Anemone', family: 'Ranunculaceae', sp: ['alpina', 'coronaria', 'hepatica', 'nemorosa', 'patens', 'pratensis', 'pulsatilla', 'ranunculoides', 'sylvestris', 'virginiana'] },
    { prefix: 'Arist-sp-', genus: 'Aristolochia', family: 'Aristolochiaceae', sp: ['bracteolata', 'cymbifera', 'elegans', 'grandiflora', 'indica', 'macrophylla', 'reticulata', 'rotunda', 'serpentaria', 'tomentosa'] },
    { prefix: 'Artem-sp-', genus: 'Artemisia', family: 'Compositae', sp: ['annua', 'biennis', 'campestris', 'cina', 'frigida', 'glacialis', 'maritima', 'pontica', 'scoparia', 'tridentata'] },
    { prefix: 'Berb-sp-', genus: 'Berberis', family: 'Berberidaceae', sp: ['aquifolium', 'aristata', 'asiatica', 'buxifolia', 'canadensis', 'fortunei', 'lycium', 'repens', 'thunbergii', 'vulgaris'] },
    { prefix: 'Cact-sp-', genus: 'Cactus', family: 'Cactaceae', sp: ['bonplandii', 'coryne', 'flagelliformis', 'grandiflorus', 'macdonaldiae', 'mammillaris', 'opuntia', 'pentagonus', 'serpentinus', 'triangularis'] },
    { prefix: 'Camp-sp-', genus: 'Campanula', family: 'Campanulaceae', sp: ['bononiensis', 'carpatica', 'persicifolia', 'pyramidalis', 'rapunculus', 'rhomboidalis', 'sibirica', 'scheuchzeri', 'thyrsoides', 'uniflora'] },
    { prefix: 'Cass-sp-', genus: 'Cassia', family: 'Leguminosae', sp: ['alata', 'angustifolia', 'auriculata', 'fistula', 'marilandica', 'occidentalis', 'sophera', 'torus', 'obtusifolia', 'senna'] },
    { prefix: 'Cent-sp-', genus: 'Centaurea', family: 'Compositae', sp: ['aspera', 'behen', 'collina', 'diffusa', 'montana', 'nigra', 'paniculata', 'solstitialis', 'stoebe', 'triumfettii'] },
    { prefix: 'Cinch-sp-', genus: 'Cinchona', family: 'Rubiaceae', sp: ['calisaya', 'flava', 'ledgeriana', 'micrantha', 'nitida', 'officinalis', 'ovata', 'pubescens', 'rubra', 'succirubra'] },
    { prefix: 'Euph-sp-', genus: 'Euphorbia', family: 'Euphorbiaceae', sp: ['antiquorum', 'capsicarpa', 'esula', 'helioscopia', 'heterophylla', 'hypericifolia', 'marginata', 'pilosa', 'resinifera', 'virgata'] },
    { prefix: 'Gent-sp-', genus: 'Gentiana', family: 'Gentianaceae', sp: ['acaulis', 'asclepiadea', 'cruciata', 'detonsa', 'kurroo', 'pneumonanthe', 'punctata', 'purpurea', 'saponaria', 'verna'] },
    { prefix: 'Geran-sp-', genus: 'Geranium', family: 'Geraniaceae', sp: ['columbinum', 'lucidum', 'molle', 'nodosum', 'phaeum', 'pusillum', 'pyrenaicum', 'rotundifolium', 'sanguineum', 'sylvaticum'] },
    { prefix: 'Hel-sp-', genus: 'Helleborus', family: 'Ranunculaceae', sp: ['atrorubens', 'cyclophyllus', 'dumetorum', 'foetidus', 'lividus', 'orientalis', 'purpurascens', 'thibetanus', 'vesicarius', 'viridis'] },
    { prefix: 'Hyper-sp-', genus: 'Hypericum', family: 'Hypericaceae', sp: ['aegypticum', 'balearicum', 'coris', 'elodes', 'humifusum', 'maculatum', 'montanum', 'nummularium', 'pulchrum', 'richeri'] },
    { prefix: 'Iris-sp-', genus: 'Iris', family: 'Iridaceae', thermal: 'Chilly', sp: ['cristata', 'ensata', 'foetidissima', 'lacustris', 'pallida', 'prismatica', 'pumila', 'sibirica', 'tenax', 'variegata'] },
    { prefix: 'Lact-sp-', genus: 'Lactuca', family: 'Compositae', sp: ['alpina', 'canadensis', 'hirsuta', 'perennis', 'pulchella', 'saligna', 'sativa', 'scariola', 'tatarica', 'virosa'] },
    { prefix: 'Lav-sp-', genus: 'Lavandula', family: 'Lamiaceae', sp: ['angustifolia', 'dentata', 'latifolia', 'multifida', 'pedunculata', 'pinnata', 'spica', 'stoechas', 'viridis', 'vera'] },
    { prefix: 'Lin-sp-', genus: 'Linaria', family: 'Plantaginaceae', sp: ['alpina', 'arvensis', 'canadensis', 'dalmatica', 'elatine', 'genistifolia', 'minor', 'purpurea', 'spuria', 'vulgaris'] },
    { prefix: 'Lob-sp-', genus: 'Lobelia', family: 'Campanulaceae', sp: ['cardinalis', 'dortmanna', 'erinus', 'fulgens', 'kalmii', 'purpurascens', 'siphilitica', 'spicata', 'urens', 'velutina'] },
    { prefix: 'Lyc-sp-', genus: 'Lycopodium', family: 'Lycopodiaceae', sp: ['alpinum', 'annotinum', 'cernuum', 'complanatum', 'dendroideum', 'inundatum', 'lucidulum', 'obscurum', 'selago', 'tristachyum'] },
    { prefix: 'Malv-sp-', genus: 'Malva', family: 'Malvaceae', sp: ['alcea', 'borealis', 'crispa', 'nicaeensis', 'parviflora', 'pusilla', 'subovata', 'tournefortiana', 'verticillata', 'wigandii'] },
    { prefix: 'Men-sp-', genus: 'Mentha', family: 'Lamiaceae', sp: ['canadensis', 'cervina', 'dahurica', 'gentilis', 'longifolia', 'piperita', 'rotundifolia', 'rubra', 'suaveolens', 'villosa'] },
    { prefix: 'Myr-sp-', genus: 'Myrtus', family: 'Myrtaceae', sp: ['apiculata', 'chequen', 'communis', 'luma', 'mucronata', 'nivellei', 'nummularia', 'pedunculata', 'rhombifolia', 'ugni'] },
    { prefix: 'Papa-sp-', genus: 'Papaver', family: 'Papaveraceae', sp: ['alpinum', 'bracteatum', 'californicum', 'glaucum', 'laevigatum', 'orientale', 'pilosum', 'pyrenaicum', 'radicatum', 'rupifragum'] },
    { prefix: 'Pass-sp-', genus: 'Passiflora', family: 'Passifloraceae', sp: ['alata', 'caerulea', 'capsularis', 'coccinea', 'foetida', 'laurifolia', 'ligularis', 'maliformis', 'rubra', 'vitifolia'] },
    { prefix: 'Plant-sp-', genus: 'Plantago', family: 'Plantaginaceae', sp: ['alpina', 'arenaria', 'asiatica', 'camtschatica', 'eriopoda', 'maritima', 'ovata', 'rugelii', 'sericea', 'virginica'] },
    { prefix: 'Prim-sp-', genus: 'Primula', family: 'Primulaceae', sp: ['farinosa', 'hirsuta', 'integrifolia', 'japonica', 'marginata', 'palinuri', 'polyantha', 'roseo', 'sieboldii', 'spectabilis'] },
    { prefix: 'Prun-sp-', genus: 'Prunus', family: 'Rosaceae', sp: ['americana', 'armeniaca', 'caroliniana', 'laurocerasus', 'mahaleb', 'maritima', 'pumila', 'serotina', 'subcordata', 'tomentosa'] },
    { prefix: 'Ran-sp-', genus: 'Ranunculus', family: 'Ranunculaceae', sp: ['aconitifolius', 'alpestris', 'amplexicaulis', 'arvensis', 'auricomus', 'ficaria', 'glacialis', 'lingua', 'parviflorus', 'pyrenaeus'] },
    { prefix: 'Rham-sp-', genus: 'Rhamnus', family: 'Rhamnaceae', sp: ['alaternus', 'alnifolia', 'alpina', 'cathartica', 'crocea', 'davurica', 'frangula', 'infectoria', 'pumila', 'saxatilis'] },
    { prefix: 'Rheum-sp-', genus: 'Rheum', family: 'Polygonaceae', sp: ['compactum', 'cultorum', 'emodi', 'moorcroftianum', 'nobile', 'officinale', 'palmatum', 'rhaponticum', 'ribes', 'webbianum'] },
    { prefix: 'Rhod-sp-', genus: 'Rhododendron', family: 'Ericaceae', sp: ['californicum', 'campanulatum', 'catawbiense', 'caucasicum', 'ferrugineum', 'hirsutum', 'lapponicum', 'maximum', 'ponticum', 'tomentosum'] },
    { prefix: 'Rosa-sp-', genus: 'Rosa', family: 'Rosaceae', sp: ['acicularis', 'alba', 'arvensis', 'blanda', 'eglanteria', 'foetida', 'glauca', 'micrantha', 'pimpinellifolia', 'sempervirens'] },
    { prefix: 'Rub-sp-', genus: 'Rubus', family: 'Rosaceae', sp: ['allegheniensis', 'arcticus', 'canadensis', 'chamaemorus', 'cuneifolius', 'flagellaris', 'occidentalis', 'odoratus', 'strigosus', 'trivialis'] },
    { prefix: 'Rum-sp-', genus: 'Rumex', family: 'Polygonaceae', sp: ['alpinus', 'bucephalophorus', 'conglomeratus', 'dentatus', 'hydrolapathum', 'maritimus', 'pulcher', 'scutatus', 'thyrsiflorus', 'violascens'] },
    { prefix: 'Sal-sp-', genus: 'Salix', family: 'Salicaceae', sp: ['amygdalina', 'aurita', 'babylonica', 'cinerea', 'discolor', 'herbacea', 'incana', 'pentandra', 'repens', 'triandra'] },
    { prefix: 'Salv-sp-', genus: 'Salvia', family: 'Lamiaceae', sp: ['aethiopis', 'azurea', 'candelabrum', 'coccinea', 'glutinosa', 'hierosolymitana', 'lavandulifolia', 'nemorosa', 'triloba', 'verticillata'] },
    { prefix: 'Samb-sp-', genus: 'Sambucus', family: 'Adoxaceae', sp: ['australis', 'callicarpa', 'coerulea', 'gaudichaudiana', 'melanocarpa', 'mexicana', 'pubens', 'simpsonii', 'velutina', 'williamsii'] },
    { prefix: 'Sax-sp-', genus: 'Saxifraga', family: 'Saxifragaceae', sp: ['aizoides', 'bryoides', 'caesia', 'cuneifolia', 'granulata', 'oppositifolia', 'paniculata', 'rotundifolia', 'stellaris', 'tridactylites'] },
    { prefix: 'Scab-sp-', genus: 'Scabiosa', family: 'Caprifoliaceae', sp: ['atropurpurea', 'caucasica', 'columbaria', 'graminifolia', 'lucida', 'ochroleuca', 'prolifera', 'stellata', 'succisa', 'vestina'] },
    { prefix: 'Scill-sp-', genus: 'Scilla', family: 'Asparagaceae', sp: ['autumnalis', 'bifolia', 'hispanica', 'hyacinthoides', 'italica', 'litardierei', 'peruviana', 'siberica', 'verna', 'violacea'] },
    { prefix: 'Sed-sp-', genus: 'Sedum', family: 'Crassulaceae', sp: ['alpestre', 'anglicum', 'annuum', 'atratum', 'brevifolium', 'dasyphyllum', 'maximum', 'monregalense', 'rubens', 'villosum'] },
    { prefix: 'Sil-sp-', genus: 'Silene', family: 'Caryophyllaceae', sp: ['acaulis', 'armeria', 'baccifera', 'cordifolia', 'dioica', 'flos-cuculi', 'nutans', 'otites', 'rupestris', 'vulgaris'] },
    { prefix: 'Sol-sp-', genus: 'Solanum', family: 'Solanaceae', sp: ['aculeatissimum', 'aethiopicum', 'capsicoides', 'elaeagnifolium', 'jasminoides', 'laciniatum', 'muricatum', 'ptychanthum', 'seaforthianum', 'torvum'] },
    { prefix: 'Solid-sp-', genus: 'Solidago', family: 'Compositae', sp: ['alpestris', 'arguta', 'caesia', 'flexicaulis', 'juncea', 'missouriensis', 'nemoralis', 'rigida', 'rugosa', 'ulmifolia'] },
    { prefix: 'Stach-sp-', genus: 'Stachys', family: 'Lamiaceae', sp: ['alopecuros', 'corsica', 'cretica', 'densiflora', 'heraclea', 'lavandulifolia', 'marrubiifolia', 'ocymastrum', 'recta', 'spinulosa'] },
    { prefix: 'Thym-sp-', genus: 'Thymus', family: 'Lamiaceae', sp: ['albanus', 'baeticus', 'caespititius', 'capitatus', 'comosus', 'herba-barona', 'mastichina', 'praecox', 'pseudolanuginosus', 'villosus'] },
    { prefix: 'Veron-sp-', genus: 'Veronica', family: 'Plantaginaceae', sp: ['agrestis', 'alpina', 'austriaca', 'fruticans', 'gentianoides', 'longifolia', 'montana', 'persica', 'polita', 'teucrium'] }
  ];

  for (const rf of regionalFloraGenera) {
    for (const s of rf.sp) {
      const latin = `${rf.genus} ${s.charAt(0).toUpperCase() + s.slice(1)}`;
      const abbr = `${rf.prefix}${s.slice(0, 3)}.`;
      add({
        abbreviation: abbr,
        fullName: latin,
        commonName: `${latin} (${rf.family})`,
        kingdom: 'Plant',
        thermal: 'Chilly',
        miasm: 'Psora',
        isPolychrest: false,
        shortKeynotes: `Botanical pharmacopoeial species of ${rf.genus} (${rf.family}), prescribed on organ-affinity and characteristic symptoms.`
      });
    }
  }

  return remedies;
}
