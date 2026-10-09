import type { RemedyRelationshipDefinition } from './types';

// Classical Remedy Relationships Matrix (Boenninghausen, Gibson Miller, Clarke, Allen)
export function getRemedyRelationshipsList(): RemedyRelationshipDefinition[] {
  return [
    // Sulphur relationships
    { primaryAbbr: 'Sulph.', relatedAbbr: 'Calc.', type: 'complement', notes: 'Sulphur is followed well by Calcarea in chronic psoric states.' },
    { primaryAbbr: 'Sulph.', relatedAbbr: 'Lyc.', type: 'complement', notes: 'Lycopodium follows Sulphur in hepatic and flatulent disorders.' },
    { primaryAbbr: 'Sulph.', relatedAbbr: 'Nux-v.', type: 'complement', notes: 'Nux vomica antidotes Sulphur abuse and prepares the system.' },
    { primaryAbbr: 'Sulph.', relatedAbbr: 'Psor.', type: 'complement', notes: 'Psorinum complements Sulphur when chronic skin complaints fail to react.' },
    { primaryAbbr: 'Sulph.', relatedAbbr: 'Acon.', type: 'antidote', notes: 'Aconitum antidotes acute congestions and fever surges of Sulphur.' },
    { primaryAbbr: 'Sulph.', relatedAbbr: 'Camph.', type: 'antidote', notes: 'Camphora antidotes collapse and skin oversensitivity from Sulphur.' },
    // Calcarea relationships
    { primaryAbbr: 'Calc.', relatedAbbr: 'Lyc.', type: 'complement', notes: 'Calcarea is followed well by Lycopodium (Sulphur-Calcarea-Lycopodium triad).' },
    { primaryAbbr: 'Calc.', relatedAbbr: 'Bell.', type: 'complement', notes: 'Belladonna is the acute complement to Calcarea carbonica.' },
    { primaryAbbr: 'Calc.', relatedAbbr: 'Sil.', type: 'complement', notes: 'Silicea follows Calcarea well in suppurations and bone affections.' },
    { primaryAbbr: 'Calc.', relatedAbbr: 'Bry.', type: 'inimical', notes: 'Bryonia should not be given before or immediately after Calcarea carbonica.' },
    { primaryAbbr: 'Calc.', relatedAbbr: 'Nit-ac.', type: 'inimical', notes: 'Nitric acid and Calcarea frequently clash when alternated closely.' },
    { primaryAbbr: 'Calc.', relatedAbbr: 'Camph.', type: 'antidote', notes: 'Camphora antidotes toxic effects of Calcarea.' },
    // Lycopodium relationships
    { primaryAbbr: 'Lyc.', relatedAbbr: 'Sulph.', type: 'complement', notes: 'Lycopodium is followed well by Sulphur, completing the cycle.' },
    { primaryAbbr: 'Lyc.', relatedAbbr: 'Iod.', type: 'complement', notes: 'Iodium complements Lycopodium in glandular indurations and rapid emaciation.' },
    { primaryAbbr: 'Lyc.', relatedAbbr: 'Chel.', type: 'complement', notes: 'Chelidonium acts as acute liver complement to Lycopodium.' },
    { primaryAbbr: 'Lyc.', relatedAbbr: 'Coff.', type: 'inimical', notes: 'Coffea cruda disagrees with Lycopodium in nervous insomnia.' },
    { primaryAbbr: 'Lyc.', relatedAbbr: 'Camph.', type: 'antidote', notes: 'Camphora and Pulsatilla antidote gastric distress of Lycopodium.' },
    // Natrum Muriaticum relationships
    { primaryAbbr: 'Nat-m.', relatedAbbr: 'Sep.', type: 'complement', notes: 'Sepia is the chronic complement to Natrum muriaticum in pelvic and uterine sphere.' },
    { primaryAbbr: 'Nat-m.', relatedAbbr: 'Ign.', type: 'complement', notes: 'Ignatia is the acute complement to Natrum muriaticum in grief ailments.' },
    { primaryAbbr: 'Nat-m.', relatedAbbr: 'Apis', type: 'complement', notes: 'Apis mellifica complements Natrum mur in dropsy and intermittent fever.' },
    { primaryAbbr: 'Nat-m.', relatedAbbr: 'Spir-nit-d.', type: 'antidote', notes: 'Sweet spirits of nitre and Camphor antidote Natrum muriaticum.' },
    // Phosphorus relationships
    { primaryAbbr: 'Phos.', relatedAbbr: 'Ars.', type: 'complement', notes: 'Arsenicum album follows Phosphorus well in deep chest and digestive prostration.' },
    { primaryAbbr: 'Phos.', relatedAbbr: 'All-c.', type: 'complement', notes: 'Allium cepa is the acute coryza complement to Phosphorus.' },
    { primaryAbbr: 'Phos.', relatedAbbr: 'Nux-v.', type: 'inimical', notes: 'Phosphorus and Nux vomica are strictly inimical in paralytic and nervous affections.' },
    { primaryAbbr: 'Phos.', relatedAbbr: 'Caust.', type: 'inimical', notes: 'Causticum and Phosphorus should never follow each other closely.' },
    { primaryAbbr: 'Phos.', relatedAbbr: 'Nux-v.', type: 'antidote', notes: 'Nux vomica antidotes nervous tremulousness of Phosphorus.' },
    // Pulsatilla relationships
    { primaryAbbr: 'Puls.', relatedAbbr: 'Sil.', type: 'complement', notes: 'Silicea is the deep chronic complement to Pulsatilla.' },
    { primaryAbbr: 'Puls.', relatedAbbr: 'Kali-s.', type: 'complement', notes: 'Kali sulfuricum is the chemical analogue and complement to Pulsatilla.' },
    { primaryAbbr: 'Puls.', relatedAbbr: 'Lyc.', type: 'complement', notes: 'Lycopodium follows Pulsatilla well in gastric and urinary stasis.' },
    { primaryAbbr: 'Puls.', relatedAbbr: 'Cham.', type: 'antidote', notes: 'Chamomilla and Coffea antidote extreme emotional tearfulness of Pulsatilla.' },
    // Sepia relationships
    { primaryAbbr: 'Sep.', relatedAbbr: 'Nat-m.', type: 'complement', notes: 'Natrum muriaticum complements Sepia in chronic pelvic bearing down.' },
    { primaryAbbr: 'Sep.', relatedAbbr: 'Phos.', type: 'follows_well', notes: 'Phosphorus follows Sepia well in chronic pulmonary catarrh.' },
    { primaryAbbr: 'Sep.', relatedAbbr: 'Lach.', type: 'inimical', notes: 'Lachesis and Sepia often disagree when given in rapid succession.' },
    { primaryAbbr: 'Sep.', relatedAbbr: 'Acon.', type: 'antidote', notes: 'Aconitum and vegetable acids antidote Sepia.' },
    // Arsenicum relationships
    { primaryAbbr: 'Ars.', relatedAbbr: 'Thuj.', type: 'complement', notes: 'Thuja occidentalis complements Arsenicum in asthmatic and sycotic cachexia.' },
    { primaryAbbr: 'Ars.', relatedAbbr: 'All-s.', type: 'complement', notes: 'Allium sativum complements Arsenicum in dyspepsia and catarrh.' },
    { primaryAbbr: 'Ars.', relatedAbbr: 'Sec.', type: 'collateral', notes: 'Secale cornutum has burning pains like Ars but craves cold, while Ars craves heat.' },
    { primaryAbbr: 'Ars.', relatedAbbr: 'Ip.', type: 'antidote', notes: 'Ipecacuanha and Nux vomica antidote gastric irritation of Arsenicum.' },
    // Lachesis relationships
    { primaryAbbr: 'Lach.', relatedAbbr: 'Lyc.', type: 'complement', notes: 'Lycopodium complements Lachesis in right-sided throat and hepatic transitions.' },
    { primaryAbbr: 'Lach.', relatedAbbr: 'Nit-ac.', type: 'complement', notes: 'Nitric acid complements Lachesis in dark destructive gangrenous ulcerations.' },
    { primaryAbbr: 'Lach.', relatedAbbr: 'Psor.', type: 'inimical', notes: 'Psorinum should not be given immediately after Lachesis.' },
    { primaryAbbr: 'Lach.', relatedAbbr: 'Sep.', type: 'inimical', notes: 'Sepia and Lachesis disagree in climacteric flashes of heat.' },
    { primaryAbbr: 'Lach.', relatedAbbr: 'Cedr.', type: 'antidote', notes: 'Cedron and alcohol antidote snake venom toxic effects.' },
    // Nux Vomica relationships
    { primaryAbbr: 'Nux-v.', relatedAbbr: 'Sulph.', type: 'complement', notes: 'Sulphur follows Nux vomica when digestive and portal stasis persists.' },
    { primaryAbbr: 'Nux-v.', relatedAbbr: 'Sep.', type: 'complement', notes: 'Sepia complements Nux vomica in sedentary female liver and pelvic congestion.' },
    { primaryAbbr: 'Nux-v.', relatedAbbr: 'Zinc.', type: 'inimical', notes: 'Zincum metallicum and Nux vomica should never be alternated.' },
    { primaryAbbr: 'Nux-v.', relatedAbbr: 'Cham.', type: 'antidote', notes: 'Chamomilla antidotes irritability and hypersensitive nerves from Nux vomica.' },
    // Belladonna relationships
    { primaryAbbr: 'Bell.', relatedAbbr: 'Calc.', type: 'complement', notes: 'Calcarea carbonica is the chronic constitutional complement of Belladonna.' },
    { primaryAbbr: 'Bell.', relatedAbbr: 'Hep.', type: 'follows_well', notes: 'Hepar sulphuris follows Belladonna in acute suppurative tonsillitis.' },
    { primaryAbbr: 'Bell.', relatedAbbr: 'Dulc.', type: 'inimical', notes: 'Dulcamara and Belladonna are incompatible in catarrhal fevers.' },
    { primaryAbbr: 'Bell.', relatedAbbr: 'Coff.', type: 'antidote', notes: 'Coffea cruda and Hyoscyamus antidote cerebral delirium of Belladonna.' },
    // Bryonia relationships
    { primaryAbbr: 'Bry.', relatedAbbr: 'Alum.', type: 'complement', notes: 'Alumina is the chronic dry mucous membrane complement to Bryonia.' },
    { primaryAbbr: 'Bry.', relatedAbbr: 'Rhus-t.', type: 'complement', notes: 'Rhus toxicodendron and Bryonia form the classic acute motion-complement pair.' },
    { primaryAbbr: 'Bry.', relatedAbbr: 'Acon.', type: 'antidote', notes: 'Aconitum antidotes early vascular bounding pulse before Bryonia effusion.' },
    // Aconitum relationships
    { primaryAbbr: 'Acon.', relatedAbbr: 'Bry.', type: 'follows_well', notes: 'Bryonia follows Aconitum well in pleurisy, pneumonia, and joint effusion.' },
    { primaryAbbr: 'Acon.', relatedAbbr: 'Spong.', type: 'follows_well', notes: 'Spongia follows Aconitum in acute croup after cold wind exposure.' },
    { primaryAbbr: 'Acon.', relatedAbbr: 'Coff.', type: 'antidote', notes: 'Coffea cruda antidotes acute panic and nervous restlessness of Aconitum.' },
    // Rhus Toxicodendron relationships
    { primaryAbbr: 'Rhus-t.', relatedAbbr: 'Med.', type: 'complement', notes: 'Medorrhinum complements Rhus toxicodendron in sycotic joint stiffness.' },
    { primaryAbbr: 'Rhus-t.', relatedAbbr: 'Calc.', type: 'follows_well', notes: 'Calcarea carbonica follows Rhus tox well after sprains and ligament tears.' },
    { primaryAbbr: 'Rhus-t.', relatedAbbr: 'Apis', type: 'inimical', notes: 'Apis mellifica and Rhus toxicodendron are inimical in erysipelas and urticaria.' },
    { primaryAbbr: 'Rhus-t.', relatedAbbr: 'Anac.', type: 'antidote', notes: 'Anacardium and Bryonia antidote Rhus poisoning.' },
    // Silicea relationships
    { primaryAbbr: 'Sil.', relatedAbbr: 'Thuj.', type: 'complement', notes: 'Thuja occidentalis complements Silicea in post-vaccinial and sycotic affections.' },
    { primaryAbbr: 'Sil.', relatedAbbr: 'Fl-ac.', type: 'complement', notes: 'Fluoric acid complements and antidotes chronic excessive action of Silicea.' },
    { primaryAbbr: 'Sil.', relatedAbbr: 'Merc.', type: 'inimical', notes: 'Mercurius and Silicea should not follow each other in suppurating cavities.' },
    { primaryAbbr: 'Sil.', relatedAbbr: 'Camph.', type: 'antidote', notes: 'Camphora and Hepar sulphuris antidote excessive action of Silicea.' },
    // Thuja relationships
    { primaryAbbr: 'Thuj.', relatedAbbr: 'Med.', type: 'complement', notes: 'Medorrhinum is the nosode complement to Thuja in stubborn sycotic condylomata.' },
    { primaryAbbr: 'Thuj.', relatedAbbr: 'Nat-s.', type: 'complement', notes: 'Natrum sulfuricum complements Thuja in hydrogenoid damp asthma.' },
    { primaryAbbr: 'Thuj.', relatedAbbr: 'Cham.', type: 'antidote', notes: 'Chamomilla and Pulsatilla antidote gastric distress of Thuja.' },
    // Nosode Relationships
    { primaryAbbr: 'Med.', relatedAbbr: 'Thuj.', type: 'follows_well', notes: 'Thuja follows Medorrhinum well to clear sycotic diathesis.' },
    { primaryAbbr: 'Syph.', relatedAbbr: 'Aur.', type: 'complement', notes: 'Aurum metallicum complements Syphilinum in destructive bone ulcerations.' },
    { primaryAbbr: 'Tub.', relatedAbbr: 'Calc-p.', type: 'complement', notes: 'Calcarea phosphorica is the deep nutritional complement to Tuberculinum.' },
    { primaryAbbr: 'Tub.', relatedAbbr: 'Psor.', type: 'follows_well', notes: 'Psorinum follows Tuberculinum in persistent cold susceptibility.' },
    { primaryAbbr: 'Carb-v.', relatedAbbr: 'Kali-c.', type: 'complement', notes: 'Kali carbonicum is the complementary chronic to Carbo vegetabilis.' },
    { primaryAbbr: 'Carb-v.', relatedAbbr: 'Camph.', type: 'antidote', notes: 'Camphora antidotes collapse and prostration of Carbo vegetabilis.' }
  ];
}
