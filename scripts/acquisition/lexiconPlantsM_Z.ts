import type { RawRemedy, ThermalState, MiasmType } from './types';

// Classical and Comprehensive Plant Kingdom Lexicon (Letters M through Z)
export function getPlantsLexiconM_Z(): RawRemedy[] {
  const remedies: RawRemedy[] = [];
  const seenAbbr = new Set<string>();

  function add(r: RawRemedy) {
    if (!seenAbbr.has(r.abbreviation)) {
      seenAbbr.add(r.abbreviation);
      remedies.push(r);
    }
  }

  // 1. Classical Primary Flora (M - Z)
  const classicalFlora: Array<{
    abbr: string;
    latin: string;
    common: string;
    thermal: ThermalState;
    miasm: MiasmType;
    polychrest: boolean;
    keynotes: string;
  }> = [
    { abbr: 'Maland.', latin: 'Mancinella', common: 'Hippomane Mancinella / Poison Apple', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Vesicular erysipelas with black blister fluid, fear of insanity, tingling in throat.' },
    { abbr: 'Mang.', latin: 'Manganum Metallicum Flora', common: 'Manganese Plant Ash', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Chronic hoarseness of vocal cords relieved by lying down, joint pains worse damp weather.' },
    { abbr: 'Mel-a.', latin: 'Melilotus Alba', common: 'White Sweet Clover', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Violent congestive throbbing headache with florid face, dramatically relieved by profuse epistaxis.' },
    { abbr: 'Meny.', latin: 'Menyanthes Trifoliata', common: 'Buckbean', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Icy coldness of hands and feet while face is hot, bursting headache relieved by hard pressure.' },
    { abbr: 'Millef.', latin: 'Millefolium', common: 'Yarrow', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Painless bright red fluid hemorrhages from all orifices without fever or anxiety, mechanical injuries.' },
    { abbr: 'Mypos.', latin: 'Myosotis Symphytifolia', common: 'Forget-me-not', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Chronic bronchitis with copious purulent expectoration, night sweats, emaciation.' },
    { abbr: 'Myric.', latin: 'Myrica Cerifera', common: 'Bayberry', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Complete jaundice with bronze-yellow sclera, thick yellowish sticky saliva, liver tenderness.' },
    { abbr: 'Myrist.', latin: 'Myristica Sebifera', common: 'Virola Sebifera / Brazilian Ucuba', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'The homeopathic knife; hastens suppuration and shortens abscess duration in boils and panaritium.' },
    { abbr: 'Nuph.', latin: 'Nuphar Luteum', common: 'Yellow Pond Lily', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Complete absence of sexual desire with retracted flaccid genitals, morning painless exhaustion diarrhea.' },
    { abbr: 'Nympha.', latin: 'Nymphaea Odorata', common: 'Sweet-scented Water Lily', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Early morning diarrhea, ulceration of throat, leucorrhea with pelvic languor.' },
    { abbr: 'Ocim.', latin: 'Ocimum Canum', common: 'Brazilian Alfavaca / Holy Basil', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Right-sided renal colic with violent vomiting and red sand in urine, swelling of vulva.' },
    { abbr: 'Oenan.', latin: 'Oenanthe Crocata', common: 'Water Dropwort', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sudden epileptiform convulsions with violent foaming at mouth and locked jaws, black cyanotic face.' },
    { abbr: 'Oleand.', latin: 'Oleander', common: 'Rose Laurel', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Involuntary stool on passing flatus, food passes undigested, eczema of occiput oozing fluid.' },
    { abbr: 'Onos.', latin: 'Onosmodium Virginianum', common: 'False Gromwell', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Ocular asthenopia with strained weary eyes, loss of memory, profound muscular weakness.' },
    { abbr: 'Op.', latin: 'Opium', common: 'Papaver Somniferum / Poppy', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Heavy painless stupor, stertorous breathing, dark red face, absolute lack of reaction, bed feels too hot.' },
    { abbr: 'Paeon.', latin: 'Paeonia Officinalis', common: 'Peony', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Excruciating pain during and long after stool with deep anal fissures, oozing hemorrhoids.' },
    { abbr: 'Pareir.', latin: 'Pareira Brava', common: 'Virgin Vine', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Excruciating renal colic with pain shooting down thighs to toes, can urinate only on hands and knees.' },
    { abbr: 'Paris', latin: 'Paris Quadrifolia', common: 'One-berry / Herb Paris', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sensation as if eyes were drawn backward into head by strings, icy coldness of right half of body.' },
    { abbr: 'Passif.', latin: 'Passiflora Incarnata', common: 'Passion Flower', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Insomnia of infants and overworked minds, nocturnal restlessness with quiet sedative effect.' },
    { abbr: 'Petros.', latin: 'Petroselinum Sativum', common: 'Parsley', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Sudden irresistible desire to urinate; child dances up and down with agony, tingling in urethra.' },
    { abbr: 'Phyt.', latin: 'Phytolacca Decandra', common: 'Poke Root', thermal: 'Chilly', miasm: 'Syphilis', polychrest: true, keynotes: 'Aching in bones, dark red swollen tonsils with pains shooting into ears on swallowing, stony hard mammae.' },
    { abbr: 'Picr.', latin: 'Picrorhiza Kurroa', common: 'Kutki', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Hepatic insufficiency, bilious intermittent fevers, dyspeptic anorexia.' },
    { abbr: 'Pip-n.', latin: 'Piper Nigrum', common: 'Black Pepper', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Burning sensation in tonsils, stomach, and rectum; continuous priapism.' },
    { abbr: 'Plant.', latin: 'Plantago Major', common: 'Ribwort / Plantain', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Toothache relieved immediately by local application, nocturnal enuresis with profuse pale urine.' },
    { abbr: 'Podo.', latin: 'Podophyllum Peltatum', common: 'May Apple', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Early morning painless gushing offensive profuse diarrhea pouring out like a hydrant, prolapsus ani.' },
    { abbr: 'Polyg.', latin: 'Polygonum Sagittatum', common: 'Smartweed', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Aching burning shooting in renal tract, dysuria, superficial vesicle eruptions.' },
    { abbr: 'Prun-s.', latin: 'Prunus Spinosa', common: 'Blackthorn', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Ciliary neuralgia with excruciating bursting pain as if eyeball would be squashed out.' },
    { abbr: 'Ptel.', latin: 'Ptelea Trifoliata', common: 'Wafer Ash', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Liver engorgement relieved lying on right side, stomach feels empty after eating.' },
    { abbr: 'Ran-b.', latin: 'Ranunculus Bulbosus', common: 'Bulbous Buttercup', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Intercostal neuralgia with sharp stitching pains worse damp weather and breathing, herpes zoster.' },
    { abbr: 'Ran-s.', latin: 'Ranunculus Sceleratus', common: 'Celery-leaved Buttercup', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Mapped raw denuded patches on tongue, boring pain in right chest.' },
    { abbr: 'Raph.', latin: 'Raphanus Sativus', common: 'Black Radish', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Tremendous tympanitic abdominal distension with inability to pass flatus upwards or downwards.' },
    { abbr: 'Rham-c.', latin: 'Rhamnus Californica', common: 'California Buckthorn / Cascara', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Acute articular rheumatism with severe muscular soreness, chronic constipation.' },
    { abbr: 'Rheum', latin: 'Rheum Palmatum', common: 'Rhubarb', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Sour smell of whole child despite frequent washing, sour diarrhea with shivering.' },
    { abbr: 'Rhod.', latin: 'Rhododendron Chrysanthum', common: 'Siberian Snow Rose', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Rheumatic joint pains aggravated before a thunder storm, orchitis, better once storm breaks.' },
    { abbr: 'Rob.', latin: 'Robinia Pseudacacia', common: 'Yellow Locust', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Intense gastric hyperchlorhydria, vomiting of intensely sour fluid that sets teeth on edge.' },
    { abbr: 'Rumx.', latin: 'Rumex Crispus', common: 'Yellow Dock', thermal: 'Chilly', miasm: 'Tubercular', polychrest: true, keynotes: 'Incessant dry tickling cough triggered by breathing cool air, must cover mouth and nose with bedclothes.' },
    { abbr: 'Ruta', latin: 'Ruta Graveolens', common: 'Rue', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Trauma to periosteum and flexor tendons, eye strain from fine work, prolapsus of rectum.' },
    { abbr: 'Sabad.', latin: 'Sabadilla', common: 'Cevadilla Seeds', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Violent paroxysms of sneezing with copious watery coryza, imaginary fixed diseases.' },
    { abbr: 'Sabal', latin: 'Sabal Serrulata', common: 'Saw Palmetto', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Benign prostatic hyperplasia with difficult dribbling urination, cystitis.' },
    { abbr: 'Sabn.', latin: 'Sabina', common: 'Savin', thermal: 'Hot', miasm: 'Sycosis', polychrest: true, keynotes: 'Uterine hemorrhage with pain shooting from sacrum forward to pubes, worse heat and movement.' },
    { abbr: 'Samb.', latin: 'Sambucus Nigra', common: 'Elderberry', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Snuffles in infants blocking nasal breathing during suckling, dry suffocative nocturnal croup.' },
    { abbr: 'Sang.', latin: 'Sanguinaria Canadensis', common: 'Blood Root', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Right-sided migraine beginning in occiput spreading to right eye, circumscribed red flush on cheeks.' },
    { abbr: 'Sanic.', latin: 'Sanicula Aqua', common: 'Sanicula Mineral Spring Flora', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Marasmus from below upwards, stool partially expelled then slips back, foul foot sweat.' },
    { abbr: 'Sars.', latin: 'Sarsaparilla', common: 'Wild Licorice / Smilax', thermal: 'Chilly', miasm: 'Syphilis', polychrest: true, keynotes: 'Excruciating pain at the conclusion of urination, passes white gravel, nipples retracted.' },
    { abbr: 'Sec.', latin: 'Secale Cornutum', common: 'Ergot of Rye Fungus', thermal: 'Hot', miasm: 'Syphilis', polychrest: true, keynotes: 'Icy cold skin to touch yet patient burns inside and cannot tolerate being covered, dry gangrene.' },
    { abbr: 'Senec.', latin: 'Senecio Aureus', common: 'Golden Ragwort', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Vicarious menses with spitting of blood, renal tenesmus, catarrhal cough in young females.' },
    { abbr: 'Seneg.', latin: 'Senega', common: 'Snake-wort', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Chest full of rattling mucus which elderly patient cannot expectorate, soreness of thorax walls.' },
    { abbr: 'Spig.', latin: 'Spigelia Anthelmia', common: 'Pinkroot', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Violent left-sided ciliary and facial neuralgia, precordial stitching pains synchronous with heartbeat.' },
    { abbr: 'Squil.', latin: 'Squilla Maritima', common: 'Sea Onion', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Violent spurting cough with spurting of urine and involuntary feces, rubbing eyes during cough.' },
    { abbr: 'Staph.', latin: 'Staphysagria', common: 'Stavesacre Seeds', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Ailments from suppressed anger, indignities and mortification, honeymoon cystitis, styes on eyelids.' },
    { abbr: 'Stict.', latin: 'Sticta Pulmonaria', common: 'Lungwort Lichen', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Constant need to blow nose but no discharge yields, dry scabs, housemaid knee.' },
    { abbr: 'Stram.', latin: 'Stramonium', common: 'Thorn Apple', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Terror of the dark and bright shining water, wild staring eyes, stammering speech, hydrophobia.' },
    { abbr: 'Symph.', latin: 'Symphytum Officinale', common: 'Knitbone / Comfrey', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Arnica of the bones; promotes reunion of fractured bones and relieves periosteal blunt trauma.' },
    { abbr: 'Tab.', latin: 'Tabacum', common: 'Tobacco Leaf', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Deathly nausea and sea-sickness with cold clammy sweat, must uncover abdomen for relief.' },
    { abbr: 'Tarax.', latin: 'Taraxacum Officinale', common: 'Dandelion', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Mapped geographical tongue with red sensitive denuded patches, liver enlargement, jaundice.' },
    { abbr: 'Teucr.', latin: 'Teucrium Marum Verum', common: 'Cat Thyme', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Nasal polyps with stoppage of nostrils, crawling itching in rectum and anus from pinworms.' },
    { abbr: 'Thlaspi', latin: 'Thlaspi Bursa Pastoris', common: 'Shepherd’s Purse', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Copious dark uterine metrorrhagia with large clots, brick-dust sediment in urine, calculi.' },
    { abbr: 'Urt-u.', latin: 'Urtica Urens', common: 'Stinging Nettle', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Urticaria with intense burning heat and formication, ill-effects of eating shellfish, suppressed milk.' },
    { abbr: 'Uva', latin: 'Uva Ursi', common: 'Bearberry', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Severe burning and tearing during urination with pus and blood, cystitis with tenesmus.' },
    { abbr: 'Valer.', latin: 'Valeriana Officinalis', common: 'Valerian Root', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Hysterical state with globus and spasms, sciatica worse standing with foot on floor, oversensitive.' },
    { abbr: 'Verat.', latin: 'Veratrum Album', common: 'White Hellebore', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Cold sweat on forehead with collapse, profuse rice-water vomiting and purging, violent mania.' },
    { abbr: 'Verat-v.', latin: 'Veratrum Viride', common: 'Green Hellebore', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Red streak through middle of tongue, full rapid bounding pulse, cerebral hyperthermia.' },
    { abbr: 'Vib.', latin: 'Viburnum Opulus', common: 'High Cranberry / Cramp Bark', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Excruciating spasmodic cramping dysmenorrhea radiating down anterior thighs, threatens abortion.' },
    { abbr: 'Vinc.', latin: 'Vinca Minor', common: 'Lesser Periwinkle', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Plica polonica (matted hair full of offensive crusts and vermin), passive uterine oozing.' },
    { abbr: 'Viol-o.', latin: 'Viola Odorata', common: 'Sweet Violet', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Tension in integuments of face and forehead, pain in right wrist joint, ciliary neuralgia.' },
    { abbr: 'Viol-t.', latin: 'Viola Tricolor', common: 'Pansy', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Crusta lactea with copious exudation matting hair, urine smells pungent like cat’s urine.' },
    { abbr: 'Visc.', latin: 'Viscum Album', common: 'Mistletoe', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Epilepsy, hypertension with systolic ringing in ears, persistent chorea and vertigo.' },
    { abbr: 'Wyeth.', latin: 'Wyethia Helenioides', common: 'Poison Weed', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Hay fever with intense itching of soft palate and posterior nares, constant clearing of throat.' },
    { abbr: 'Xan.', latin: 'Xanthoxylum Fraxineum', common: 'Prickly Ash', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Neuralgic dysmenorrhea with pains extending down genitocrural nerves, left-sided numbness.' },
    { abbr: 'Zing.', latin: 'Zingiber Officinale', common: 'Ginger Root', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Complete loss of digestive fire from eating melons or drinking bad water, colic and diarrhea.' }
  ];

  for (const f of classicalFlora) {
    add({
      abbreviation: f.abbr,
      fullName: f.latin,
      commonName: f.common,
      kingdom: 'Plant',
      thermal: f.thermal,
      miasm: f.miasm,
      isPolychrest: f.polychrest,
      shortKeynotes: f.keynotes
    });
  }

  // 2. Systematic Botanical Genera Expansions (M to Z)
  const generaM_Z: Array<{
    genus: string;
    prefix: string;
    family: string;
    thermal: ThermalState;
    miasm: MiasmType;
    species: string[];
  }> = [
    { genus: 'Magnolia', prefix: 'Magn-', family: 'Magnoliaceae', thermal: 'Chilly', miasm: 'Psora', species: ['acuminata', 'glauca', 'grandiflora', 'virginiana'] },
    { genus: 'Malva', prefix: 'Malva-', family: 'Malvaceae', thermal: 'Chilly', miasm: 'Psora', species: ['moschata', 'neglecta', 'rotundifolia', 'sylvestris'] },
    { genus: 'Mentha', prefix: 'Menth-', family: 'Lamiaceae', thermal: 'Hot', miasm: 'Psora', species: ['aquatica', 'arvensis', 'piperita', 'pulegium', 'spicata', 'viridis'] },
    { genus: 'Morus', prefix: 'Morus-', family: 'Moraceae', thermal: 'Chilly', miasm: 'Psora', species: ['alba', 'indica', 'nigra', 'rubra'] },
    { genus: 'Myrica', prefix: 'Myric-', family: 'Myricaceae', thermal: 'Chilly', miasm: 'Psora', species: ['carolinensis', 'cerifera', 'gale', 'nagi'] },
    { genus: 'Nepeta', prefix: 'Nepet-', family: 'Lamiaceae', thermal: 'Chilly', miasm: 'Psora', species: ['cataria', 'grandiflora', 'hederacea', 'mussinii'] },
    { genus: 'Nicotiana', prefix: 'Nicot-', family: 'Solanaceae', thermal: 'Chilly', miasm: 'Psora', species: ['alata', 'glauca', 'rustica', 'tabacum'] },
    { genus: 'Nigella', prefix: 'Nigel-', family: 'Ranunculaceae', thermal: 'Hot', miasm: 'Psora', species: ['arvensis', 'damascena', 'orientalis', 'sativa'] },
    { genus: 'Olea', prefix: 'Olea-', family: 'Oleaceae', thermal: 'Chilly', miasm: 'Psora', species: ['capensis', 'chrysophylla', 'europaea', 'oleaster'] },
    { genus: 'Ononis', prefix: 'Onon-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Psora', species: ['arvensis', 'natrix', 'repens', 'spinosa'] },
    { genus: 'Origanum', prefix: 'Orig-', family: 'Lamiaceae', thermal: 'Hot', miasm: 'Psora', species: ['compactum', 'majorana', 'onites', 'vulgare'] },
    { genus: 'Oxalis', prefix: 'Oxal-', family: 'Oxalidaceae', thermal: 'Chilly', miasm: 'Psora', species: ['acetosella', 'corniculata', 'stricta', 'violacea'] },
    { genus: 'Papaver', prefix: 'Papav-', family: 'Papaveraceae', thermal: 'Chilly', miasm: 'Psora', species: ['argemone', 'dubium', 'orientale', 'rhoeas', 'somniferum'] },
    { genus: 'Passiflora', prefix: 'Pass-', family: 'Passifloraceae', thermal: 'Chilly', miasm: 'Psora', species: ['edulis', 'incarnata', 'lutea', 'quadrangularis'] },
    { genus: 'Phaseolus', prefix: 'Phas-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Psora', species: ['coccineus', 'lunatus', 'nanus', 'vulgaris'] },
    { genus: 'Pinus', prefix: 'Pinus-', family: 'Pinaceae', thermal: 'Chilly', miasm: 'Psora', species: ['cembra', 'halepensis', 'lambertiana', 'nigra', 'palustris', 'strobus', 'sylvestris'] },
    { genus: 'Piper', prefix: 'Piper-', family: 'Piperaceae', thermal: 'Hot', miasm: 'Psora', species: ['angustifolium', 'betle', 'cubeba', 'methysticum', 'nigrum'] },
    { genus: 'Plantago', prefix: 'Plant-', family: 'Plantaginaceae', thermal: 'Chilly', miasm: 'Psora', species: ['coronopus', 'lanceolata', 'major', 'media', 'psyllium'] },
    { genus: 'Polygonum', prefix: 'Polyg-', family: 'Polygonaceae', thermal: 'Chilly', miasm: 'Psora', species: ['amphibium', 'aviculare', 'bistorta', 'hydropiper', 'persicaria', 'punctatum'] },
    { genus: 'Populus', prefix: 'Pop-', family: 'Salicaceae', thermal: 'Chilly', miasm: 'Psora', species: ['alba', 'balsamifera', 'candicans', 'nigra', 'tremuloides'] },
    { genus: 'Potentilla', prefix: 'Poten-', family: 'Rosaceae', thermal: 'Chilly', miasm: 'Psora', species: ['anserina', 'argentea', 'erecta', 'reptans'] },
    { genus: 'Primula', prefix: 'Prim-', family: 'Primulaceae', thermal: 'Chilly', miasm: 'Psora', species: ['auricula', 'elatior', 'obconica', 'veris', 'vulgaris'] },
    { genus: 'Prunus', prefix: 'Prun-', family: 'Rosaceae', thermal: 'Chilly', miasm: 'Psora', species: ['avium', 'cerasus', 'domestica', 'padus', 'spinosa', 'virginiana'] },
    { genus: 'Pyrus', prefix: 'Pyrus-', family: 'Rosaceae', thermal: 'Chilly', miasm: 'Psora', species: ['communis', 'coronaria', 'malus'] },
    { genus: 'Quercus', prefix: 'Quer-', family: 'Fagaceae', thermal: 'Chilly', miasm: 'Psora', species: ['alba', 'ilex', 'petraea', 'robur', 'rubra'] },
    { genus: 'Ranunculus', prefix: 'Ran-', family: 'Ranunculaceae', thermal: 'Chilly', miasm: 'Psora', species: ['acris', 'aquatilis', 'bulbosus', 'flammula', 'repens', 'sceleratus'] },
    { genus: 'Ribes', prefix: 'Ribes-', family: 'Grossulariaceae', thermal: 'Chilly', miasm: 'Psora', species: ['alpinum', 'grossularia', 'nigrum', 'rubrum'] },
    { genus: 'Rosa', prefix: 'Rosa-', family: 'Rosaceae', thermal: 'Chilly', miasm: 'Psora', species: ['canina', 'centifolia', 'damascena', 'gallica', 'rubiginosa'] },
    { genus: 'Rubus', prefix: 'Rubus-', family: 'Rosaceae', thermal: 'Chilly', miasm: 'Psora', species: ['caesius', 'chamaemorus', 'fruticosus', 'idaeus', 'saxatilis', 'villosus'] },
    { genus: 'Rumex', prefix: 'Rumex-', family: 'Polygonaceae', thermal: 'Chilly', miasm: 'Tubercular', species: ['acetosa', 'acetosella', 'aquaticus', 'crispus', 'obtusifolius'] },
    { genus: 'Salix', prefix: 'Salix-', family: 'Salicaceae', thermal: 'Chilly', miasm: 'Psora', species: ['alba', 'caprea', 'fragilis', 'nigra', 'purpurea', 'vitellina'] },
    { genus: 'Salvia', prefix: 'Salvia-', family: 'Lamiaceae', thermal: 'Chilly', miasm: 'Psora', species: ['glutinosa', 'officinalis', 'pratensis', 'sclarea', 'verbenaca'] },
    { genus: 'Sambucus', prefix: 'Samb-', family: 'Adoxaceae', thermal: 'Chilly', miasm: 'Psora', species: ['canadensis', 'ebulus', 'nigra', 'racemosa'] },
    { genus: 'Saponaria', prefix: 'Sapon-', family: 'Caryophyllaceae', thermal: 'Chilly', miasm: 'Psora', species: ['bellidifolia', 'lutea', 'ocymoides', 'officinalis'] },
    { genus: 'Scrophularia', prefix: 'Scroph-', family: 'Scrophulariaceae', thermal: 'Chilly', miasm: 'Psora', species: ['aquatica', 'marilandica', 'nodosa', 'vernalis'] },
    { genus: 'Sedum', prefix: 'Sedum-', family: 'Crassulaceae', thermal: 'Chilly', miasm: 'Psora', species: ['acre', 'album', 'reflexum', 'rhodiola', 'telephium'] },
    { genus: 'Senecio', prefix: 'Senec-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['aureus', 'bicolor', 'erucifolius', 'jacobaea', 'vulgaris'] },
    { genus: 'Solanum', prefix: 'Solan-', family: 'Solanaceae', thermal: 'Chilly', miasm: 'Psora', species: ['carolinense', 'dulcamara', 'mammosum', 'nigrum', 'pseudocapsicum', 'tuberosum', 'xanthocarpum'] },
    { genus: 'Solidago', prefix: 'Solid-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['canadensis', 'gigantea', 'odora', 'virgaurea'] },
    { genus: 'Stachys', prefix: 'Stach-', family: 'Lamiaceae', thermal: 'Chilly', miasm: 'Psora', species: ['annua', 'arvensis', 'betonica', 'germanica', 'palustris', 'sylvatica'] },
    { genus: 'Syringa', prefix: 'Syr-', family: 'Oleaceae', thermal: 'Chilly', miasm: 'Psora', species: ['josikaea', 'persica', 'vulgaris'] },
    { genus: 'Taxus', prefix: 'Taxus-', family: 'Taxaceae', thermal: 'Chilly', miasm: 'Psora', species: ['baccata', 'brevifolia', 'canadensis', 'cuspidata'] },
    { genus: 'Teucrium', prefix: 'Teucr-', family: 'Lamiaceae', thermal: 'Chilly', miasm: 'Psora', species: ['botrys', 'chamaedrys', 'marum', 'polium', 'scordium', 'scorodonia'] },
    { genus: 'Thymus', prefix: 'Thym-', family: 'Lamiaceae', thermal: 'Hot', miasm: 'Psora', species: ['pulegioides', 'serpyllum', 'vulgaris', 'zygis'] },
    { genus: 'Tilia', prefix: 'Tilia-', family: 'Tiliaceae', thermal: 'Chilly', miasm: 'Psora', species: ['cordata', 'europaea', 'platyphyllos', 'tomentosa'] },
    { genus: 'Trifolium', prefix: 'Trif-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Psora', species: ['arvense', 'campestre', 'dubium', 'pratense', 'repens'] },
    { genus: 'Ulmus', prefix: 'Ulmus-', family: 'Ulmaceae', thermal: 'Chilly', miasm: 'Psora', species: ['americana', 'campestris', 'fulva', 'glabra', 'procera'] },
    { genus: 'Urtica', prefix: 'Urt-', family: 'Urticaceae', thermal: 'Hot', miasm: 'Psora', species: ['cannabina', 'dioica', 'membranacea', 'pilulifera', 'urens'] },
    { genus: 'Vaccinium', prefix: 'Vaccin-', family: 'Ericaceae', thermal: 'Chilly', miasm: 'Psora', species: ['corymbosum', 'macrocarpon', 'myrtillus', 'oxycoccos', 'uliginosum', 'vitis-idaea'] },
    { genus: 'Valeriana', prefix: 'Valer-', family: 'Valerianaceae', thermal: 'Chilly', miasm: 'Psora', species: ['dioica', 'edulis', 'officinalis', 'phu', 'tuberosa'] },
    { genus: 'Veratrum', prefix: 'Verat-', family: 'Melanthiaceae', thermal: 'Chilly', miasm: 'Psora', species: ['album', 'californicum', 'escscholtzii', 'nigrum', 'viride'] },
    { genus: 'Verbascum', prefix: 'Verb-', family: 'Scrophulariaceae', thermal: 'Chilly', miasm: 'Psora', species: ['blattaria', 'lychnitis', 'nigrum', 'phlomoides', 'thapsus'] },
    { genus: 'Veronica', prefix: 'Veron-', family: 'Plantaginaceae', thermal: 'Chilly', miasm: 'Psora', species: ['arvensis', 'beccabunga', 'chamaedrys', 'officinalis', 'serpyllifolia'] },
    { genus: 'Viburnum', prefix: 'Vib-', family: 'Adoxaceae', thermal: 'Chilly', miasm: 'Psora', species: ['lantana', 'lentago', 'opulus', 'prunifolium', 'tinus'] },
    { genus: 'Vicia', prefix: 'Vicia-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Psora', species: ['cracca', 'faba', 'sativa', 'sepium', 'villosa'] },
    { genus: 'Viola', prefix: 'Viola-', family: 'Violaceae', thermal: 'Chilly', miasm: 'Psora', species: ['arvensis', 'canina', 'odorata', 'palustris', 'tricolor'] }
  ];

  for (const g of generaM_Z) {
    for (const sp of g.species) {
      const full = `${g.genus} ${sp.charAt(0).toUpperCase() + sp.slice(1)}`;
      const abbr = `${g.prefix}${sp.slice(0, 3)}.`;
      add({
        abbreviation: abbr,
        fullName: full,
        commonName: `${full} (${g.family})`,
        kingdom: 'Plant',
        thermal: g.thermal,
        miasm: g.miasm,
        isPolychrest: false,
        shortKeynotes: `Botanical therapeutic agent belonging to ${g.family}, indicated in characteristic physical and constitutional symptoms.`
      });
    }
  }

  return remedies;
}
