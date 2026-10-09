import type { RawRemedy, ThermalState, MiasmType } from './types';

// Classical and Comprehensive Plant Kingdom Lexicon (Letters A through L)
export function getPlantsLexiconA_L(): RawRemedy[] {
  const remedies: RawRemedy[] = [];
  const seenAbbr = new Set<string>();

  function add(r: RawRemedy) {
    if (!seenAbbr.has(r.abbreviation)) {
      seenAbbr.add(r.abbreviation);
      remedies.push(r);
    }
  }

  // 1. Classical Primary Flora (A - L)
  const classicalFlora: Array<{
    abbr: string;
    latin: string;
    common: string;
    thermal: ThermalState;
    miasm: MiasmType;
    polychrest: boolean;
    keynotes: string;
  }> = [
    { abbr: 'Abies-c.', latin: 'Abies Canadensis', common: 'Hemlock Spruce', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Canine hunger with sensation of cold water dripping down back between shoulders.' },
    { abbr: 'Abies-n.', latin: 'Abies Nigra', common: 'Black Spruce', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sensation of hard-boiled egg lodged in cardiac orifice of stomach after meals.' },
    { abbr: 'Abrot.', latin: 'Abrotanum', common: 'Southernwood', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Marasmus of lower extremities while appetite is ravenous, metastasis of mumps to testes.' },
    { abbr: 'Absin.', latin: 'Absinthium', common: 'Common Wormwood', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Epileptiform convulsions preceded by trembling and nervous hallucinations, grimacing.' },
    { abbr: 'Acal.', latin: 'Acalypha Indica', common: 'Indian Nettle', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Morning pulmonary hemoptysis of bright red blood followed by dark clots, cough worse morning.' },
    { abbr: 'Act-sp.', latin: 'Actaea Spicata', common: 'Baneberry', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Rheumatic gout of small joints of hands and feet swelling from slightest exertion.' },
    { abbr: 'Adon.', latin: 'Adonis Vernalis', common: 'Pheasant Eye', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Cardiac dropsy with feeble irregular pulse, aortic and mitral regurgitation.' },
    { abbr: 'Aesc.', latin: 'Aesculus Hippocastanum', common: 'Horse Chestnut', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Rectum feels full of sharp sticks, purple painful blind hemorrhoids, severe sacroiliac backache.' },
    { abbr: 'Aeth.', latin: 'Aethusa Cynapium', common: 'Fool Parsley', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Inability to digest milk, curdled projectile vomiting in infants, complete mental confusion.' },
    { abbr: 'Agar.', latin: 'Agaricus Muscarius', common: 'Fly Agaric Fungus', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Twitching and choreic jerkings cease during sleep, chilblains with itching burning, diagonally.' },
    { abbr: 'Agn.', latin: 'Agnus Castus', common: 'Chaste Tree', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Premature old age with total sexual impotence, cold relaxed genitals, chronic gleet.' },
    { abbr: 'Ail.', latin: 'Ailanthus Altissima', common: 'Tree of Heaven', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Malignant adynamic scarlatina with dark livid petechiae and stupor, excoriating coryza.' },
    { abbr: 'Alet.', latin: 'Aletris Farinosa', common: 'Star Grass', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Extreme uterine debility with habitual abortion, weary sensation of dragging in pelvis.' },
    { abbr: 'All-c.', latin: 'Allium Cepa', common: 'Red Onion', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Acrid excoriating nasal coryza with bland lachrymation, worse warm room, better cool open air.' },
    { abbr: 'All-s.', latin: 'Allium Sativum', common: 'Garlic', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Dyspepsia in heavy meat-eaters, copious mucous rales in chest, hip joint pain.' },
    { abbr: 'Aloe', latin: 'Aloe Socotrina', common: 'Socotrine Aloes', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Insecurity of anal sphincter, early morning diarrhea driving from bed, hemorrhoids like grapes.' },
    { abbr: 'Alst-c.', latin: 'Alstonia Constricta', common: 'Bitter Bark', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Malarial prostration with tongue heavily coated dirty white, chronic diarrhea.' },
    { abbr: 'Am-d.', latin: 'Ammoniacum Dorema', common: 'Gum Ammoniac', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Chronic asthmatic bronchitis of elderly with profuse viscid mucous expectoration.' },
    { abbr: 'Anac.', latin: 'Anacardium Orientale', common: 'Marking Nut', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Internal conflict of two wills, sensation of plug or hoop, symptoms temporarily relieved by eating.' },
    { abbr: 'Anag.', latin: 'Anagallis Arvensis', common: 'Scarlet Pimpernel', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Itching dry palms with deep fissures, papular vesicular eczema of hands.' },
    { abbr: 'Anhal.', latin: 'Anhalonium Lewinii', common: 'Peyote Cactus', thermal: 'Ambithermal', miasm: 'Psora', polychrest: false, keynotes: 'Vivid kaleidoscope visions of colors, distortion of time and space, motor incoordination.' },
    { abbr: 'Apoc.', latin: 'Apocynum Cannabinum', common: 'Indian Hemp', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Acute dropsy and ascites with urinary suppression, unquenchable thirst yet cold water upsets stomach.' },
    { abbr: 'Aral.', latin: 'Aralia Racemosa', common: 'American Spikenard', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Dry spasmodic asthmatic cough coming on immediately on lying down or falling asleep at 11 PM.' },
    { abbr: 'Arist-c.', latin: 'Aristolochia Clematitis', common: 'Birthwort', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Secondary amenorrhea in young girls, recurring cystitis with urethral burning.' },
    { abbr: 'Arn.', latin: 'Arnica Montana', common: 'Leopard Bane', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Sore bruised feeling all over, bed feels too hard, claims nothing is wrong when critically injured.' },
    { abbr: 'Arum-t.', latin: 'Arum Triphyllum', common: 'Jack-in-the-Pulpit', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Picks at nose and lips till they bleed raw, acrid ichorous coryza boring into nostrils.' },
    { abbr: 'Asaf.', latin: 'Asafoetida', common: 'Gum of the Stinkasand', thermal: 'Hot', miasm: 'Syphilis', polychrest: true, keynotes: 'Globus hystericus with reverse peristalsis, tertiary bone periostitis, extremely offensive discharges.' },
    { abbr: 'Asar.', latin: 'Asarum Europaeum', common: 'European Snake-root', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Extreme nervous hyperesthesia (scraping of silk or paper sets teeth on edge), craves cold water splash.' },
    { abbr: 'Asc-t.', latin: 'Asclepias Tuberosa', common: 'Pleurisy Root', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sharp pleuritic stitching pain worse deep breathing and motion, dry hacking cough.' },
    { abbr: 'Aspar.', latin: 'Asparagus Officinalis', common: 'Garden Asparagus', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Lithiasis, hydrothorax with copious urine having characteristic pungent cat-urine odor.' },
    { abbr: 'Aspid.', latin: 'Aspidosperma Quebracho', common: 'Quebracho Bark', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Digitalis of the lungs; cardiac asthma with urgent air hunger, removes temporary pulmonary stenosis.' },
    { abbr: 'Aven.', latin: 'Avena Sativa', common: 'Common Oat', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Selective action on brain and nervous system, insomnia from nervous exhaustion, alcoholism.' },
    { abbr: 'Bapt.', latin: 'Baptisia Tinctoria', common: 'Wild Indigo', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Besotted drunken face, feels scattered in pieces around bed, all excretions fetid, painless ulcerations.' },
    { abbr: 'Bell-p.', latin: 'Bellis Perennis', common: 'English Daisy', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Arnica of deep pelvic tissues and abdominal trauma, railway spine, venous congestion.' },
    { abbr: 'Berb.', latin: 'Berberis Vulgaris', common: 'Barberry', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Radiating renal colic pains shooting outwards in all directions, bubbling sensations, red gravel.' },
    { abbr: 'Bov.', latin: 'Bovista Lycoperdon', common: 'Puffball Fungus', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Drops things from clumsiness, puffiness of hands, menses flow chiefly at night or early morning.' },
    { abbr: 'Cact.', latin: 'Cactus Grandiflorus', common: 'Night-blooming Cereus', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Sensation of iron band or constriction around heart or chest as if squeezed by an iron fist.' },
    { abbr: 'Calad.', latin: 'Caladium Seguinum', common: 'American Arum', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Impotence with relaxation of penis during sexual desire, extreme mosquito bite intolerance.' },
    { abbr: 'Calen.', latin: 'Calendula Officinalis', common: 'Marigold', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Prevents suppuration in open lacerated wounds, clean surgical healing by first intention.' },
    { abbr: 'Camph.', latin: 'Camphora', common: 'Camphor', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Icy coldness of whole surface yet cannot bear to be covered, sudden collapse in cholera.' },
    { abbr: 'Cann-i.', latin: 'Cannabis Indica', common: 'Indian Hemp', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Exaggeration of time and distance, seconds seem ages, uncontrollable laughter and loquacity.' },
    { abbr: 'Cann-s.', latin: 'Cannabis Sativa', common: 'Hemp', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Urethral gonorrhea with burning smarting radiating into spermatic cord, scalding urine.' },
    { abbr: 'Caps.', latin: 'Capsicum Annuum', common: 'Cayenne Pepper', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Mastoiditis, homesickness with red cheeks, burning in orifices not relieved by heat.' },
    { abbr: 'Card-m.', latin: 'Carduus Marianus', common: 'St. Mary Thistle', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Liver engorgement with portal stasis, golden yellow urine, pain radiating to left lobe.' },
    { abbr: 'Caul.', latin: 'Caulophyllum Thalictroides', common: 'Blue Cohosh', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Spasmodic erratic labor pains flying across abdomen, rheumatic pains in small joints.' },
    { abbr: 'Cean.', latin: 'Ceanothus Americanus', common: 'New Jersey Tea', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Splenic hypertrophy, deep stitching pain in left hypochondrium, malaria sequelae.' },
    { abbr: 'Cedr.', latin: 'Cedron', common: 'Rattlesnake Bean', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Clock-like precision of neuralgia attacks returning at the exact minute each day.' },
    { abbr: 'Cham.', latin: 'Chamomilla', common: 'German Chamomile', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Peevish, uncivil, pains drive him frantic, one cheek red and hot the other pale and cold, quiet only when carried.' },
    { abbr: 'Chel.', latin: 'Chelidonium Majus', common: 'Greater Celandine', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Constant pain under inferior angle of right scapula, jaundice, craves very hot drinks.' },
    { abbr: 'Chim.', latin: 'Chimaphila Umbellata', common: 'Pipsissewa', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Sensation of ball in perineum when sitting down, ropy mucous sediment in urine.' },
    { abbr: 'Chin.', latin: 'China Officinalis', common: 'Peruvian Bark', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Debility from loss of vital fluids, tympanitic abdominal distension not relieved by eructations.' },
    { abbr: 'Cic.', latin: 'Cicuta Virosa', common: 'Water Hemlock', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Opisthotonos with head bent backward, strange childish behavior, craves inedible items like coal.' },
    { abbr: 'Cimic.', latin: 'Cimicifuga Racemosa', common: 'Black Cohosh', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Sensation of heavy black cloud hanging over everything, uterine reflex neuralgias.' },
    { abbr: 'Cina', latin: 'Cina Maritima', common: 'Wormseed', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Grinds teeth in sleep, picks nose constantly, screaming when approached, canine hunger.' },
    { abbr: 'Cist.', latin: 'Cistus Canadensis', common: 'Rock Rose', thermal: 'Chilly', miasm: 'Tubercular', polychrest: false, keynotes: 'Extreme coldness in throat, inhaled air feels icy cold, scrofulous indurated neck glands.' },
    { abbr: 'Clemt.', latin: 'Clematis Erecta', common: 'Virgin Bower', thermal: 'Chilly', miasm: 'Sycosis', polychrest: false, keynotes: 'Urethral stricture with interrupted urination, orchitis, right spermatic cord soreness.' },
    { abbr: 'Cocc.', latin: 'Cocculus Indicus', common: 'Indian Cockle', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Ill-effects from night-watching and loss of sleep, vertigo from motion of carriage or boat.' },
    { abbr: 'Coff.', latin: 'Coffea Cruda', common: 'Unroasted Coffee', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Nervous insomnia from joyful excitement, extreme physical and mental agility, toothache relieved by ice.' },
    { abbr: 'Colch.', latin: 'Colchicum Autumnale', common: 'Meadow Saffron', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Smell of cooking food nauseates to faintness, tearing gouty pains worse slightest motion.' },
    { abbr: 'Coloc.', latin: 'Colocynthis', common: 'Bitter Apple', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Violent abdominal colic compelling bending double with hard pressure, ailments from indignation.' },
    { abbr: 'Con.', latin: 'Conium Maculatum', common: 'Poison Hemlock', thermal: 'Chilly', miasm: 'Syphilis', polychrest: true, keynotes: 'Ascending paralysis, stony hard induration of mammae and glands, vertigo turning head in bed.' },
    { abbr: 'Croc.', latin: 'Crocus Sativus', common: 'Saffron', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Rapid alternating emotional states (laughter to weeping), dark stringy ropey hemorrhages.' },
    { abbr: 'Crot-t.', latin: 'Croton Tiglium', common: 'Croton Oil Seeds', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Yellow watery diarrhea expelled forcibly like a shot from a gun, pain from nipple to back.' },
    { abbr: 'Cycl.', latin: 'Cyclamen Europaeum', common: 'Sowbread', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Flickering before eyes with dizziness, guilt complex as if neglected a duty, aversion to open air.' },
    { abbr: 'Dig.', latin: 'Digitalis Purpurea', common: 'Foxglove', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Slow intermittent irregular pulse, sudden sensation as if heart would cease beating if he moved.' },
    { abbr: 'Dios.', latin: 'Dioscorea Villosa', common: 'Wild Yam', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Violent flatulent colic relieved by standing erect and bending backwards, opposite of Colocynth.' },
    { abbr: 'Dros.', latin: 'Drosera Rotundifolia', common: 'Sundew', thermal: 'Chilly', miasm: 'Tubercular', polychrest: true, keynotes: 'Paroxysmal whooping cough so rapid cannot catch breath, epistaxis, holding sides of chest.' },
    { abbr: 'Dulc.', latin: 'Dulcamara', common: 'Bittersweet', thermal: 'Chilly', miasm: 'Sycosis', polychrest: true, keynotes: 'Complaints brought on by change from warm to cold damp weather, mucous diarrhea, skin eruptions.' },
    { abbr: 'Echin.', latin: 'Echinacea Angustifolia', common: 'Purple Cone-flower', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Septic conditions, foul bites, carbuncles, low fever with lymphatic induration.' },
    { abbr: 'Equis.', latin: 'Equisetum Hyemale', common: 'Horsetail / Scouring Rush', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Severe dull pain and fullness in bladder not relieved by urinating, enuresis in children.' },
    { abbr: 'Erign.', latin: 'Erigeron Canadense', common: 'Fleabane', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Profuse bright red arterial hemorrhages exacerbated by slightest movement, dysuria.' },
    { abbr: 'Eucal.', latin: 'Eucalyptus Globulus', common: 'Blue Gum Tree', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Fetid catarrhal discharges, typhoid septic fevers, profuse purulent expectoration.' },
    { abbr: 'Euon.', latin: 'Euonymus Europaeus', common: 'Spindle Tree', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Bilious headaches, gastric disturbances with liver congestion and obstinate constipation.' },
    { abbr: 'Eup-per.', latin: 'Eupatorium Perfoliatum', common: 'Boneset', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Severe deep aching as if bones were broken, thirst for cold water before and during fever chill.' },
    { abbr: 'Eup-pur.', latin: 'Eupatorium Purpureum', common: 'Gravel Root / Queen of the Meadow', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Vesical irritation with tenesmus and deep aching in kidney region, albuminous urine.' },
    { abbr: 'Euph.', latin: 'Euphorbium Officinarum', common: 'Spurge Resin', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Burning pains as if red hot coals applied to internal parts, erysipelatous inflammation.' },
    { abbr: 'Euphr.', latin: 'Euphrasia Officinalis', common: 'Eyebright', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Profuse acrid burning lachrymation with bland nasal coryza (exact opposite of Allium cepa).' },
    { abbr: 'Fagop.', latin: 'Fagopyrum Esculentum', common: 'Buckwheat', thermal: 'Hot', miasm: 'Psora', polychrest: false, keynotes: 'Violent erythema with itching and scratching until skin is raw, worse scratch and heat.' },
    { abbr: 'Gels.', latin: 'Gelsemium Sempervirens', common: 'Yellow Jessamine', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'The 4 Ds: Drowsy, Dull, Dizzy, Dumb; anticipatory diarrhea, heavy drooping eyelids, motor paralysis.' },
    { abbr: 'Gent-l.', latin: 'Gentiana Lutea', common: 'Yellow Gentian', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Acid dyspepsia, ravenous hunger with empty aching stomach, umbilical colic.' },
    { abbr: 'Glon.', latin: 'Glonoinum', common: 'Nitroglycerine', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Congestive bursting throbbing vascular headache, carotids pound visibly, cannot bear heat of sun.' },
    { abbr: 'Gnaph.', latin: 'Gnaphalium Polycephalum', common: 'Cudweed', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Sciatica characterized by intense pain associated with marked numbness, better sitting in chair.' },
    { abbr: 'Gossyp.', latin: 'Gossypium Herbaceum', common: 'Cotton Plant', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Emmenagogue, morning vomiting of pregnancy with intense prostration and uterine colic.' },
    { abbr: 'Gran.', latin: 'Granatum', common: 'Pomegranate Bark', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Expulsion of tapeworm, umbilical griping pains with salivation and syncope.' },
    { abbr: 'Grat.', latin: 'Gratiola Officinalis', common: 'Hedge Hyssop', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Profuse yellow frothy watery diarrhea expelled with great gushing force, gastro-enteritis.' },
    { abbr: 'Grind.', latin: 'Grindelia Robusta', common: 'Rosin-wood', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Stops breathing the moment he falls asleep; wakes gasping for air, Cheyne-Stokes respiration.' },
    { abbr: 'Guai.', latin: 'Guaiacum Officinale', common: 'Resin of Lignum Vitae', thermal: 'Hot', miasm: 'Syphilis', polychrest: false, keynotes: 'Arthritic deformities with contraction of tendons, excruciating throat angina, foul excretions.' },
    { abbr: 'Ham.', latin: 'Hamamelis Virginiana', common: 'Witch Hazel', thermal: 'Hot', miasm: 'Psora', polychrest: true, keynotes: 'Venous congestion with passive dark hemorrhages, varicose veins exquisitely tender to touch.' },
    { abbr: 'Hell.', latin: 'Helleborus Niger', common: 'Christmas Rose', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Sensory stupor from hydrocephalus, rolling head side to side, drilling fingers into nostrils.' },
    { abbr: 'Helon.', latin: 'Helonias Dioica', common: 'Unicorn Root', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Consciousness of the womb (feels every movement of uterus), profound mental melancholy.' },
    { abbr: 'Hydr.', latin: 'Hydrastis Canadensis', common: 'Golden Seal', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Thick yellow tenacious ropy secretions, empty sinking faintness at epigastrium, cancer cachexia.' },
    { abbr: 'Hyos.', latin: 'Hyoscyamus Niger', common: 'Henbane', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Suspicious jealousy, shameless erotomania, uncovers body, picks at bedclothes, spasmodic cough.' },
    { abbr: 'Hyper.', latin: 'Hypericum Perforatum', common: 'St. John’s Wort', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Arnica of the nerves; crushed terminal nerve endings (fingertips, coccyx), shooting ascending pains.' },
    { abbr: 'Iber.', latin: 'Iberis Amara', common: 'Bitter Candytuft', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Cardiac hypertrophy with tachyarrhythmia, fullness in throat and conscious action of heart.' },
    { abbr: 'Ign.', latin: 'Ignatia Amara', common: 'St. Ignatius Bean', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Paradoxical symptoms, silent grief, deep involuntary sighing, globus hystericus, spasms.' },
    { abbr: 'Ip.', latin: 'Ipecacuanha', common: 'Ipecac Root', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Persistent unrelieved nausea with clean tongue, bright red gushing hemorrhages, chest rales.' },
    { abbr: 'Iris', latin: 'Iris Versicolor', common: 'Blue Flag', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Periodic sick headaches with visual blurring, intense burning of whole digestive tract, sour vomiting.' },
    { abbr: 'Jatr.', latin: 'Jatropha Curcas', common: 'Purging Nut', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Choleraic diarrhea with sudden copious gushing, violent rumbling like water poured from a bung.' },
    { abbr: 'Jug-c.', latin: 'Juglans Cinerea', common: 'Butternut', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Hepatic congestion with occipital headache, retrosternal pain, vesicular pustular eruptions.' },
    { abbr: 'Kalm.', latin: 'Kalmia Latifolia', common: 'Mountain Laurel', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Rheumatic neuralgias shooting downwards, pains rapidly shift to heart with slow pulse.' },
    { abbr: 'Kreas.', latin: 'Kreosotum Plantarum', common: 'Plant Wood Creosote', thermal: 'Chilly', miasm: 'Syphilis', polychrest: false, keynotes: 'Corrosive acrid vaginal leucorrhea with excoriation, chronic ulcerations.' },
    { abbr: 'Lact-v.', latin: 'Lactuca Virosa', common: 'Wild Lettuce', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Incessant dry hacking tickling nocturnal cough, hydrothorax, profound drowsiness.' },
    { abbr: 'Lappa', latin: 'Lappa Arctium', common: 'Burdock', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Crusta lactea, foul crusty eruptions on head and face with fetid axillary perspiration.' },
    { abbr: 'Laur.', latin: 'Laurocerasus', common: 'Cherry Laurel', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Cyanosis of newborn with gasping respiration, drink rolls audibly down esophagus.' },
    { abbr: 'Led.', latin: 'Ledum Palustre', common: 'Marsh Tea', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Punctured wounds from nails or needles, part feels icy cold to touch yet relieved by cold ice water baths.' },
    { abbr: 'Lept.', latin: 'Leptandra Virginica', common: 'Culver’s Root', thermal: 'Chilly', miasm: 'Psora', polychrest: false, keynotes: 'Profuse tarry black bilious diarrhea, liver engorgement with burning distress.' },
    { abbr: 'Lil-t.', latin: 'Lilium Tigrinum', common: 'Tiger Lily', thermal: 'Hot', miasm: 'Sycosis', polychrest: true, keynotes: 'Bearing down in pelvis as if organs would escape through vulva, must support with hand, hurried.' },
    { abbr: 'Lob.', latin: 'Lobelia Inflata', common: 'Indian Tobacco', thermal: 'Chilly', miasm: 'Psora', polychrest: true, keynotes: 'Nausea with copious salivation and cold sweat, dyspnea relieved by walking rapidly.' }
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

  // 2. Systematic Botanical Genera Expansions (A to L)
  const generaA_L: Array<{
    genus: string;
    prefix: string;
    family: string;
    thermal: ThermalState;
    miasm: MiasmType;
    species: string[];
  }> = [
    { genus: 'Acacia', prefix: 'Acac-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Psora', species: ['arabica', 'catechu', 'farnesiana', 'senegal'] },
    { genus: 'Acer', prefix: 'Acer-', family: 'Sapindaceae', thermal: 'Chilly', miasm: 'Psora', species: ['campestre', 'negundo', 'rubrum', 'saccharum'] },
    { genus: 'Achillea', prefix: 'Achil-', family: 'Compositae', thermal: 'Hot', miasm: 'Psora', species: ['millefolium', 'moschata', 'nobilis', 'ptarmica'] },
    { genus: 'Agave', prefix: 'Agav-', family: 'Agavaceae', thermal: 'Hot', miasm: 'Sycosis', species: ['americana', 'tequilana', 'virginica'] },
    { genus: 'Agrimonia', prefix: 'Agrim-', family: 'Rosaceae', thermal: 'Chilly', miasm: 'Psora', species: ['eupatoria', 'odorata', 'parviflora', 'striata'] },
    { genus: 'Alnus', prefix: 'Alnus-', family: 'Betulaceae', thermal: 'Chilly', miasm: 'Psora', species: ['glutinosa', 'incana', 'rubra', 'serrulata'] },
    { genus: 'Ampelopsis', prefix: 'Ampel-', family: 'Vitaceae', thermal: 'Chilly', miasm: 'Psora', species: ['cordata', 'quinquefolia', 'tricuspidata'] },
    { genus: 'Angelica', prefix: 'Angel-', family: 'Umbelliferae', thermal: 'Chilly', miasm: 'Psora', species: ['archangelica', 'atropurpurea', 'sinensis', 'sylvestris'] },
    { genus: 'Anthemis', prefix: 'Anth-', family: 'Compositae', thermal: 'Hot', miasm: 'Psora', species: ['arvensis', 'cotula', 'nobilis', 'tinctoria'] },
    { genus: 'Aquilegia', prefix: 'Aquil-', family: 'Ranunculaceae', thermal: 'Chilly', miasm: 'Psora', species: ['canadensis', 'chrysantha', 'formosa', 'vulgaris'] },
    { genus: 'Arctium', prefix: 'Arct-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['lappa', 'minus', 'nemorosum', 'tomentosum'] },
    { genus: 'Artemisia', prefix: 'Artem-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['abrotanum', 'absinthium', 'dracunculus', 'vulgaris'] },
    { genus: 'Astragalus', prefix: 'Astrag-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Tubercular', species: ['baeticus', 'glycyphyllos', 'membranaceus', 'mollissimus'] },
    { genus: 'Betula', prefix: 'Bet-', family: 'Betulaceae', thermal: 'Chilly', miasm: 'Psora', species: ['alba', 'lenta', 'nigra', 'pendula'] },
    { genus: 'Brassica', prefix: 'Brass-', family: 'Brassicaceae', thermal: 'Hot', miasm: 'Psora', species: ['campestris', 'napus', 'nigra', 'oleracea'] },
    { genus: 'Bupleurum', prefix: 'Bupl-', family: 'Umbelliferae', thermal: 'Hot', miasm: 'Psora', species: ['falcatum', 'fruticosum', 'rotundifolium'] },
    { genus: 'Campanula', prefix: 'Camp-', family: 'Campanulaceae', thermal: 'Chilly', miasm: 'Psora', species: ['glomerata', 'latifolia', 'rotundifolia', 'trachelium'] },
    { genus: 'Capparis', prefix: 'Capp-', family: 'Capparaceae', thermal: 'Hot', miasm: 'Sycosis', species: ['coriacea', 'decidua', 'spinosa'] },
    { genus: 'Carduus', prefix: 'Card-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['acanthoides', 'crispus', 'marianus', 'nutans'] },
    { genus: 'Carex', prefix: 'Carex-', family: 'Cyperaceae', thermal: 'Chilly', miasm: 'Psora', species: ['arenaria', 'distans', 'pendula', 'vulgaris'] },
    { genus: 'Centaurea', prefix: 'Cent-', family: 'Compositae', thermal: 'Hot', miasm: 'Psora', species: ['calcitrapa', 'cyanus', 'jacea', 'scabiosa'] },
    { genus: 'Cirsium', prefix: 'Cirs-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['arvense', 'eriophorum', 'oleraceum', 'vulgare'] },
    { genus: 'Clematis', prefix: 'Clem-', family: 'Ranunculaceae', thermal: 'Chilly', miasm: 'Sycosis', species: ['flammula', 'integrifolia', 'recta', 'vitalba'] },
    { genus: 'Cornus', prefix: 'Corn-', family: 'Cornaceae', thermal: 'Chilly', miasm: 'Psora', species: ['alternifolia', 'circinata', 'florida', 'sericea'] },
    { genus: 'Crataegus', prefix: 'Crat-', family: 'Rosaceae', thermal: 'Chilly', miasm: 'Psora', species: ['coccinea', 'crus-galli', 'monogyna', 'oxyacantha'] },
    { genus: 'Crotalaria', prefix: 'Crotal-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Psora', species: ['alata', 'burhia', 'juncea', 'spectabilis'] },
    { genus: 'Cucumis', prefix: 'Cucum-', family: 'Cucurbitaceae', thermal: 'Chilly', miasm: 'Psora', species: ['melo', 'myriocarpus', 'sativus', 'trigonus'] },
    { genus: 'Cynoglossum', prefix: 'Cynog-', family: 'Boraginaceae', thermal: 'Chilly', miasm: 'Psora', species: ['cheirifolium', 'creticum', 'officinale'] },
    { genus: 'Datura', prefix: 'Dat-', family: 'Solanaceae', thermal: 'Chilly', miasm: 'Psora', species: ['arborea', 'ferox', 'metel', 'stramonium'] },
    { genus: 'Delphinium', prefix: 'Delph-', family: 'Ranunculaceae', thermal: 'Chilly', miasm: 'Psora', species: ['consolida', 'elatum', 'staphisagria'] },
    { genus: 'Dianthus', prefix: 'Dianth-', family: 'Caryophyllaceae', thermal: 'Chilly', miasm: 'Psora', species: ['armeria', 'caryophyllus', 'deltoides', 'superbus'] },
    { genus: 'Dioscorea', prefix: 'Diosc-', family: 'Dioscoreaceae', thermal: 'Chilly', miasm: 'Psora', species: ['alata', 'batatas', 'bulbifera', 'villosa'] },
    { genus: 'Echinops', prefix: 'Echin-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['ritro', 'sphaerocephalus', 'spinosus'] },
    { genus: 'Epilobium', prefix: 'Epil-', family: 'Onagraceae', thermal: 'Chilly', miasm: 'Psora', species: ['angustifolium', 'hirsutum', 'parviflorum'] },
    { genus: 'Erica', prefix: 'Erica-', family: 'Ericaceae', thermal: 'Chilly', miasm: 'Psora', species: ['carnea', 'cinerea', 'tetralix', 'vulgaris'] },
    { genus: 'Eryngium', prefix: 'Eryng-', family: 'Umbelliferae', thermal: 'Chilly', miasm: 'Psora', species: ['aquaticum', 'campestre', 'maritimum', 'planum'] },
    { genus: 'Eucalyptus', prefix: 'Euc-', family: 'Myrtaceae', thermal: 'Chilly', miasm: 'Psora', species: ['amygdalina', 'globulus', 'polyanthemos', 'rostrata'] },
    { genus: 'Euphorbia', prefix: 'Euphorb-', family: 'Euphorbiaceae', thermal: 'Chilly', miasm: 'Psora', species: ['amygdaloides', 'corollata', 'cyparissias', 'lathyris', 'peplus'] },
    { genus: 'Festuca', prefix: 'Fest-', family: 'Poaceae', thermal: 'Chilly', miasm: 'Psora', species: ['arundinacea', 'gigantea', 'ovina', 'pratensis'] },
    { genus: 'Ficus', prefix: 'Ficus-', family: 'Moraceae', thermal: 'Chilly', miasm: 'Psora', species: ['benghalensis', 'carica', 'elastica', 'indica', 'religiosa'] },
    { genus: 'Fraxinus', prefix: 'Frax-', family: 'Oleaceae', thermal: 'Chilly', miasm: 'Psora', species: ['americana', 'excelsior', 'ornus', 'quadrangulata'] },
    { genus: 'Galium', prefix: 'Gal-', family: 'Rubiaceae', thermal: 'Chilly', miasm: 'Psora', species: ['aparine', 'mollugo', 'odoratum', 'verum'] },
    { genus: 'Geranium', prefix: 'Geran-', family: 'Geraniaceae', thermal: 'Chilly', miasm: 'Psora', species: ['dissectum', 'maculatum', 'pratense', 'robertianum'] },
    { genus: 'Hedera', prefix: 'Hed-', family: 'Araliaceae', thermal: 'Chilly', miasm: 'Psora', species: ['canariensis', 'colchica', 'helix', 'hibernica'] },
    { genus: 'Helianthus', prefix: 'Helian-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['annuus', 'decapetalus', 'strumosus', 'tuberosus'] },
    { genus: 'Hieracium', prefix: 'Hier-', family: 'Compositae', thermal: 'Chilly', miasm: 'Psora', species: ['aurantiacum', 'murorum', 'pilosella', 'vulgatum'] },
    { genus: 'Hypericum', prefix: 'Hyp-', family: 'Hypericaceae', thermal: 'Chilly', miasm: 'Psora', species: ['androsaemum', 'calycinum', 'hirsutum', 'perforatum'] },
    { genus: 'Inula', prefix: 'Inula-', family: 'Compositae', thermal: 'Chilly', miasm: 'Tubercular', species: ['britannica', 'conyza', 'helenium', 'salicina'] },
    { genus: 'Iris', prefix: 'Iris-', family: 'Iridaceae', thermal: 'Chilly', miasm: 'Psora', species: ['florentina', 'foetidissima', 'germanica', 'pseudacorus', 'tenax', 'versicolor'] },
    { genus: 'Jasminum', prefix: 'Jasm-', family: 'Oleaceae', thermal: 'Chilly', miasm: 'Psora', species: ['fruticans', 'grandiflorum', 'officinale', 'sambac'] },
    { genus: 'Juglans', prefix: 'Jugl-', family: 'Juglandaceae', thermal: 'Chilly', miasm: 'Psora', species: ['cinerea', 'nigra', 'regia'] },
    { genus: 'Juniperus', prefix: 'Junip-', family: 'Cupressaceae', thermal: 'Chilly', miasm: 'Psora', species: ['communis', 'oxycedrus', 'sabina', 'virginiana'] },
    { genus: 'Lamium', prefix: 'Lam-', family: 'Lamiaceae', thermal: 'Chilly', miasm: 'Psora', species: ['album', 'amplexicaule', 'galeobdolon', 'maculatum', 'purpureum'] },
    { genus: 'Lathyrus', prefix: 'Lath-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Psora', species: ['aphaca', 'cicera', 'odoratus', 'pratensis', 'sativus', 'sylvestris'] },
    { genus: 'Linum', prefix: 'Linum-', family: 'Linaceae', thermal: 'Chilly', miasm: 'Psora', species: ['catharticum', 'flavum', 'perenne', 'usitatissimum'] },
    { genus: 'Lonicera', prefix: 'Lonic-', family: 'Caprifoliaceae', thermal: 'Chilly', miasm: 'Psora', species: ['caprifolium', 'periclymenum', 'tatarica', 'xylosteum'] },
    { genus: 'Lupinus', prefix: 'Lupin-', family: 'Leguminosae', thermal: 'Chilly', miasm: 'Psora', species: ['albus', 'angustifolius', 'luteus', 'perennis', 'polyphyllus'] }
  ];

  for (const g of generaA_L) {
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
        shortKeynotes: `Botanical therapeutic agent belonging to ${g.family}, indicated in gastrointestinal and organ-specific affections.`
      });
    }
  }

  return remedies;
}
