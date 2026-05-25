import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const MACHINES = [
  {
    id: "brodeuse",
    name: "Brodeuse Numérique",
    brand: "Brother PR670E",
    category: "Textile",
    icon: "✿",
    color: "#E91E8C",
    description: "Brodeuse 6 aiguilles à changement automatique de fil. Permet de broder des motifs complexes multicolores sur textile jusqu'à 200×300 mm.",
    manual: [
      { step: 1, title: "Mise sous tension et initialisation", content: "Appuyer sur le bouton d'alimentation. La machine effectue une initialisation automatique : ne pas toucher aux aiguilles pendant cette phase. L'écran tactile s'allume et affiche le menu principal." },
      { step: 2, title: "Chargement du motif", content: "Brancher la clé USB contenant votre fichier .PES ou .DST. Sur l'écran tactile, appuyer sur 'USB' puis sélectionner votre motif. Vérifier l'aperçu et les couleurs associées à chaque aiguille." },
      { step: 3, title: "Montage des fils", content: "Enfiler chacune des 6 aiguilles selon le nuancier affiché à l'écran. Suivre le chemin de fil numéroté indiqué sur la machine. Utiliser le guide-fil magnétique fourni pour les passages difficiles." },
      { step: 4, title: "Montage du tissu dans le tambour", content: "Choisir le tambour adapté à la taille du motif. Placer le stabilisateur (entoilage) sous le tissu. Tendre le tissu dans le tambour sans déformer les mailles. Fixer le tambour sur la tête de broderie." },
      { step: 5, title: "Test de position et lancement", content: "Appuyer sur 'Trace' pour vérifier que le motif ne dépasse pas du tambour. Fermer le capot de protection. Appuyer sur le bouton START/STOP vert pour lancer la broderie. La machine s'arrête automatiquement à chaque changement de couleur." },
      { step: 6, title: "Finition", content: "Une fois terminé, couper les fils de liaison visibles à l'envers du tissu. Retirer l'entoilage délicatement. Ne pas tirer sur les fils de broderie." },
    ],
    safetyNotes: ["Ne jamais mettre les doigts sous les aiguilles en fonctionnement", "Toujours fermer le capot avant de lancer", "Éteindre la machine avant de changer un fil cassé"],
  },
  {
    id: "laser",
    name: "Découpe Laser CO2",
    brand: "Trotec Speedy 300",
    category: "Découpe",
    icon: "◈",
    color: "#E63946",
    description: "Laser CO2 80W pour gravure et découpe de bois, acrylique, cuir, carton, papier et métal anodisé. Zone de travail 726×432 mm, épaisseur max ~10 mm. Logiciel Trotec Ruby.",
    manual: [
      { step: 1, title: "Allumage et initialisation", content: "Vérifiez que le plateau est vide et propre. Allumez la machine via l'interrupteur situé à l'arrière, en haut à gauche. Attendez que le plateau descende et que la tête se positionne en haut à gauche : la machine émet un BIP quand elle est prête à l'emploi." },
      { step: 2, title: "Mise au point (calibrage)", content: "Placez votre matériau bien à plat sur le plateau (pour le PMMA, utilisez des cales pour éviter le contact direct). Déplacez la tête de découpe au centre de la plaque via le panneau de contrôle. Accrochez le petit outil de calibrage sur la rainure de la tête. Remontez doucement le plateau avec les flèches jusqu'à ce que l'outil tombe : la machine est réglée." },
      { step: 3, title: "Préparation du fichier dans Ruby", content: "Ouvrez le logiciel Trotec Ruby. Vérifiez que le voyant d'état est vert (machine connectée). Dans l'onglet Modèle, importez votre fichier SVG, DXF, AI ou PDF en mode couleur RVB. Vérifiez les couleurs : Rouge (255,0,0) = découpe, Noir (0,0,0) = gravure, Bleu (0,0,255) = marquage. Cliquez sur 'Créer la tâche'." },
      { step: 4, title: "Positionnement et paramètres matière", content: "Dans l'onglet Préparer, utilisez 'Aimanter le dessin' pour aligner le travail sur la position réelle de la tête de découpe. Vérifiez que le dessin ne dépasse pas de la plaque. Sélectionnez le matériau exact (ex : MDF 3mm, PMMA 5mm, CP 8mm) pour appliquer automatiquement la puissance et la vitesse adaptées. Calculez le temps avec 'Chrono', puis cliquez sur 'Envoyer au laser'." },
      { step: 5, title: "Lancement — présence obligatoire", content: "Allumez l'aspiration (bouton ON/OFF à droite de la machine) — obligatoire pour évacuer fumées et poussières. Appuyez sur le bouton Démarrer dans l'onglet Production de Ruby. RESTEZ À PROXIMITÉ pendant toute l'opération. En cas de départ de feu : utilisez la couverture anti-feu (en face de la machine) pour les petits feux, l'extincteur CO² (à l'entrée de la pièce) pour les feux plus importants." },
      { step: 6, title: "Fin de session et nettoyage", content: "Éteignez l'aspiration. Triez les chutes : jetez les petits déchets inutilisables, placez les chutes exploitables dans le rack dédié. Aspirez les résidus sur le plateau pour éviter tout risque d'inflammation lors d'une session suivante. Fermez vos fichiers sur Ruby, retirez votre clé USB, puis éteignez la Trotec Speedy 300." },
    ],
    safetyNotes: [
      "Présence obligatoire pendant toute l'opération",
      "Aspiration TOUJOURS allumée avant de lancer — évacuation fumées obligatoire",
      "Matériaux INTERDITS : PVC, ABS >1mm, PC >1mm, HDPE, MDF Valchromat, fibre de verre, fibre de carbone",
      "Ne jamais nettoyer soi-même la lentille ou les miroirs — contacter le Fabmanager",
      "Couverture anti-feu en face de la machine · Extincteur CO² à l'entrée de la pièce",
    ],
  },
  {
    id: "sublimation",
    name: "Imprimante Sublimation",
    brand: "Epson SC-F500",
    category: "Impression",
    icon: "▣",
    color: "#1E88E5",
    description: "Imprimante à sublimation thermique grand format (A3+). Impression sur papier transfert pour textiles polyester, mugs, plaques et objets sublimables.",
    manual: [
      { step: 1, title: "Vérification des encres et du papier", content: "Vérifier les niveaux d'encre de sublimation sur l'écran de la machine (4 cartouches : CMJN). Charger le papier transfert face d'impression vers le haut dans le bac. Utiliser uniquement le papier sublimation dédié." },
      { step: 2, title: "Préparation du fichier", content: "Le fichier doit être en mode couleur RVB, résolution 150 à 300 dpi. IMPORTANT : activer la symétrie horizontale (miroir) dans le logiciel avant d'imprimer, sinon le motif sera inversé sur le support final." },
      { step: 3, title: "Paramétrage du pilote d'impression", content: "Dans le pilote Epson, sélectionner 'Papier Sublimation' comme type de support. Choisir le format A3+ si nécessaire. Ne pas modifier le profil couleur ICC fourni avec la machine." },
      { step: 4, title: "Impression du transfert", content: "Lancer l'impression. Récupérer le papier sans le toucher sur la face imprimée (risque de baver). Laisser sécher 2 minutes à l'air libre avant utilisation." },
      { step: 5, title: "Transfert sur le support (avec la presse TC7)", content: "Placer le papier face imprimée contre le support polyester. Fixer avec du papier thermique résistant. Lancer le cycle de presse selon les paramètres du support (voir fiche presse). La sublimation s'effectue entre 180 et 210°C." },
    ],
    safetyNotes: ["Imprimer toujours en mode miroir pour les transferts", "Ne toucher la face imprimée qu'une fois sèche", "Compatible uniquement avec supports polyester ou revêtement sublimable"],
  },
  {
    id: "printer3d",
    name: "Imprimante 3D FDM",
    brand: "Anycubic Kobra 2 Max",
    category: "Fabrication",
    icon: "⬡",
    color: "#FF6B35",
    description: "Imprimante FDM grand volume (420×420×500 mm), vitesse jusqu'à 500 mm/s. Nivelage automatique LeviQ 2.0. Compatible PLA, PETG, TPU.",
    manual: [
      { step: 1, title: "Démarrage et nivelage automatique", content: "Allumer la machine via l'interrupteur arrière. Sur l'écran tactile, aller dans 'Préparer > Auto-niveler'. La machine palpe 25 points du plateau. Ne pas interrompre ce cycle. Le résultat est sauvegardé automatiquement." },
      { step: 2, title: "Chargement du filament", content: "Chauffer la buse via 'Préparer > Préchauffer PLA' (200°C). Une fois à température, insérer le filament dans l'extrudeur Bowden jusqu'à sentir une résistance. Appuyer sur 'Charger filament' dans le menu et maintenir jusqu'à ce que le filament sorte de la buse uniformément." },
      { step: 3, title: "Transfert du fichier .gcode", content: "Préparer le fichier avec Cura (profil Kobra 2 Max disponible sur l'ordinateur du fablab). Exporter en .gcode sur carte SD ou clé USB. Insérer dans la machine et sélectionner 'Imprimer depuis SD'." },
      { step: 4, title: "Surveillance du démarrage", content: "Observer les 2 à 3 premières couches. Le filament doit adhérer proprement, sans se décoller ni former de boules. En cas de problème d'adhérence : arrêter, relancer un auto-niveler, vérifier la hauteur de buse (Z-offset)." },
      { step: 5, title: "Fin d'impression et récupération", content: "Attendre que le plateau refroidisse à moins de 40°C avant de retirer la pièce. Faire légèrement fléchir le plateau magnétique pour décoller la pièce sans forcer. Ne jamais gratter avec un outil métallique tranchant." },
    ],
    safetyNotes: ["Ne jamais toucher la buse (jusqu'à 260°C)", "Ventiler la pièce — vapeurs de PLA/PETG", "Ne pas laisser seul lors du premier démarrage d'un nouveau fichier"],
  },
  {
    id: "presse",
    name: "Presse à Chaud",
    brand: "Secabo TC7 Smart",
    category: "Impression",
    icon: "▦",
    color: "#F4A261",
    description: "Presse thermique numérique 38×38 cm avec connexion Bluetooth. Transfert sur textile, sublimation, flex thermocollant. Température jusqu'à 230°C.",
    manual: [
      { step: 1, title: "Mise en chauffe", content: "Allumer la presse via le bouton principal. Régler la température cible selon le support (voir tableau des paramètres affiché sur la machine). Attendre le signal sonore de stabilisation — ne jamais commencer avant." },
      { step: 2, title: "Réglage de la pression", content: "Ajuster la vis de pression en haut de la presse. Pour les textiles : pression moyenne. Pour les plaques rigides : pression légère. La platine doit être parallèle au plateau — vérifier visuellement." },
      { step: 3, title: "Préparation du support", content: "Préchauffer le textile 5 secondes à sec pour éliminer l'humidité (évite les bulles). Positionner le support sur le plateau. Placer le transfert (papier sublimation ou flex) face active vers le bas, centré sur le support." },
      { step: 4, title: "Cycle de presse", content: "Fermer la presse avec une pression ferme et constante. Le minuteur démarre automatiquement. Ne pas ouvrir avant la fin du cycle. À la fin du signal, ouvrir rapidement et retirer le papier de transfert selon la méthode indiquée (chaud ou froid selon le type de transfert)." },
      { step: 5, title: "Refroidissement et contrôle", content: "Laisser refroidir la pièce à plat. Vérifier la qualité du transfert : couleurs vives et uniformes, pas de bords flous. En cas de défaut, noter les paramètres utilisés pour ajustement." },
    ],
    safetyNotes: ["Platine à 200°C+ — ne jamais toucher sans gants", "Ne pas laisser en chauffe sans surveillance prolongée", "Retirer le transfert rapidement à l'ouverture pour éviter la condensation"],
  },
  {
    id: "camera-vr",
    name: "Caméra VR 180° & 360°",
    brand: "Insta Pro 2 + Lenovo Mirage 180",
    category: "Numérique",
    icon: "◉",
    color: "#9C27B0",
    description: "Kit double : Lenovo Mirage 180 (4K, 180° panoramique, diffusion live) et Insta Pro 2 (8K 3D VR, 360°, 6 capteurs). Création de contenus immersifs pour casques de réalité virtuelle.",
    manual: [
      { step: 1, title: "Vérification et chargement", content: "Vérifier que les batteries sont chargées. Insérer une carte SD classe 10 minimum. Pour l'Insta Pro 2, vérifier que les 6 objectifs sont propres et non rayés." },
      { step: 2, title: "Configuration", content: "Allumer la caméra et sélectionner le mode (photo, vidéo ou livestream). Pour l'Insta Pro 2, connecter via Wi-Fi à l'application Insta360 Pro sur tablette pour les réglages avancés (résolution, framerate, mode HDR)." },
      { step: 3, title: "Prise de vue", content: "Monter la caméra sur trépied. Pour le 180° (Lenovo), s'assurer que les sujets sont dans le champ. Pour le 360° (Insta Pro 2), s'éloigner ou se cacher derrière un élément : vous êtes dans le champ à 360°." },
      { step: 4, title: "Transfert et assemblage", content: "Transférer les fichiers via Wi-Fi ou carte SD. Pour le 360°, ouvrir Insta360 Stitcher sur l'ordinateur dédié pour assembler les 6 images en une sphère. Exporter en MP4 ou JPEG équirectangulaire." },
      { step: 5, title: "Visualisation VR", content: "Connecter le casque VR du FabLab pour visionner en immersion. Partager sur YouTube 360°, Google Street View ou une plateforme VR selon l'usage." },
    ],
    safetyNotes: ["Ne pas toucher les objectifs avec les doigts — empreintes irréversibles", "Protéger les caméras de l'humidité et des chocs", "Toujours utiliser le trépied pour les prises 360°"],
  },
  {
    id: "defonceuse-cnc",
    name: "Défonceuse CNC",
    brand: "Shaper Origin",
    category: "Découpe",
    icon: "⊕",
    color: "#795548",
    description: "Défonceuse CNC portative à réalité augmentée. Guidage automatique via caméra intégrée et marqueurs ShaperTape. Découpe bois, aluminium et plastique avec précision ±0,1 mm.",
    manual: [
      { step: 1, title: "Pose du ShaperTape et scan", content: "Poser le ShaperTape (ruban à motifs) sur et autour de la pièce. Allumer la Shaper Origin et scanner la zone en déplaçant l'outil au-dessus des marqueurs jusqu'à ce que la carte soit complète." },
      { step: 2, title: "Importation du fichier SVG", content: "Brancher la clé USB avec le fichier SVG. Sur l'écran tactile, importer et positionner le dessin sur la zone de travail virtuelle. Définir l'origine et la profondeur de coupe." },
      { step: 3, title: "Montage de la fraise", content: "Monter la fraise adaptée (droite pour bois, spirale pour aluminium). Régler la profondeur de passe. Fixer solidement la pièce avec serre-joints." },
      { step: 4, title: "Usinage guidé", content: "Sélectionner le mode automatique. L'outil se guide lui-même sur le tracé. Maintenir fermement et suivre les indications de l'écran. Effectuer plusieurs passes pour les profondeurs importantes." },
      { step: 5, title: "Finition et nettoyage", content: "Retirer délicatement le ShaperTape. Dépoussiérer la pièce. Nettoyer la fraise avec une brosse et ranger dans son étui." },
    ],
    safetyNotes: ["Lunettes et masque anti-poussière obligatoires", "Fixer toujours la pièce avant usinage", "Ne jamais approcher les doigts de la fraise en rotation"],
  },
  {
    id: "fraiseuse-cnc",
    name: "Fraiseuse CNC 3 Axes",
    brand: "3 axes",
    category: "Découpe",
    icon: "⌗",
    color: "#607D8B",
    description: "Fraiseuse numérique 3 axes pour l'usinage de bois, plastique et métaux tendres. Pilotée par G-code pour des découpes et usinages de précision.",
    manual: [
      { step: 1, title: "Mise en route et homing", content: "Vérifier que la zone de travail est dégagée. Allumer la machine et le contrôleur. Effectuer la mise à l'origine (homing) sur les 3 axes depuis le logiciel de pilotage." },
      { step: 2, title: "Fixation de la pièce", content: "Fixer solidement la pièce avec brides ou colle double face. Vérifier que les brides ne sont pas dans la trajectoire de la fraise." },
      { step: 3, title: "Montage fraise et zéro pièce", content: "Monter la fraise adaptée dans la pince. Définir le point zéro de la pièce sur X, Y et Z à l'aide du palpeur ou manuellement." },
      { step: 4, title: "Envoi du G-code", content: "Ouvrir le fichier G-code (généré via Fusion 360 ou VCarve). Vérifier la simulation du parcours outil avant de lancer. Démarrer l'usinage." },
      { step: 5, title: "Surveillance et nettoyage", content: "Rester présent pendant tout l'usinage. À la fin, attendre l'arrêt complet de la broche avant de toucher la pièce. Dépoussiérer et nettoyer le plateau." },
    ],
    safetyNotes: ["Lunettes et protection auditive obligatoires", "Ne jamais introduire les mains dans la zone d'usinage en cours", "Arrêt d'urgence sur le boîtier de contrôle — connaître son emplacement"],
  },
  {
    id: "kobra2pro",
    name: "Imprimante 3D FDM",
    brand: "Anycubic Kobra 2 Pro",
    category: "Fabrication",
    icon: "⬡",
    color: "#E65100",
    description: "Imprimante FDM haute vitesse 500 mm/s, volume 220×220×250 mm. Nivelage automatique LeviQ 2.0. Compatible PLA, PETG, TPU, ABS.",
    manual: [
      { step: 1, title: "Démarrage et nivelage automatique", content: "Allumer la machine. Dans 'Préparer > Auto-niveler', laisser la machine palper les points du plateau sans interrompre. Résultat sauvegardé automatiquement." },
      { step: 2, title: "Chargement du filament", content: "Préchauffer la buse (200°C pour PLA). Insérer le filament dans l'extrudeur jusqu'à résistance. Appuyer sur 'Charger filament' jusqu'à ce que le filament sorte uniformément." },
      { step: 3, title: "Transfert du fichier", content: "Préparer avec Cura (profil Kobra 2 Pro). Exporter en .gcode sur carte SD ou USB. Sélectionner 'Imprimer depuis SD'." },
      { step: 4, title: "Surveillance du démarrage", content: "Observer les 2-3 premières couches. En cas de problème d'adhérence : arrêter, relancer l'auto-niveler, ajuster le Z-offset." },
      { step: 5, title: "Fin d'impression", content: "Attendre refroidissement à moins de 40°C. Fléchir le plateau magnétique pour décoller la pièce. Ne pas gratter avec un outil tranchant." },
    ],
    safetyNotes: ["Ne pas toucher la buse en chauffe (jusqu'à 260°C)", "Ventiler — vapeurs de filament", "Ne pas laisser seul lors du premier démarrage"],
  },
  {
    id: "raise3d",
    name: "Imprimante 3D FDM",
    brand: "Raise3D Pro 2",
    category: "Fabrication",
    icon: "⬡",
    color: "#6A1B9A",
    description: "Imprimante FDM professionnelle double extrudeur, volume 305×305×300 mm. Impressions bimatières et supports solubles. Compatible PLA, ABS, ASA, PETG, Nylon, PC, TPU.",
    manual: [
      { step: 1, title: "Démarrage et préchauffage", content: "Allumer via le bouton frontal. Sélectionner 'Préchauffer' selon le filament. Attendre que buses et plateau atteignent les températures cibles." },
      { step: 2, title: "Chargement des filaments", content: "Charger les filaments dans les deux extrudeurs via le menu 'Filament'. Le filament doit sortir proprement des deux buses avant de lancer." },
      { step: 3, title: "Envoi du fichier", content: "Transférer le .gcode via clé USB ou Wi-Fi (IdeaMaker). Vérifier l'aperçu. Lancer depuis l'écran tactile." },
      { step: 4, title: "Surveillance", content: "Observer les premières couches. Surveiller à distance via l'application RaiseCloud. Vérifier l'adhérence et la qualité des supports." },
      { step: 5, title: "Fin et démontage", content: "Laisser refroidir le plateau. Retirer la pièce avec la spatule fournie. Dissoudre les supports solubles dans l'eau tiède si HIPS ou PVA utilisé." },
    ],
    safetyNotes: ["Ne pas toucher les buses en chauffe", "Ventiler lors d'impression ABS/ASA — fumées toxiques", "Garder l'enceinte fermée pendant l'impression"],
  },
  {
    id: "ultimaker",
    name: "Imprimante 3D FDM",
    brand: "Ultimaker S5",
    category: "Fabrication",
    icon: "⬡",
    color: "#0097A7",
    description: "Imprimante FDM professionnelle double extrudeur, volume 330×240×300 mm. Enceinte fermée, compatible PLA, ABS, Nylon, TPU, CPE, PC, PVA (supports solubles).",
    manual: [
      { step: 1, title: "Démarrage et vérifications", content: "Allumer. Vérifier les niveaux de filament (indicateurs à l'écran). Nettoyer le plateau et appliquer de la colle de fixation si nécessaire." },
      { step: 2, title: "Chargement du filament", content: "Via le menu 'Matériaux', charger les filaments gauche et droit. L'Ultimaker reconnaît les bobines NFC automatiquement. Pour les bobines tierces, entrer les paramètres manuellement." },
      { step: 3, title: "Envoi depuis Ultimaker Cura", content: "Préparer le fichier dans Ultimaker Cura (profil S5). Envoyer via Wi-Fi ou USB. Vérifier aperçu et temps estimé." },
      { step: 4, title: "Surveillance de l'impression", content: "Observer les 5 premières minutes. Vérifier l'adhérence de la première couche. Ajuster le Z-offset si nécessaire. La caméra intégrée permet la surveillance à distance." },
      { step: 5, title: "Fin et récupération", content: "Attendre le refroidissement complet. Dissoudre les supports PVA dans l'eau tiède (30-60 min). Nettoyer le plateau à l'isopropanol." },
    ],
    safetyNotes: ["Garder l'enceinte fermée pour ABS et Nylon", "Ne pas toucher buses ou plateau chaud", "Vérifier régulièrement le filtre à particules"],
  },
  {
    id: "photon-sla",
    name: "Imprimante 3D SLA",
    brand: "Anycubic Photon M7 Pro",
    category: "Fabrication",
    icon: "◆",
    color: "#AA00FF",
    description: "Imprimante résine MSLA 12K (11520×5120 px), volume 200×196×200 mm. Impressions ultra-détaillées pour figurines, bijoux et prototypes. Résines photosensibles UV.",
    manual: [
      { step: 1, title: "EPI obligatoires", content: "Mettre les gants en nitrile et les lunettes de protection AVANT de manipuler la résine. Travailler dans un espace ventilé. Ne jamais toucher la résine à mains nues." },
      { step: 2, title: "Remplissage de la cuve", content: "Agiter le flacon de résine avant usage. Verser dans la cuve jusqu'au repère MAX. Refermer le flacon hermétiquement et ranger à l'abri de la lumière." },
      { step: 3, title: "Lancement de l'impression", content: "Transférer le fichier .pwmo (Photon Workshop) sur clé USB. Sélectionner et lancer depuis l'écran. La plateforme descend dans la résine couche par couche." },
      { step: 4, title: "Lavage de la pièce", content: "Laisser égoutter 2-3 min au-dessus de la cuve. Plonger dans l'isopropanol 95% pendant 3-5 minutes en agitant. Gants obligatoires." },
      { step: 5, title: "Post-cuisson UV", content: "Placer dans la station de post-cuisson UV (à côté de la machine). Lancer 2-3 minutes selon l'épaisseur. Jeter les déchets de résine dans le bac de collecte dédié — ne pas mettre à l'évier." },
    ],
    safetyNotes: ["Gants nitrile et lunettes OBLIGATOIRES — résine irritante", "Ne jamais vider la résine à l'évier — bac de collecte dédié", "Ventilation obligatoire — vapeurs toxiques", "Résine non polymérisée = déchet chimique"],
  },
  {
    id: "imprimante-photo",
    name: "Imprimante Photos",
    brand: "Epson SC-P7500",
    category: "Impression",
    icon: "▨",
    color: "#1565C0",
    description: "Imprimante photo grand format A1+ (24 pouces), 11 couleurs. Impression fine art, photos, épreuves couleur. Résolution 2400×1200 dpi.",
    manual: [
      { step: 1, title: "Mise en route et vérification encres", content: "Allumer. Vérifier les niveaux des 11 cartouches à l'écran. Remplacer toute cartouche faible avant une impression importante." },
      { step: 2, title: "Chargement du papier", content: "Sélectionner le type de support (feuille ou rouleau). Charger selon le guide affiché. Sélectionner le type de papier exact pour calibrer les profils couleur." },
      { step: 3, title: "Préparation du fichier", content: "Fichier en mode RVB ou CMJN selon l'usage. Dans le pilote Epson, sélectionner le profil ICC correspondant au papier. Résolution minimum 300 dpi." },
      { step: 4, title: "Impression", content: "Lancer l'impression. Ne pas tirer sur le papier. Laisser sécher 2-3 minutes avant manipulation." },
      { step: 5, title: "Fin de session", content: "Éteindre via le bouton dédié — la machine protège ses buses automatiquement. Ranger les papiers spéciaux dans leur emballage hermétique." },
    ],
    safetyNotes: ["Ne jamais tirer sur le papier pendant l'impression", "Utiliser les papiers compatibles pour les profils couleur", "Ne pas débrancher sans éteindre correctement"],
  },
  {
    id: "imprimante-signaletique",
    name: "Imprimante Signalétique",
    brand: "Epson SC-S40600",
    category: "Impression",
    icon: "▬",
    color: "#00695C",
    description: "Imprimante grand format 64 pouces pour signalétique, banderoles et stickers. Encres solvantées CMJN. Compatible vinyle, bâche, papier dos adhésif.",
    manual: [
      { step: 1, title: "Mise en route et ventilation", content: "Allumer la machine et le système de ventilation. Vérifier les niveaux d'encres. Effectuer un nozzle check pour détecter les buses bouchées." },
      { step: 2, title: "Chargement du support", content: "Charger le rouleau sur le mandrin arrière. Faire passer sous les rouleaux d'entraînement selon le schéma. Ajuster les guides latéraux et lancer le chargement automatique." },
      { step: 3, title: "Envoi depuis le logiciel RIP", content: "Sur l'ordinateur dédié, ouvrir le RIP (Wasatch ou Epson Edge). Importer le fichier (PDF, TIFF, JPEG). Appliquer le profil couleur du support et lancer." },
      { step: 4, title: "Impression", content: "Surveillance régulière pour les grandes longueurs. Vérifier que le support ne se froisse pas. La lampe infrarouge de séchage est intégrée." },
      { step: 5, title: "Découpe et dégazage", content: "Découper avec le plotter de découpe. Laisser dégazer 24h les impressions solvantées avant application en espace clos." },
    ],
    safetyNotes: ["Ventilation obligatoire — encres solvantées", "Ne pas inhaler les vapeurs", "Laisser dégazer 24h avant application en espace clos"],
  },
  {
    id: "machine-a-coudre",
    name: "Machine à Coudre",
    brand: "Brother NV1100",
    category: "Textile",
    icon: "✦",
    color: "#AD1457",
    description: "Machine à coudre numérique 130 points, broderie intégrée. Enfilage et coupe-fil automatiques. Pour couture, retouches et créations textiles.",
    manual: [
      { step: 1, title: "Enfilage du fil supérieur", content: "Suivre les numéros guides-fil imprimés sur la machine. Le levier d'enfilage automatique facilite le passage dans le chas de l'aiguille." },
      { step: 2, title: "Installation de la canette", content: "Ouvrir la trappe de la canette sous le plateau. Insérer la canette en faisant passer le fil dans le guide. Tirer les deux fils vers l'arrière avant de commencer." },
      { step: 3, title: "Sélection du point", content: "Sur l'écran LCD, choisir le type de point selon tissu et usage (droit, zigzag, élastique...). Régler longueur et largeur si nécessaire." },
      { step: 4, title: "Couture", content: "Placer le tissu sous le pied presseur et l'abaisser. Tenir les fils vers l'arrière pour les premiers points. Commencer et finir par un point d'arrêt (marche arrière)." },
      { step: 5, title: "Fin et rangement", content: "Coupe-fil automatique intégré. Relever l'aiguille en position haute avant de retirer le tissu. Couvrir la machine avec la housse." },
    ],
    safetyNotes: ["Ne jamais mettre les doigts sous l'aiguille en mouvement", "Relever le pied presseur pour insérer ou retirer le tissu", "Éteindre avant de changer l'aiguille"],
  },
  {
    id: "outillage-menuiserie",
    name: "Outillage de Menuiserie",
    brand: "Atelier bois",
    category: "Fabrication",
    icon: "◧",
    color: "#5D4037",
    description: "Scie à onglet, perceuse à colonne, ponceuse, scie sauteuse, visseuse, outils à main. Pour découpe, assemblage et finition de pièces en bois.",
    manual: [
      { step: 1, title: "Choix de l'outil", content: "Identifier l'outil adapté à votre tâche. Vérifier l'état des lames, forets et disques avant utilisation. Signaler tout outil défectueux au Fabmanager." },
      { step: 2, title: "Équipements de protection", content: "Porter lunettes de protection, bouchons d'oreilles et masque anti-poussière. Vêtements ajustés — pas de manches larges ni de bijoux." },
      { step: 3, title: "Fixation de la pièce", content: "Toujours fixer la pièce avec serre-joints ou étau avant d'usiner. Ne jamais tenir la pièce à la main lors d'un sciage motorisé." },
      { step: 4, title: "Utilisation", content: "Avancer lentement et régulièrement. Ne pas forcer. Utiliser les guides et butées pour les coupes répétées." },
      { step: 5, title: "Rangement et nettoyage", content: "Ranger chaque outil à sa place. Aspirer les copeaux. Vider le bac de la scie à onglet. Laisser l'atelier propre." },
    ],
    safetyNotes: ["Lunettes, protection auditive et masque obligatoires", "Ne jamais distraire un autre utilisateur sur une machine", "Connaître l'emplacement de l'arrêt d'urgence avant utilisation"],
  },
  {
    id: "outillage-electronique",
    name: "Outillage Électronique",
    brand: "Atelier électronique",
    category: "Numérique",
    icon: "⌁",
    color: "#37474F",
    description: "Postes de soudure, multimètres, oscilloscope, alimentation de laboratoire, fer à dessouder, microscope de soudure. Pour prototypage, réparation et développement de circuits.",
    manual: [
      { step: 1, title: "Préparation du poste de soudure", content: "Allumer le fer et régler la température (320-380°C standard, 350-400°C pour CMS). Attendre la stabilisation. Étamer la panne avant utilisation." },
      { step: 2, title: "Soudage", content: "Nettoyer les surfaces. Appuyer la panne sur la jonction 2-3 secondes. Apporter l'étain sur la jonction (pas sur la panne). Retirer la panne et laisser refroidir sans bouger la pièce." },
      { step: 3, title: "Mesure et vérification", content: "Multimètre pour tests de continuité et tensions. Oscilloscope pour visualiser les signaux. Alimentation de laboratoire pour tester les circuits à tension contrôlée." },
      { step: 4, title: "Sécurité électrique", content: "Ne jamais travailler sur du 230V secteur sans formation spécifique. Utiliser l'alimentation de laboratoire limitée en courant pour les tests." },
      { step: 5, title: "Rangement", content: "Éteindre le fer et le poser sur son support. Nettoyer la panne avec éponge ou laine d'acier. Étamer la panne pour la protéger. Ranger composants et outils." },
    ],
    safetyNotes: ["Ne jamais travailler sur du 230V secteur sans formation", "Ventilation lors du soudage — fumées de flux irritantes", "Fer uniquement sur son support — risque de brûlure"],
  },
  {
    id: "photocopieur",
    name: "Photocopieur",
    brand: "Toshiba e-Studio",
    category: "Impression",
    icon: "▤",
    color: "#455A64",
    description: "Multifonction A3 couleur : impression, copie, scan et envoi par email. Recto-verso automatique. Pour documents, plans et supports de communication.",
    manual: [
      { step: 1, title: "Mise en route", content: "Appuyer sur le bouton de réveil. Attendre le préchauffage (~30 sec). S'identifier si un code est demandé (voir Fabmanager)." },
      { step: 2, title: "Copie", content: "Placer le document sur la vitre ou dans le chargeur. Sélectionner 'Copie'. Régler format, nombre, couleur/N&B, recto-verso. Démarrer." },
      { step: 3, title: "Scan vers email ou USB", content: "Sélectionner 'Scanner'. Choisir destination (email ou USB). Régler résolution (150 dpi documents, 300 dpi photos). Lancer." },
      { step: 4, title: "Impression depuis USB", content: "Insérer la clé USB. Sélectionner 'Impression USB'. Choisir le fichier (PDF, JPEG, Word). Régler les options et lancer." },
      { step: 5, title: "Bourrage papier", content: "Suivre les indications à l'écran — la machine indique l'emplacement du bourrage. Ouvrir les trappes, retirer le papier délicatement. Refermer toutes les trappes avant de relancer." },
    ],
    safetyNotes: ["Ne pas regarder directement le faisceau de numérisation", "Ne pas forcer sur le chargeur automatique", "Signaler tout bourrage non résolu au Fabmanager"],
  },
  {
    id: "plotter-decoupe",
    name: "Plotter de Découpe",
    brand: "Summa D140RL",
    category: "Découpe",
    icon: "◫",
    color: "#00838F",
    description: "Plotter de découpe vinyle 140 cm. Découpe vinyle adhésif, flock et transfert thermique. Précision ±0,1 mm. Pour stickers, lettrage et flocage textile.",
    manual: [
      { step: 1, title: "Chargement du support", content: "Passer le vinyle sous les rouleaux d'entraînement. Aligner avec les repères. Abaisser le levier de pression et sélectionner 'Chargement rouleau' sur le panneau." },
      { step: 2, title: "Calibrage de la lame", content: "Sélectionner le type de vinyle et régler la pression de coupe (tableau affiché). Effectuer un test de coupe : le vinyle doit être découpé sans entailler le papier support." },
      { step: 3, title: "Envoi du fichier", content: "Ouvrir le fichier vectoriel (SVG, AI, EPS) dans SummaCut ou Summa Cutter Control. Vérifier la taille, positionner le motif et envoyer vers le plotter." },
      { step: 4, title: "Découpe", content: "Ne pas toucher le support pendant la découpe. Pour les grandes pièces, vérifier que le vinyle déroule librement." },
      { step: 5, title: "Weed et pose", content: "Retirer l'excédent de vinyle (weed). Appliquer le papier de transfert. Poser en chassant les bulles du centre vers les bords. Retirer le papier à 45°." },
    ],
    safetyNotes: ["Ne pas approcher les doigts de la lame pendant la découpe", "Support maximum 140 cm de large", "Pression excessive use la lame — respecter les réglages"],
  },
  {
    id: "scanner-3d",
    name: "Scanner 3D",
    brand: "Einscan Pro 2X Plus",
    category: "Numérique",
    icon: "⊙",
    color: "#00796B",
    description: "Scanner 3D professionnel portable, précision jusqu'à 0,04 mm. Mode plateau tournant (objets < 30 cm) et scan manuel (grands objets). Export STL, OBJ pour impression 3D ou modélisation.",
    manual: [
      { step: 1, title: "Installation et calibrage", content: "Brancher le scanner au PC via USB. Ouvrir EXScan Pro. Effectuer le calibrage avec la planche fournie à chaque nouvelle session (~2 min)." },
      { step: 2, title: "Choix du mode de scan", content: "Mode plateau tournant : pour objets < 30 cm. Mode scan manuel : grands objets ou personnes. Configurer la résolution dans EXScan Pro." },
      { step: 3, title: "Préparation de l'objet", content: "Traiter les surfaces brillantes, transparentes ou sombres avec le spray de matage temporaire. Poser des marqueurs autocollants pour les scans manuels." },
      { step: 4, title: "Acquisition", content: "Plateau tournant : lancer la rotation automatique. Scan manuel : déplacer lentement le scanner en suivant l'indicateur de qualité à l'écran." },
      { step: 5, title: "Post-traitement et export", content: "Fusionner les scans si plusieurs passes. Remplir les trous avec l'outil de reconstruction. Exporter en STL pour impression 3D ou OBJ pour modélisation." },
    ],
    safetyNotes: ["Ne pas regarder directement les projecteurs du scanner", "Appareil fragile et coûteux — manipuler avec précaution", "Rincer à l'eau le spray de matage avant de rendre l'objet scanné"],
  },
  {
    id: "surjeteuse",
    name: "Surjeteuse",
    brand: "Pfaff 1230OL",
    category: "Textile",
    icon: "✤",
    color: "#C62828",
    description: "Surjeteuse 4 fils pour finitions de coutures, assemblage de tissus extensibles et overlock. Coupe le surplus de tissu tout en surfilant pour des finitions professionnelles.",
    manual: [
      { step: 1, title: "Enfilage", content: "Suivre impérativement le schéma couleur affiché sur la machine (ordre : looper supérieur → looper inférieur → aiguille droite → aiguille gauche). Un enfilage incorrect bloque la machine." },
      { step: 2, title: "Réglages", content: "Régler les tensions des 4 fils selon le tissu (valeurs dans le manuel). Pour les tissus extensibles, augmenter le différentiel à 1,5-2." },
      { step: 3, title: "Test sur chute", content: "Toujours tester sur une chute du même tissu avant la pièce finale. Vérifier l'équilibre du point et la netteté de la coupe." },
      { step: 4, title: "Surfilage", content: "Placer le tissu sous le pied, aligner le bord avec le couteau. Maintenir les fils vers l'arrière au démarrage. La machine coupe et surfile simultanément." },
      { step: 5, title: "Fin et fixation", content: "Surjeter 3-4 cm dans le vide pour sécuriser. Passer les fils de queue dans une aiguille et les glisser sous les mailles. Ne jamais arracher le tissu." },
    ],
    safetyNotes: ["Ne jamais approcher les doigts du couteau en fonctionnement", "Éteindre avant de changer aiguilles ou couteau", "Lame de coupe très tranchante — manipuler avec précaution"],
  },
  {
    id: "thermoformeuse",
    name: "Thermoformeuse",
    brand: "Formech 450DT",
    category: "Fabrication",
    icon: "◻",
    color: "#EF6C00",
    description: "Thermoformeuse semi-professionnelle, plateau 450×350 mm. Chauffe des feuilles plastiques (PVC, ABS, PETG, HIPS) sur moule pour créer coques, emballages et pièces formées.",
    manual: [
      { step: 1, title: "Préparation du moule", content: "Le moule doit être légèrement conique (dépouille ≥ 3°) pour le démoulage. Percer des trous d'aspiration ∅1mm dans les zones creuses. Fixer le moule au centre du plateau." },
      { step: 2, title: "Chargement de la feuille", content: "Choisir l'épaisseur adaptée (0,5 à 3 mm). Placer dans le cadre de maintien en serrant uniformément. La feuille doit être bien tendue." },
      { step: 3, title: "Chauffe", content: "Régler la température selon le plastique (ABS : 150-170°C, PVC : 130-150°C, PETG : 140-160°C). Observer la feuille : quand elle se ré-aplatit et brille légèrement, c'est le signal pour former." },
      { step: 4, title: "Formage par aspiration", content: "Dès que le plastique est prêt, descendre rapidement le cadre sur le moule et activer l'aspiration. Le plastique épouse le moule. Maintenir 30-60 sec jusqu'au refroidissement." },
      { step: 5, title: "Démoulage et découpe", content: "Couper l'aspiration et remonter le cadre. Démouler délicatement en commençant par les bords. Découper le surplus avec ciseaux ou plotter. Poncer les bords si nécessaire." },
    ],
    safetyNotes: ["Résistances à +150°C — gants résistants à la chaleur obligatoires", "Ventiler — vapeurs dégagées lors de la chauffe", "Ne jamais laisser le plastique chauffer sans surveillance"],
  },
];


