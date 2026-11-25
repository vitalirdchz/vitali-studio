import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineComputerDesktop,
  HiOutlineClock,
  HiOutlineFilm,
  HiOutlineNoSymbol,
  HiOutlineTruck,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiArrowTopRightOnSquare,
} from 'react-icons/hi2';

const RULES = [
  {
    icon: HiOutlineComputerDesktop,
    title: '1. La Règle du 1080p (Full HD Conseillé)',
    badge: 'Standard de Qualité',
    content:
      "Toute vidéo source transmise doit idéalement présenter une résolution native minimale de 1920x1080 à 30 ou 60 fps. Les fichiers compressés via messagerie (ex: WhatsApp) sont déconseillés pour éviter la dégradation du piqué. Pour les extractions en 9:16 vertical, le 4K (3840x2160) est optimal car il permet des recadrages dynamiques sans aucune perte de netteté.",
  },
  {
    icon: HiOutlineClock,
    title: '2. Durées & Matière Première',
    badge: 'Éditorial',
    content:
      "Pour commander une prestation de clipping (lot de 3 à 5 shorts), vos flux vidéo bruts doivent idéalement totaliser au moins 15 à 20 minutes de contenu pertinent. Une durée minimale facilite l'identification de véritables accroches (hooks), des moments de tension et des arcs narratifs exploitables.",
  },
  {
    icon: HiOutlineFilm,
    title: '3. Formats, Codecs & Liens Autorisés',
    badge: 'Spécifications Techniques',
    content:
      "Nous acceptons les conteneurs standards MP4, MOV et MKV encodés en H.264, H.265 ou ProRes. Les transferts s'effectuent via des liens stables : Google Drive, Dropbox, WeTransfer Pro ou lien YouTube/Twitch non répertorié. Les fichiers doivent être hébergés avec les droits d'accès ouverts au téléchargement.",
  },
  {
    icon: HiOutlineNoSymbol,
    title: '4. Gardes-Fous & Éthique de Réalisation',
    badge: 'Éthique & Respect',
    content:
      "Vitali Studio refuse expressément tout projet contenant des propos haineux, discriminatoires, diffamatoires ou trompeurs. Nous nous réservons également le droit de refuser toute source présentant un audio inaudible, saturé ou irrécupérable malgré les traitements de restauration spectrale.",
  },
  {
    icon: HiOutlineTruck,
    title: '5. Délais de Livraison & Décompte',
    badge: 'Ponctualité',
    content:
      "Le délai de livraison officiel (généralement 24h à 48h ouvrées selon le package commandé sur Fiverr) débute exclusivement une fois que l'ensemble des fichiers sources a été validé et téléchargeable. Toute modification des sources envoyées en cours de production réajuste le calendrier convenu.",
  },
  {
    icon: HiOutlineArrowPath,
    title: '6. Politique de Révisions & Ajustements',
    badge: 'Satisfaction Client',
    content:
      "Chaque commande Fiverr inclut un cycle de révisions pour ajuster la musique, les colorations de sous-titres, les animations ou un découpage précis. Les révisions ne permettent toutefois pas un changement complet de la vidéo source ou une réécriture intégrale du brief une fois le premier montage livré.",
  },
];

export default function Charte() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-[#1A1F2B] text-[#8EAFFF] border border-[#8EAFFF]/40 mb-6 shadow-sm">
            <HiOutlineShieldCheck className="w-4 h-4 text-[#8EAFFF]" />
            <span>Engagement d'Excellence & Protection Mutuelle</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F6F8] mb-4">
            Charte Technique & Règlement
          </h1>
          <p className="text-[#D6DCE6] text-base max-w-2xl mx-auto leading-relaxed font-sans">
            Chez Vitali Studio, la rigueur technique est la garantie de livrables fluides, professionnels et percutants pour chaque commande.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="space-y-6 mb-16">
          {RULES.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <div className="p-8 sm:p-10 rounded-2xl border border-[#394150] bg-[#1A1F2B] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] shadow-2xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#394150] text-[#8EAFFF] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-[#F5F6F8]">
                        {rule.title}
                      </h3>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#11151D] text-[#8EAFFF] border border-[#8EAFFF]/30">
                      {rule.badge}
                    </span>
                  </div>
                  <p className="text-[#D6DCE6] text-sm sm:text-base leading-relaxed pl-0 sm:pl-16 font-sans">
                    {rule.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl p-8 sm:p-12 bg-[#1A1F2B] border border-[#394150] text-center flex flex-col items-center shadow-2xl">
          <h3 className="font-display font-bold text-2xl text-[#F5F6F8] mb-3">
            Vos fichiers respectent ces standards ?
          </h3>
          <p className="text-[#D6DCE6] text-sm sm:text-base max-w-xl mx-auto mb-8 font-sans">
            Passez commande directement en toute confiance pour un résultat rapide, soigné et certifié professionnel.
          </p>
          <a
            href="https://www.fiverr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-4 px-8 rounded-xl bg-[#8EAFFF] hover:bg-[#B3CAFF] text-[#0B0D12] font-semibold text-sm transition shadow-lg shadow-[#8EAFFF]/15 active:scale-[0.98]"
          >
            <span>Commander mon montage sur Fiverr</span>
            <HiArrowTopRightOnSquare className="w-4 h-4 text-[#0B0D12]" />
          </a>
        </div>
      </div>
    </div>
  );
}
