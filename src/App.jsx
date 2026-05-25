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
    description: "Laser CO2 60W pour gravure et découpe de bois, acrylique, cuir, carton et tissu. Zone de travail 726×432 mm, précision 0,025 mm.",
    manual: [
      { step: 1, title: "Démarrage et ventilation", content: "Allumer d'abord le système d'extraction (boîtier noir à gauche). Attendre 30 secondes, puis allumer la machine Trotec. Ne jamais utiliser le laser sans extraction active." },
      { step: 2, title: "Vérification du matériau autorisé", content: "Consulter la liste affichée sur la machine. Matériaux INTERDITS absolus : PVC, polycarbonate, tout matériau contenant du chlore ou du brome. En cas de doute, demander à un responsable." },
      { step: 3, title: "Mise en place et mise au point", content: "Placer le matériau sur le plateau alvéolé. Utiliser la jauge de mise au point fournie pour régler la distance buse/matériau. Le plateau se règle avec les touches de navigation de la machine." },
      { step: 4, title: "Envoi du fichier depuis JobControl", content: "Sur l'ordinateur dédié, ouvrir JobControl Trotec. Importer votre fichier (SVG, DXF ou PDF). Assigner les paramètres de puissance/vitesse selon le tableau matériaux affiché. Glisser le job dans la zone de travail en correspondance avec votre pièce." },
      { step: 5, title: "Test de cadrage", content: "Appuyer sur le bouton 'Pointeur' pour visualiser le contour sans découper. Vérifier que le tracé reste bien sur le matériau. Ajuster si nécessaire dans JobControl." },
      { step: 6, title: "Lancement — présence obligatoire", content: "Fermer le capot. Appuyer sur START dans JobControl. RESTER DEVANT LA MACHINE pendant tout le travail. En cas de flamme persistante : appuyer sur STOP, attendre 30 secondes avant d'ouvrir le capot." },
    ],
    safetyNotes: ["Présence obligatoire pendant toute l'opération", "Extraction TOUJOURS allumée avant le laser", "PVC et polycarbonate strictement interdits — dégagement de chlore toxique", "Extincteur CO2 disponible à côté de la machine"],
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
  .user-name { font-weight: 600; font-size: 14px; }
  .user-email { font-size: 12px; color: var(--muted); margin-top: 2px; }

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
          const isAuth = currentUser.authorizedMachines.includes(machine.id);
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--muted)", padding: 32 }}>Aucun membre.</td></tr>
              ) : members.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "var(--accent)" }}>
                      {user.authorizedMachines.length}/{MACHINES.length} machines
                    </div>
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
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteMember(user.id, user.name)}>Supprimer</button>
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
          {currentUser.role === "admin" && (
            <div className="tabs">
              <button className={`tab ${tab === "machines" ? "active" : ""}`} onClick={() => setTab("machines")}>Machines</button>
              <button className={`tab ${tab === "admin" ? "active" : ""}`} onClick={() => setTab("admin")}>Membres</button>
            </div>
          )}
          {tab === "machines" && <MachinesView currentUser={currentUser} />}
          {tab === "admin" && currentUser.role === "admin" && <AdminView />}
        </main>
      </div>
    </>
  );
}