const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0F1117;
    --surface: #1A1D27;
    --surface2: #242836;
    --border: #2E3347;
    --text: #E8EAF0;
    --muted: #6B7280;
    --accent: #4ECDC4;
    --danger: #E63946;
    --success: #2EC4B6;
    --warning: #F4A261;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }

  .app { display: flex; flex-direction: column; min-height: 100vh; }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 32px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 100;
  }
  .header-logo { display: flex; align-items: center; gap: 12px; }
  .logo-img { height: 44px; width: auto; }

  .header-user { display: flex; align-items: center; gap: 12px; }
  .user-badge { padding: 6px 14px; border-radius: 20px; background: var(--surface2); border: 1px solid var(--border); font-size: 13px; font-weight: 500; }
  .admin-tag { padding: 3px 8px; border-radius: 4px; background: rgba(78,205,196,0.15); border: 1px solid rgba(78,205,196,0.4); color: var(--accent); font-size: 10px; font-family: 'Space Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; }

  .btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.15s ease; }
  .btn-primary { background: var(--accent); color: var(--bg); }
  .btn-primary:hover { background: #3BBDB5; transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--muted); border: 1px solid var(--border); }
  .btn-ghost:hover { color: var(--text); border-color: var(--text); }
  .btn-sm { padding: 6px 14px; font-size: 13px; }
  .btn-danger { background: rgba(230,57,70,0.12); color: var(--danger); border: 1px solid rgba(230,57,70,0.3); }
  .btn-danger:hover { background: rgba(230,57,70,0.22); }

  .login-screen {
    flex: 1; display: flex; align-items: center; justify-content: center;
    background: radial-gradient(ellipse at 30% 50%, rgba(78,205,196,0.08) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 20%, rgba(246,162,161,0.06) 0%, transparent 50%);
  }
  .login-card { width: 380px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 40px; }
  .login-logo { display: flex; justify-content: center; margin-bottom: 28px; }
  .login-logo img { height: 64px; width: auto; }
  .login-sub { color: var(--muted); font-size: 14px; margin-bottom: 32px; text-align: center; }
  .field { margin-bottom: 18px; }
  .field label { display: block; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .field input { width: 100%; padding: 10px 14px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border); color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif; transition: border-color 0.15s; outline: none; }
  .field input:focus { border-color: var(--accent); }
  .login-error { color: var(--danger); font-size: 13px; margin-bottom: 14px; }
  .login-hint { font-size: 12px; color: var(--muted); margin-top: 16px; text-align: center; }
  .login-hint code { background: var(--surface2); padding: 2px 6px; border-radius: 4px; font-family: 'Space Mono', monospace; }

  .main { flex: 1; padding: 40px 32px; max-width: 1200px; margin: 0 auto; width: 100%; }
  .page-header { margin-bottom: 36px; }
  .page-title { font-family: 'Space Mono', monospace; font-size: 26px; margin-bottom: 8px; }
  .page-sub { color: var(--muted); font-size: 15px; }

  .tabs { display: flex; gap: 4px; margin-bottom: 32px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 4px; width: fit-content; }
  .tab { padding: 8px 18px; border-radius: 7px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s; color: var(--muted); background: transparent; border: none; }
  .tab.active { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .tab:hover:not(.active) { color: var(--text); }

  .machine-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .machine-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden; }
  .machine-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--card-color, var(--accent)); opacity: 0.6; transition: opacity 0.2s; }
  .machine-card:hover { border-color: var(--card-color, var(--accent)); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .machine-card:hover::before { opacity: 1; }
  .machine-card.locked { opacity: 0.65; cursor: default; }
  .machine-card.locked:hover { transform: none; box-shadow: none; }

  .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .card-icon { font-size: 28px; line-height: 1; }
  .access-badge { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; }
  .access-badge.granted { background: rgba(46,196,182,0.15); color: #2EC4B6; border: 1px solid rgba(46,196,182,0.3); }
  .access-badge.denied { background: rgba(107,114,128,0.15); color: var(--muted); border: 1px solid var(--border); }
  .card-name { font-family: 'Space Mono', monospace; font-size: 15px; margin-bottom: 4px; }
  .card-brand { font-size: 12px; color: var(--muted); margin-bottom: 10px; }
  .card-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }
  .card-category { display: inline-block; margin-top: 14px; font-size: 11px; font-family: 'Space Mono', monospace; letter-spacing: 0.1em; color: var(--card-color, var(--accent)); text-transform: uppercase; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 100%; max-width: 680px; max-height: 85vh; overflow-y: auto; animation: slideUp 0.25s ease; }
  .modal-header { padding: 28px 32px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; position: sticky; top: 0; background: var(--surface); z-index: 1; }
  .modal-header-left { flex: 1; }
  .modal-machine-name { font-family: 'Space Mono', monospace; font-size: 20px; margin-bottom: 4px; }
  .modal-machine-brand { color: var(--muted); font-size: 14px; }
  .modal-close { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .modal-close:hover { color: var(--text); }
  .modal-body { padding: 28px 32px; }

  .section-label { font-size: 11px; font-family: 'Space Mono', monospace; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .steps { display: flex; flex-direction: column; gap: 14px; }
  .step { display: flex; gap: 16px; padding: 16px; border-radius: 10px; background: var(--surface2); border: 1px solid var(--border); }
  .step-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--accent); color: var(--bg); font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .step-content { flex: 1; }
  .step-title { font-weight: 600; font-size: 14px; margin-bottom: 6px; }
  .step-text { font-size: 13px; color: var(--muted); line-height: 1.6; }

  .safety-box { background: rgba(230,57,70,0.08); border: 1px solid rgba(230,57,70,0.25); border-radius: 10px; padding: 16px; margin-top: 24px; }
  .safety-title { color: var(--danger); font-size: 12px; font-family: 'Space Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
  .safety-items { display: flex; flex-direction: column; gap: 6px; }
  .safety-item { font-size: 13px; color: #F08080; display: flex; gap: 8px; align-items: flex-start; }

  .locked-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 32px; text-align: center; gap: 16px; }
  .lock-icon { font-size: 48px; }
  .lock-title { font-family: 'Space Mono', monospace; font-size: 18px; }
  .lock-desc { color: var(--muted); font-size: 14px; line-height: 1.6; max-width: 320px; }

  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th { text-align: left; padding: 10px 14px; font-size: 11px; font-family: 'Space Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--border); }
  .admin-table td { padding: 14px; border-bottom: 1px solid rgba(46,51,71,0.5); vertical-align: top; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table th:first-child, .admin-table td:first-child { width: 220px; min-width: 180px; }
  .user-name { font-weight: 600; font-size: 14px; }
  .user-email { font-size: 12px; color: var(--muted); margin-top: 2px; word-break: break-all; }

  .machine-checkboxes { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .machine-toggle { display: flex; align-items: center; gap: 6px; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.15s; border: 1px solid var(--border); background: var(--bg); color: var(--muted); user-select: none; }
  .machine-toggle.active { border-color: rgba(46,196,182,0.5); background: rgba(46,196,182,0.1); color: #2EC4B6; }
  .machine-toggle input { display: none; }

  .save-banner { position: fixed; bottom: 24px; right: 24px; background: var(--surface); border: 1px solid var(--accent); border-radius: 10px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; animation: slideUp 0.3s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .save-msg { font-size: 14px; }
  .save-msg strong { color: var(--accent); }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase
      .from("members")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .eq("password", password)
      .single();
    setLoading(false);
    if (err || !data) { setError("Email ou mot de passe incorrect."); return; }
    onLogin({ ...data, authorizedMachines: data.authorized_machines || [] });
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="FabLab Vichy Communauté" />
        </div>
        <div className="login-sub">Accédez aux modes d'emploi des machines.</div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.fr" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </div>
    </div>
  );
}

function MachineModal({ machine, isAuthorized, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <div style={{ fontSize: 28, marginBottom: 8 }}>{machine.icon}</div>
            <div className="modal-machine-name">{machine.name}</div>
            <div className="modal-machine-brand">{machine.brand}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {isAuthorized ? (
            <>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>{machine.description}</p>
              <div className="section-label">Mode d'emploi — {machine.manual.length} étapes</div>
              <div className="steps">
                {machine.manual.map(s => (
                  <div key={s.step} className="step">
                    <div className="step-num">{s.step}</div>
                    <div className="step-content">
                      <div className="step-title">{s.title}</div>
                      <div className="step-text">{s.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="safety-box">
                <div className="safety-title">⚠ Consignes de sécurité</div>
                <div className="safety-items">
                  {machine.safetyNotes.map((n, i) => (
                    <div key={i} className="safety-item"><span>→</span>{n}</div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="locked-overlay">
              <div className="lock-icon">🔒</div>
              <div className="lock-title">Accès non autorisé</div>
              <div className="lock-desc">
                Vous n'avez pas encore suivi la formation pour cette machine.<br />
                Contactez un responsable du FabLab pour programmer votre formation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MachinesView({ currentUser }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="page-header">
        <div className="page-title">Machines disponibles</div>
        <div className="page-sub">Cliquez sur une machine pour accéder à son mode d'emploi si vous avez été formé.</div>
      </div>
      <div className="machine-grid">
        {MACHINES.map(machine => {
          const isAuth = currentUser.role === "admin" || currentUser.authorizedMachines.includes(machine.id);
          return (
            <div
              key={machine.id}
              className={`machine-card ${!isAuth ? "locked" : ""}`}
              style={{ "--card-color": machine.color }}
              onClick={() => setSelected({ machine, isAuth })}
            >
              <div className="card-top">
                <div className="card-icon">{machine.icon}</div>
                <div className={`access-badge ${isAuth ? "granted" : "denied"}`}>
                  {isAuth ? "● Formé" : "○ Non formé"}
                </div>
              </div>
              <div className="card-name">{machine.name}</div>
              <div className="card-brand">{machine.brand}</div>
              <div className="card-desc">{machine.description}</div>
              <div className="card-category">{machine.category}</div>
            </div>
          );
        })}
      </div>
      {selected && (
        <MachineModal
          machine={selected.machine}
          isAuthorized={selected.isAuth}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function AdminView() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const [addError, setAddError] = useState("");

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").eq("role", "user").order("name");
    setMembers((data || []).map(u => ({ ...u, authorizedMachines: u.authorized_machines || [] })));
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const toggle = async (userId, machineId) => {
    const member = members.find(u => u.id === userId);
    const has = member.authorizedMachines.includes(machineId);
    const updated = has
      ? member.authorizedMachines.filter(m => m !== machineId)
      : [...member.authorizedMachines, machineId];
    await supabase.from("members").update({ authorized_machines: updated }).eq("id", userId);
    setMembers(prev => prev.map(u => u.id === userId ? { ...u, authorizedMachines: updated } : u));
    setSavedMsg("Autorisations mises à jour.");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const deleteMember = async (userId, name) => {
    if (!confirm(`Supprimer le membre "${name}" ?`)) return;
    await supabase.from("members").delete().eq("id", userId);
    setMembers(prev => prev.filter(u => u.id !== userId));
    setSavedMsg("Membre supprimé.");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const addMember = async () => {
    setAddError("");
    if (!newUser.name || !newUser.email || !newUser.password) { setAddError("Tous les champs sont obligatoires."); return; }
    const { error } = await supabase.from("members").insert({
      name: newUser.name,
      email: newUser.email.toLowerCase().trim(),
      password: newUser.password,
      role: newUser.role,
      authorized_machines: [],
    });
    if (error) { setAddError(error.message.includes("unique") ? "Cet email existe déjà." : error.message); return; }
    setNewUser({ name: "", email: "", password: "", role: "user" });
    setShowAdd(false);
    fetchMembers();
    setSavedMsg("Membre ajouté avec succès.");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  return (
    <>
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="page-title">Gestion des membres</div>
          <div className="page-sub">Gérez les membres et leurs autorisations machines.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(s => !s)}>
          {showAdd ? "Annuler" : "+ Ajouter un membre"}
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--accent)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "var(--accent)", marginBottom: 16, letterSpacing: "0.1em", textTransform: "uppercase" }}>Nouveau membre</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Nom complet</label>
              <input type="text" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} placeholder="Prénom Nom" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Email</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="prenom@email.fr" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Mot de passe</label>
              <input type="text" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="mot de passe temporaire" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Rôle</label>
              <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
                <option value="user">Membre</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          {addError && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}>{addError}</div>}
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={addMember}>Créer le membre</button>
        </div>
      )}

      {loading ? (
        <div style={{ color: "var(--muted)", textAlign: "center", padding: 48 }}>Chargement…</div>
      ) : (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Membre</th>
                <th>Machines autorisées</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan={2} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>Aucun membre.</td></tr>
              ) : members.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "var(--accent)" }}>
                      {user.authorizedMachines.length}/{MACHINES.length} machines
                    </div>
                    <button className="btn btn-danger btn-sm" style={{ marginTop: 10 }} onClick={() => deleteMember(user.id, user.name)}>Supprimer</button>
                  </td>
                  <td>
                    <div className="machine-checkboxes">
                      {MACHINES.map(m => {
                        const active = user.authorizedMachines.includes(m.id);
                        return (
                          <label key={m.id} className={`machine-toggle ${active ? "active" : ""}`} onClick={() => toggle(user.id, m.id)}>
                            {m.icon} {m.name}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {savedMsg && (
        <div className="save-banner">
          <span>✓</span>
          <span className="save-msg"><strong>{savedMsg}</strong></span>
        </div>
      )}
    </>
  );
}

function ProfileView({ currentUser }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    setError(""); setSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) { setError("Tous les champs sont obligatoires."); return; }
    if (newPassword !== confirmPassword) { setError("Les nouveaux mots de passe ne correspondent pas."); return; }
    if (newPassword.length < 4) { setError("Le mot de passe doit contenir au moins 4 caractères."); return; }
    setLoading(true);
    const { data } = await supabase.from("members").select("id").eq("id", currentUser.id).eq("password", currentPassword).single();
    if (!data) { setLoading(false); setError("Mot de passe actuel incorrect."); return; }
    const { error: updateErr } = await supabase.from("members").update({ password: newPassword }).eq("id", currentUser.id);
    setLoading(false);
    if (updateErr) { setError("Erreur lors de la mise à jour."); return; }
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setSuccess("Mot de passe modifié avec succès !");
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">Mon compte</div>
        <div className="page-sub">Modifiez votre mot de passe.</div>
      </div>
      <div style={{ maxWidth: 440 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 28 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "var(--accent)", marginBottom: 20, letterSpacing: "0.1em", textTransform: "uppercase" }}>Changer le mot de passe</div>
          <div style={{ marginBottom: 20, padding: "10px 14px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{currentUser.name}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{currentUser.email}</div>
          </div>
          <div className="field">
            <label>Mot de passe actuel</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••" />
          </div>
          <div className="field">
            <label>Nouveau mot de passe</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••" />
          </div>
          <div className="field">
            <label>Confirmer le nouveau mot de passe</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••" onKeyDown={e => e.key === "Enter" && handleChange()} />
          </div>
          {error && <div style={{ color: "var(--danger)", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          {success && <div style={{ color: "var(--success)", fontSize: 13, marginBottom: 12 }}>{success}</div>}
          <button className="btn btn-primary" onClick={handleChange} disabled={loading}>
            {loading ? "Mise à jour…" : "Modifier le mot de passe"}
          </button>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState("machines");

  if (!currentUser) {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <LoginScreen onLogin={setCurrentUser} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <div className="header-logo">
            <img src="/logo.png" alt="FabLab Vichy Communauté" className="logo-img" />
          </div>
          <div className="header-user">
            <span className="user-badge">{currentUser.name}</span>
            {currentUser.role === "admin" && <span className="admin-tag">Admin</span>}
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentUser(null)}>Déconnexion</button>
          </div>
        </header>
        <main className="main">
          <div className="tabs">
            <button className={`tab ${tab === "machines" ? "active" : ""}`} onClick={() => setTab("machines")}>Machines</button>
            {currentUser.role === "admin" && <button className={`tab ${tab === "admin" ? "active" : ""}`} onClick={() => setTab("admin")}>Membres</button>}
            <button className={`tab ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>Mon compte</button>
          </div>
          {tab === "machines" && <MachinesView currentUser={currentUser} />}
          {tab === "admin" && currentUser.role === "admin" && <AdminView />}
          {tab === "profile" && <ProfileView currentUser={currentUser} />}
        </main>
      </div>
    </>
  );
}
