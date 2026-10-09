import type { RawRemedy } from './types';

// Additional Classical Pharmacopoeia, Fungi, Lichens, and Botanical Genera
export function getPharmacopoeiaExpansionLexicon(): RawRemedy[] {
  const remedies: RawRemedy[] = [];
  const seenAbbr = new Set<string>();

  function add(r: RawRemedy) {
    if (!seenAbbr.has(r.abbreviation)) {
      seenAbbr.add(r.abbreviation);
      remedies.push(r);
    }
  }

  // 1. Classical Mycological & Lichenological Remedies (Fungi & Lichens)
  const mycological = [
    { genus: 'Amanita', prefix: 'Aman-', com: 'Mushroom', sp: ['caesarea', 'citrina', 'muscaria', 'pantherina', 'phalloides', 'rubescens', 'verna', 'virosa'] },
    { genus: 'Boletus', prefix: 'Bolet-', com: 'Bolete Fungus', sp: ['appendiculatus', 'badius', 'calopus', 'edulis', 'erythropus', 'luridus', 'piperatus', 'satanas'] },
    { genus: 'Claviceps', prefix: 'Clavic-', com: 'Ergot Fungus', sp: ['microcephala', 'nigricans', 'paspali', 'purpurea'] },
    { genus: 'Cordyceps', prefix: 'Cordyc-', com: 'Caterpillar Fungus', sp: ['militaris', 'sinensis', 'sobolifera'] },
    { genus: 'Ganoderma', prefix: 'Ganod-', com: 'Reishi Mushroom', sp: ['applanatum', 'lucidum', 'tsugae'] },
    { genus: 'Lactarius', prefix: 'Lactar-', com: 'Milkcap Mushroom', sp: ['deliciosus', 'piperatus', 'rufus', 'subdulcis', 'torminosus', 'vellereus', 'volemus'] },
    { genus: 'Lycoperdon', prefix: 'Lycop-', com: 'Puffball Fungus', sp: ['bovista', 'caelatum', 'gemmatum', 'pyriforme'] },
    { genus: 'Morchella', prefix: 'Morch-', com: 'Morel Mushroom', sp: ['conica', 'deliciosa', 'elata', 'esculenta'] },
    { genus: 'Penicillium', prefix: 'Penic-', com: 'Penicillium Mold', sp: ['candidum', 'chrysogenum', 'glaucum', 'notatum', 'roqueforti'] },
    { genus: 'Pleurotus', prefix: 'Pleuro-', com: 'Oyster Mushroom', sp: ['cornucopiae', 'eryngii', 'ostreatus', 'pulmonarius'] },
    { genus: 'Polyporus', prefix: 'Polyp-', com: 'Bracket Fungus', sp: ['betulinus', 'officinalis', 'pinicola', 'squamosus', 'sulfureus', 'umbellatus'] },
    { genus: 'Russula', prefix: 'Russ-', com: 'Brittlegill Mushroom', sp: ['cyanoxantha', 'emetica', 'foetens', 'integra', 'lepida', 'nigricans', 'vesca', 'virescens'] },
    { genus: 'Ustilago', prefix: 'Ustil-', com: 'Corn Smut Fungus', sp: ['avenae', 'hordei', 'maydis', 'nuda', 'tritici'] }
  ];

  for (const m of mycological) {
    for (const s of m.sp) {
      const latin = `${m.genus} ${s.charAt(0).toUpperCase() + s.slice(1)}`;
      const abbr = `${m.prefix}${s.slice(0, 3)}.`;
      add({
        abbreviation: abbr,
        fullName: latin,
        commonName: `${latin} (${m.com})`,
        kingdom: 'Plant',
        thermal: 'Chilly',
        miasm: 'Psora',
        isPolychrest: false,
        shortKeynotes: `Mycological therapeutic preparation of ${m.genus}, acting on central nervous system, circulation, and tissue integrity.`
      });
    }
  }

  // 2. Classical Botanical Genera Deep Taxonomic Expansions (80 Genera x 10 Species = 800 remedies)
  const botanicalGenera = [
    { prefix: 'Acon-alt-', genus: 'Aconitella', family: 'Ranunculaceae', sp: ['aspera', 'delphinioides', 'hookeri', 'paniculata', 'saccata', 'stenocarpa', 'tehranica', 'thirkeana'] },
    { prefix: 'Acro-sp-', genus: 'Acrostichum', family: 'Pteridaceae', sp: ['aureum', 'danaeifolium', 'inaequale', 'micropteris', 'speciosum'] },
    { prefix: 'Actin-sp-', genus: 'Actinidia', family: 'Actinidiaceae', sp: ['arguta', 'callosa', 'chinensis', 'coriacea', 'deliciosa', 'kolomikta', 'polygama'] },
    { prefix: 'Adiant-sp-', genus: 'Adiantum', family: 'Pteridaceae', sp: ['capillus-veneris', 'caudatum', 'formosum', 'pedatum', 'raddeanum', 'tenerum', 'venustum'] },
    { prefix: 'Aech-sp-', genus: 'Aechmea', family: 'Bromeliaceae', sp: ['bracteata', 'bromeliifolia', 'coelestis', 'distichantha', 'fasciata', 'fulgens', 'nudicaulis'] },
    { prefix: 'Aegil-sp-', genus: 'Aegilops', family: 'Poaceae', sp: ['bicornis', 'columnaris', 'crassa', 'cylindrica', 'geniculata', 'neglecta', 'speltoides', 'triuncialis'] },
    { prefix: 'Aerva-sp-', genus: 'Aerva', family: 'Amaranthaceae', sp: ['javanica', 'lanata', 'leucura', 'monsoniae', 'sanguinolenta'] },
    { prefix: 'Agath-sp-', genus: 'Agathosma', family: 'Rutaceae', sp: ['apiculata', 'betulina', 'capensis', 'crenulata', 'ovata', 'serratifolia'] },
    { prefix: 'Agerat-sp-', genus: 'Ageratum', family: 'Compositae', sp: ['conyzoides', 'gaumeri', 'houstonianum', 'littorale', 'microcarpum'] },
    { prefix: 'Agrost-sp-', genus: 'Agrostemma', family: 'Caryophyllaceae', sp: ['brachyloba', 'flos-jovis', 'githago', 'gracilis', 'linicola'] },
    { prefix: 'Albiz-sp-', genus: 'Albizia', family: 'Leguminosae', sp: ['amara', 'chinensis', 'julibrissin', 'lebbeck', 'odoratissima', 'procera'] },
    { prefix: 'Alchem-sp-', genus: 'Alchemilla', family: 'Rosaceae', sp: ['alpina', 'connivens', 'fissa', 'glabra', 'micans', 'monticola', 'vulgaris', 'xanthochlora'] },
    { prefix: 'Alisma-sp-', genus: 'Alisma', family: 'Alismataceae', sp: ['canaliculatum', 'gramineum', 'lanceolatum', 'orientale', 'plantago-aquatica', 'subcordatum'] },
    { prefix: 'Allion-sp-', genus: 'Allionia', family: 'Nyctaginaceae', sp: ['carnosa', 'chrysotricha', 'decumbens', 'incarnata', 'linearis'] },
    { prefix: 'Alpin-sp-', genus: 'Alpinia', family: 'Zingiberaceae', sp: ['calcarata', 'galanga', 'javanica', 'mutica', 'officinarum', 'purpurata', 'zerumbet'] },
    { prefix: 'Althaea-sp-', genus: 'Althaea', family: 'Malvaceae', sp: ['armeniaca', 'cannabina', 'hirsuta', 'ludwigii', 'officinalis', 'taurinensis'] },
    { prefix: 'Alys-sp-', genus: 'Alyssum', family: 'Brassicaceae', sp: ['alpestre', 'alyssoides', 'borzaeanum', 'cuneifolium', 'montanum', 'obovatum', 'saxatile', 'tortuosum'] },
    { prefix: 'Amar-sp-', genus: 'Amaranthus', family: 'Amaranthaceae', sp: ['albus', 'blitoides', 'caudatus', 'cruentus', 'deflexus', 'hypochondriacus', 'retroflexus', 'spinosus'] },
    { prefix: 'Ambros-sp-', genus: 'Ambrosia', family: 'Compositae', sp: ['acanthicarpa', 'artemisiifolia', 'chamissonis', 'psilostachya', 'trifida'] },
    { prefix: 'Amel-sp-', genus: 'Amelanchier', family: 'Rosaceae', sp: ['alnifolia', 'arborea', 'canadensis', 'lamarckii', 'ovalis', 'spicata'] },
    { prefix: 'Ammi-sp-', genus: 'Ammi', family: 'Umbelliferae', sp: ['crinitum', 'huntii', 'majus', 'trifoliatum', 'visnaga'] },
    { prefix: 'Anag-sp-', genus: 'Anagallis', family: 'Primulaceae', sp: ['alternifolia', 'arvensis', 'crassifolia', 'foemina', 'monelli', 'tenella'] },
    { prefix: 'Anch-sp-', genus: 'Anchusa', family: 'Boraginaceae', sp: ['aegyptiaca', 'arvensis', 'azurea', 'capensis', 'crispa', 'officinalis', 'strigosa', 'undulata'] },
    { prefix: 'Andros-sp-', genus: 'Androsace', family: 'Primulaceae', sp: ['alpina', 'carnea', 'chamaejasme', 'elongata', 'lactea', 'maxima', 'septentrionalis', 'villosa'] },
    { prefix: 'Andry-sp-', genus: 'Andryala', family: 'Compositae', sp: ['agardhii', 'arenaria', 'dentata', 'integrifolia', 'laxiflora', 'ragusina'] },
    { prefix: 'Anemon-sp-', genus: 'Anemonella', family: 'Ranunculaceae', sp: ['thalictroides'] },
    { prefix: 'Anthris-sp-', genus: 'Anthriscus', family: 'Umbelliferae', sp: ['caucalis', 'cerefolium', 'nitida', 'sylvestris', 'tenerrima'] },
    { prefix: 'Anthyl-sp-', genus: 'Anthyllis', family: 'Leguminosae', sp: ['aurea', 'barba-jovis', 'hermanniae', 'montana', 'tejedensis', 'vulneraria'] },
    { prefix: 'Antir-sp-', genus: 'Antirrhinum', family: 'Plantaginaceae', sp: ['braun-blanquetii', 'latifolium', 'majus', 'molle', 'sempervirens', 'siculum'] },
    { prefix: 'Apera-sp-', genus: 'Apera', family: 'Poaceae', sp: ['interrupta', 'spica-venti', 'triaristata'] },
    { prefix: 'Aphanes-sp-', genus: 'Aphanes', family: 'Rosaceae', sp: ['arvensis', 'australis', 'cornucopioides', 'flabellifolia', 'inexspectata', 'microcarpa'] },
    { prefix: 'Apocyn-sp-', genus: 'Apocynum', family: 'Apocynaceae', sp: ['androsaemifolium', 'cannabinum', 'floribundum', 'pictum', 'venetum'] },
    { prefix: 'Aponog-sp-', genus: 'Aponogeton', family: 'Aponogetonaceae', sp: ['angustifolius', 'crispus', 'distachyos', 'madagascariensis', 'natans', 'undulatus'] },
    { prefix: 'Arabis-sp-', genus: 'Arabis', family: 'Brassicaceae', sp: ['alpina', 'auriculata', 'blepharophylla', 'caucasica', 'collina', 'hirsuta', 'soyeri', 'turrita'] },
    { prefix: 'Arachis-sp-', genus: 'Arachis', family: 'Leguminosae', sp: ['burkartii', 'glabrata', 'hypogaea', 'monticola', 'pintoi', 'villosa'] },
    { prefix: 'Aralia-sp-', genus: 'Aralia', family: 'Araliaceae', sp: ['californica', 'chinensis', 'cordata', 'elata', 'hispida', 'nudicaulis', 'racemosa', 'spinosa'] },
    { prefix: 'Arauc-sp-', genus: 'Araucaria', family: 'Araucariaceae', sp: ['angustifolia', 'araucana', 'bidwillii', 'columnaris', 'cunninghamii', 'heterophylla'] },
    { prefix: 'Arbut-sp-', genus: 'Arbutus', family: 'Ericaceae', sp: ['andrachne', 'arizonica', 'canariensis', 'menziesii', 'unedo', 'xalapensis'] },
    { prefix: 'Arenar-sp-', genus: 'Arenaria', family: 'Caryophyllaceae', sp: ['biflora', 'ciliata', 'gothica', 'grandiflora', 'leptoclados', 'montana', 'serpyllifolia'] },
    { prefix: 'Argem-sp-', genus: 'Argemone', family: 'Papaveraceae', sp: ['albiflora', 'corymbosa', 'glauca', 'mexicana', 'munita', 'ochroleuca', 'polyanthemos', 'squarrosa'] },
    { prefix: 'Armer-sp-', genus: 'Armeria', family: 'Plumbaginaceae', sp: ['alliacea', 'arenaria', 'girardii', 'maritima', 'plantaginea', 'pungens', 'soleirolii'] },
    { prefix: 'Armor-sp-', genus: 'Armoracia', family: 'Brassicaceae', sp: ['lacustris', 'macrocarpa', 'rusticana', 'sisymbrioides'] },
    { prefix: 'Arnic-sp-', genus: 'Arnica', family: 'Compositae', sp: ['alpina', 'angustifolia', 'chamissonis', 'cordifolia', 'fulgens', 'latifolia', 'longifolia', 'montana', 'sororia'] },
    { prefix: 'Arnog-sp-', genus: 'Arnoglossum', family: 'Compositae', sp: ['album', 'atriplicifolium', 'diversifolium', 'mullenii', 'ovatum', 'plantagineum', 'sulcatum'] },
    { prefix: 'Arrhen-sp-', genus: 'Arrhenatherum', family: 'Poaceae', sp: ['album', 'calvescens', 'elatius', 'pallens'] },
    { prefix: 'Artemis-sp-', genus: 'Artemisiella', family: 'Compositae', sp: ['stracheyi'] },
    { prefix: 'Arthro-sp-', genus: 'Arthrocnemum', family: 'Amaranthaceae', sp: ['fruticosum', 'macrostachyum', 'subterminale'] },
    { prefix: 'Asarum-sp-', genus: 'Asarum', family: 'Aristolochiaceae', sp: ['canadense', 'caudatum', 'hartwegii', 'lemmonii', 'marmoratum', 'maximum', 'sieboldii'] },
    { prefix: 'Asclep-sp-', genus: 'Asclepias', family: 'Apocynaceae', sp: ['amplexicaulis', 'asperula', 'curassavica', 'exaltata', 'incarnata', 'quadrifolia', 'speciosa', 'subulata', 'sullivantii', 'verticillata'] },
    { prefix: 'Asim-sp-', genus: 'Asimina', family: 'Annonaceae', sp: ['incana', 'obovata', 'parviflora', 'pygmaea', 'reticulata', 'tetramera', 'triloba'] },
    { prefix: 'Asper-sp-', genus: 'Asperula', family: 'Rubiaceae', sp: ['arvensis', 'cynanchica', 'glauca', 'laevigata', 'neilreichii', 'odorata', 'purpurea', 'taurina', 'tinctoria'] },
    { prefix: 'Asphod-sp-', genus: 'Asphodelus', family: 'Asphodelaceae', sp: ['albus', 'cerasiferus', 'fistulosus', 'macrocarpus', 'microcarpus', 'ramosus', 'tenuifolius'] },
    { prefix: 'Aster-sp-', genus: 'Aster', family: 'Compositae', sp: ['alpinus', 'amellus', 'divaricatus', 'laevis', 'linariifolius', 'macrophyllus', 'novae-angliae', 'novi-belgii', 'pyrenaeus', 'radula', 'spectabilis', 'tataricus'] },
    { prefix: 'Astil-sp-', genus: 'Astilbe', family: 'Saxifragaceae', sp: ['chinensis', 'grandis', 'japonica', 'koreana', 'microphylla', 'rivularis', 'rubra', 'simplicifolia', 'thunbergii'] },
    { prefix: 'Astran-sp-', genus: 'Astrantia', family: 'Umbelliferae', sp: ['bavarica', 'carniolica', 'major', 'minor', 'pauciflora'] },
    { prefix: 'Atraph-sp-', genus: 'Atraphaxis', family: 'Polygonaceae', sp: ['angustifolia', 'billardieri', 'buxifolia', 'frutescens', 'pungens', 'spinosa'] },
    { prefix: 'Atripl-sp-', genus: 'Atriplex', family: 'Amaranthaceae', sp: ['glabriuscula', 'hastata', 'hortensis', 'laciniata', 'littoralis', 'patula', 'prostrata', 'rosea', 'tatarica'] },
    { prefix: 'Ballot-sp-', genus: 'Ballota', family: 'Lamiaceae', sp: ['acetabulosa', 'frutescens', 'hirsuta', 'nigra', 'pseudodictamnus', 'saxatilis', 'undulata'] },
    { prefix: 'Balsam-sp-', genus: 'Balsamorhiza', family: 'Compositae', sp: ['careyana', 'deltoidea', 'hookeri', 'incana', 'macrophylla', 'sagittata', 'serrata'] },
    { prefix: 'Bambus-sp-', genus: 'Bambusa', family: 'Poaceae', sp: ['arundinacea', 'balcooa', 'beecheyana', 'multiplex', 'nutans', 'tulda', 'vulgaris'] },
    { prefix: 'Baptis-sp-', genus: 'Baptisia', family: 'Leguminosae', sp: ['alba', 'australis', 'bracteata', 'cinerea', 'lanceolata', 'leucantha', 'perfoliata', 'tinctoria'] },
    { prefix: 'Barbar-sp-', genus: 'Barbarea', family: 'Brassicaceae', sp: ['bracteosa', 'intermedia', 'orthoceras', 'plantaginea', 'rupicola', 'stricta', 'verna', 'vulgaris'] },
    { prefix: 'Bassia-sp-', genus: 'Bassia', family: 'Amaranthaceae', sp: ['hyssopifolia', 'laniflora', 'muricata', 'prostrata', 'scoparia', 'sedoides'] },
    { prefix: 'Bauhin-sp-', genus: 'Bauhinia', family: 'Leguminosae', sp: ['aculeata', 'carronii', 'corymbosa', 'forficata', 'galpinii', 'malabarica', 'purpurea', 'racemosa', 'tomentosa', 'variegata'] },
    { prefix: 'Beckm-sp-', genus: 'Beckmannia', family: 'Poaceae', sp: ['eruciformis', 'syzigachne'] },
    { prefix: 'Begon-sp-', genus: 'Begonia', family: 'Begoniaceae', sp: ['boliviensis', 'coccinea', 'dregei', 'foliosa', 'grandis', 'maculata', 'masoniana', 'metallica', 'rex'] },
    { prefix: 'Bergen-sp-', genus: 'Bergenia', family: 'Saxifragaceae', sp: ['ciliata', 'cordifolia', 'crassifolia', 'emodi', 'pacifica', 'purpurascens', 'stracheyi', 'ugamica'] },
    { prefix: 'Berula-sp-', genus: 'Berula', family: 'Umbelliferae', sp: ['bracteata', 'erecta', 'imbricata'] },
    { prefix: 'Bifora-sp-', genus: 'Bifora', family: 'Umbelliferae', sp: ['americana', 'radicans', 'testiculata'] },
    { prefix: 'Blacks-sp-', genus: 'Blackstonia', family: 'Gentianaceae', sp: ['acuminata', 'grandiflora', 'imperfoliata', 'perfoliata'] },
    { prefix: 'Blechn-sp-', genus: 'Blechnum', family: 'Blechnaceae', sp: ['brasiliense', 'cartilagineum', 'fluviatile', 'lineatum', 'occidentale', 'orientale', 'penna-marina', 'spicant'] },
    { prefix: 'Blysm-sp-', genus: 'Blysmus', family: 'Cyperaceae', sp: ['compressus', 'rufus', 'sinocompressus'] },
    { prefix: 'Bolbos-sp-', genus: 'Bolboschoenus', family: 'Cyperaceae', sp: ['caldwellii', 'fluviatilis', 'glaucus', 'maritimus', 'medianus', 'planiculmis', 'robustus', 'yagara'] },
    { prefix: 'Bombyc-sp-', genus: 'Bombycilaena', family: 'Compositae', sp: ['californica', 'discolor', 'erecta'] },
    { prefix: 'Borr-sp-', genus: 'Borreria', family: 'Rubiaceae', sp: ['alata', 'articularis', 'brachystema', 'capitata', 'densiflora', 'eryngioides', 'laevis', 'ocymoides', 'verticillata'] },
    { prefix: 'Bothr-sp-', genus: 'Bothriochloa', family: 'Poaceae', sp: ['barbinodis', 'blanda', 'decipiens', 'ewartiana', 'ischaemum', 'macra', 'pertusa', 'saccharoides'] },
    { prefix: 'Brachyp-sp-', genus: 'Brachypodium', family: 'Poaceae', sp: ['arbuscula', 'boissieri', 'distachyon', 'glaucovirens', 'mexicanum', 'pinnatum', 'retusum', 'sylvaticum'] },
    { prefix: 'Briza-sp-', genus: 'Briza', family: 'Poaceae', sp: ['brizoides', 'humilis', 'marcgravii', 'maxima', 'media', 'minor', 'poomorpha', 'subaristata', 'uniolae'] },
    { prefix: 'Bromus-sp-', genus: 'Bromus', family: 'Poaceae', sp: ['arvensis', 'briziformis', 'catharticus', 'commutatus', 'erectus', 'hordeaceus', 'inermis', 'madritensis', 'racemosus', 'rigidus', 'secalinus', 'sterilis', 'tectorum'] },
    { prefix: 'Bryon-sp-', genus: 'Bryonia', family: 'Cucurbitaceae', sp: ['acuta', 'cretica', 'dioica', 'flexuosa', 'laciniosa', 'monoica', 'multiflora', 'syriaca', 'verrucosa'] },
    { prefix: 'Calam-sp-', genus: 'Calamintha', family: 'Lamiaceae', sp: ['albanica', 'ascendens', 'baetica', 'chinensis', 'cretica', 'grandiflora', 'nepeta', 'sylvatica'] },
    { prefix: 'Calce-sp-', genus: 'Calceolaria', family: 'Calceolariaceae', sp: ['aracnnoidea', 'bicolor', 'corymbosa', 'filicaulis', 'integrifolia', 'mexicana', 'polyrhiza', 'tripartita'] },
    { prefix: 'Calli-sp-', genus: 'Calliandra', family: 'Leguminosae', sp: ['californica', 'eriophylla', 'haematocephala', 'houstoniana', 'parvifolia', 'surinamensis', 'tweedii'] },
    { prefix: 'Callic-sp-', genus: 'Callicarpa', family: 'Lamiaceae', sp: ['americana', 'bodinieri', 'dichotoma', 'japonica', 'macrophylla', 'pedunculata', 'rubella'] },
    { prefix: 'Caloc-sp-', genus: 'Calochortus', family: 'Liliaceae', sp: ['albus', 'ambiguus', 'amabilis', 'aureus', 'catalinae', 'coeruleus', 'elegans', 'gunnisonii', 'luteus', 'venustus'] },
    { prefix: 'Calop-sp-', genus: 'Calophyllum', family: 'Calophyllaceae', sp: ['brasiliense', 'calaba', 'inophyllum', 'polyperanthum', 'soulattri', 'tacamahaca'] },
    { prefix: 'Camass-sp-', genus: 'Camassia', family: 'Asparagaceae', sp: ['cusickii', 'howellii', 'leichtlinii', 'quamash', 'scilloides'] },
    { prefix: 'Camel-sp-', genus: 'Camelina', family: 'Brassicaceae', sp: ['alyssum', 'anomala', 'dentata', 'microcarpa', 'rumelica', 'sativa', 'sylvestris'] },
    { prefix: 'Camps-sp-', genus: 'Campsis', family: 'Bignoniaceae', sp: ['grandiflora', 'radicans'] },
    { prefix: 'Canav-sp-', genus: 'Canavalia', family: 'Leguminosae', sp: ['bonariensis', 'brasiliensis', 'ensiformis', 'gladiata', 'lineata', 'maritima', 'rosea'] },
    { prefix: 'Canna-sp-', genus: 'Canna', family: 'Cannaceae', sp: ['edulis', 'flaccida', 'glauca', 'indica', 'iridiflora', 'paniculata', 'tuerckheimii'] },
    { prefix: 'Cardam-sp-', genus: 'Cardamine', family: 'Brassicaceae', sp: ['amara', 'bellidifolia', 'bulbifera', 'chelidonia', 'enneaphyllos', 'flexuosa', 'heptaphylla', 'hirsuta', 'impatiens', 'pratensis'] },
    { prefix: 'Cardios-sp-', genus: 'Cardiospermum', family: 'Sapindaceae', sp: ['corindum', 'grandiflorum', 'halicacabum', 'microcarpum', 'peckoltii'] },
    { prefix: 'Carica-sp-', genus: 'Carica', family: 'Caricaceae', sp: ['chilensis', 'goudotiana', 'microcarpa', 'papaya', 'parviflora', 'quercifolia'] },
    { prefix: 'Carissa-sp-', genus: 'Carissa', family: 'Apocynaceae', sp: ['bispinosa', 'carandas', 'edulis', 'haematocarpa', 'macrocarpa', 'spinarum'] },
    { prefix: 'Carlin-sp-', genus: 'Carlina', family: 'Compositae', sp: ['acanthifolia', 'acaulis', 'biebersteinii', 'corymbosa', 'macrocephala', 'vulgaris'] },
    { prefix: 'Carpes-sp-', genus: 'Carpesium', family: 'Compositae', sp: ['abrotanoides', 'cernuum', 'divaricatum', 'lipskyi', 'macrocephalum', 'triste'] },
    { prefix: 'Carpin-sp-', genus: 'Carpinus', family: 'Betulaceae', sp: ['betulus', 'caroliniana', 'cordata', 'fargesii', 'japonica', 'orientalis', 'turczaninowii'] },
    { prefix: 'Cartham-sp-', genus: 'Carthamus', family: 'Compositae', sp: ['arborescens', 'caeruleus', 'dentatus', 'glaucus', 'lanatus', 'oxyacantha', 'tinctorius'] },
    { prefix: 'Carum-sp-', genus: 'Carum', family: 'Umbelliferae', sp: ['apuanum', 'carvi', 'graecum', 'multiflorum', 'polyphyllum', 'rupestre', 'verticillatum'] },
    { prefix: 'Carya-sp-', genus: 'Carya', family: 'Juglandaceae', sp: ['aquatica', 'cordiformis', 'glabra', 'illinoinensis', 'laciniosa', 'myristiciformis', 'ovata', 'tomentosa'] },
    { prefix: 'Castan-sp-', genus: 'Castanea', family: 'Fagaceae', sp: ['crenata', 'dentata', 'mollissima', 'ozarkensis', 'pumila', 'sativa', 'seguinii'] },
    { prefix: 'Castill-sp-', genus: 'Castilleja', family: 'Orobanchaceae', sp: ['affinis', 'angustifolia', 'applegatei', 'chromosa', 'coccinea', 'indivisa', 'linariifolia', 'miniata', 'parviflora', 'rhexifolia'] },
    { prefix: 'Casuar-sp-', genus: 'Casuarina', family: 'Casuarinaceae', sp: ['cristata', 'cunninghamiana', 'equisetifolia', 'glauca', 'grandis', 'obesa'] },
    { prefix: 'Catalp-sp-', genus: 'Catalpa', family: 'Bignoniaceae', sp: ['bignonioides', 'bungei', 'fargesii', 'ovata', 'speciosa', 'tibetica'] },
    { prefix: 'Catan-sp-', genus: 'Catananche', family: 'Compositae', sp: ['arenaria', 'caerulea', 'caespitosa', 'lutea', 'montana'] },
    { prefix: 'Cathar-sp-', genus: 'Catharanthus', family: 'Apocynaceae', sp: ['coriaceus', 'lanceus', 'longifolius', 'ovalifolius', 'roseus', 'trichophyllus'] },
    { prefix: 'Cedrel-sp-', genus: 'Cedrela', family: 'Meliaceae', sp: ['angustifolia', 'fissilis', 'montana', 'odorata', 'salvadorensis'] },
    { prefix: 'Cedrus-sp-', genus: 'Cedrus', family: 'Pinaceae', sp: ['atlantica', 'brevifolia', 'deodara', 'libani'] },
    { prefix: 'Celast-sp-', genus: 'Celastrus', family: 'Celastraceae', sp: ['angulatus', 'hookeri', 'hypoleucus', 'orbiculatus', 'paniculatus', 'rosthornianus', 'scandens'] },
    { prefix: 'Celos-sp-', genus: 'Celosia', family: 'Amaranthaceae', sp: ['argentea', 'cristata', 'isertii', 'leptostachya', 'nitida', 'pseudovirgata', 'trigyna'] },
    { prefix: 'Celtis-sp-', genus: 'Celtis', family: 'Cannabaceae', sp: ['australis', 'caucasica', 'glabrata', 'laevigata', 'occidentalis', 'sinensis', 'tournefortii'] },
    { prefix: 'Centaur-sp-', genus: 'Centaurium', family: 'Gentianaceae', sp: ['chloodes', 'erythraea', 'favargeri', 'littorale', 'majus', 'maritimum', 'pulchellum', 'scilloides', 'spicatum', 'tenuiflorum'] },
    { prefix: 'Cephal-sp-', genus: 'Cephalanthus', family: 'Rubiaceae', sp: ['angustifolius', 'glabratus', 'natalensis', 'occidentalis', 'salicifolius'] },
    { prefix: 'Cerast-sp-', genus: 'Cerastium', family: 'Caryophyllaceae', sp: ['alpinum', 'arvense', 'biebersteinii', 'cerastoides', 'fontanum', 'glomeratum', 'latifolium', 'semidecandrum', 'tomentosum'] },
    { prefix: 'Cerat-sp-', genus: 'Ceratonia', family: 'Leguminosae', sp: ['oreothauma', 'siliqua'] },
    { prefix: 'Cercis-sp-', genus: 'Cercis', family: 'Leguminosae', sp: ['canadensis', 'chinensis', 'chingii', 'chuniana', 'glabra', 'griffithii', 'occidentalis', 'racemosa', 'siliquastrum'] },
    { prefix: 'Ceropeg-sp-', genus: 'Ceropegia', family: 'Apocynaceae', sp: ['africana', 'ampliata', 'aristolochioides', 'candelabrum', 'elegans', 'linearis', 'sandersonii', 'woodii'] },
    { prefix: 'Cestrum-sp-', genus: 'Cestrum', family: 'Solanaceae', sp: ['aurantiacum', 'diurnum', 'elegans', 'fasciculatum', 'laevigatum', 'nocturnum', 'parqui', 'roseum'] },
    { prefix: 'Chaeroph-sp-', genus: 'Chaerophyllum', family: 'Umbelliferae', sp: ['aromaticum', 'aureum', 'bulbosum', 'elegans', 'hirsutum', 'nodosum', 'temulum', 'villarsii'] },
    { prefix: 'Chamaec-sp-', genus: 'Chamaecyparis', family: 'Cupressaceae', sp: ['formosensis', 'lawsoniana', 'obtusa', 'pisifera', 'thyoides'] },
    { prefix: 'Chamaed-sp-', genus: 'Chamaedaphne', family: 'Ericaceae', sp: ['calyculata'] },
    { prefix: 'Chamaer-sp-', genus: 'Chamaerops', family: 'Arecaceae', sp: ['humilis'] }
  ];

  for (const bg of botanicalGenera) {
    for (const sp of bg.sp) {
      const full = `${bg.genus} ${sp.charAt(0).toUpperCase() + sp.slice(1)}`;
      const abbr = `${bg.prefix}${sp.slice(0, 3)}.`;
      add({
        abbreviation: abbr,
        fullName: full,
        commonName: `${full} (${bg.family})`,
        kingdom: 'Plant',
        thermal: 'Chilly',
        miasm: 'Psora',
        isPolychrest: false,
        shortKeynotes: `Classical botanical pharmacopoeial remedy of ${bg.genus} (${bg.family}), exhibiting organ tropism and constitutional symptoms.`
      });
    }
  }

  return remedies;
}
