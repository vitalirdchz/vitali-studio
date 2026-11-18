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
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const RULES = [
  {
    icon: HiOutlineComputerDesktop,
    title: '1. La Règle Inviolable du 1080p (Full HD Minimum)',
    badge: 'Standard de Qualité',
    content:
      "Toute vidéo source transmise doit présenter une résolution native minimale de 1920x1080 à 30 ou 60 fps. Les fichiers enregistrés en 720p ou compressés via messagerie (ex: WhatsApp) seront systématiquement recalés. Pour les extractions en 9:16 vertical, le 4K (3840x2160) est fortement recommandé car il permet des recadrages dynamiques sans aucune perte de piqué.",
  },
  {
    icon: HiOutlineClock,
    title: '2. Durées Minimales & Matière Première',
    badge: 'Éditorial',
    content:
      "Pour commander une prestation de clipping IA (lot de 3 à 5 shorts), vos flux vidéo bruts doivent totaliser au moins 15 à 20 minutes de contenu pertinent. Une durée minimale est indispensable pour que nos modèles et nos monteurs détectent de véritables accroches (hooks), des chutes percutantes et des arcs narratifs exploitables.",
  },
  {
    icon: HiOutlineFilm,
    title: '3. Formats, Codecs & Liens Autorisés',
    badge: 'Spécifications Techniques',
    content:
      "Nous acceptons les conteneurs standards MP4, MOV et MKV encodés en H.264 ou ProRes. Les dépôts doivent s'effectuer via des liens de téléchargement direct stables : Google Drive, Dropbox, WeTransfer Pro ou lien YouTube/Twitch non répertorié. Les fichiers doivent être hébergés avec les droits d'accès ouverts au téléchargement.",
  },
  {
    icon: HiOutlineNoSymbol,
    title: '4. Conditions Strictes de Refus de Projet',
    badge: 'Gardes-Fous Éthiques',
    content:
      "Vitali Studio refuse expressément tout projet contenant des propos haineux, discriminatoires, diffamatoires, trompeurs (arnaques financières, crypto-doutes, contenus d'affiliation agressive) ou portant atteinte aux droits de tiers. Nous nous réservons également le droit de refuser toute source présentant un audio inaudible, saturé ou irrécupérable malgré restauration spectrale.",
  },
  {
    icon: HiOutlineTruck,
    title: '5. Délais de Livraison & Décompte',
    badge: 'Ponctualité',
    content:
      "Le délai de livraison officiel (généralement 24h à 48h ouvrées selon le package commandé sur Fiverr) débute exclusivement une fois que l'ensemble des fichiers sources a été validé et téléchargeable. Toute modification des sources envoyées en cours de production remet à zéro le calendrier convenu.",
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
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-dark-800 min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-accent-rose/10 via-accent-cyan/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-rose/10 text-accent-rose border border-accent-rose/20 mb-6">
            <HiOutlineShieldCheck className="w-4 h-4 text-accent-rose" />
            <span>Engagement d'Excellence & Protection Mutuelle</span>
          </div>
          <SectionTitle
            title="Charte Technique & Règlement"
            subtitle="Chez Vitali Studio, la qualité n'est pas négociable. Cette charte établit les exigences requises pour garantir des rendus d'exception à chaque livraison."
            gradient={true}
          />
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
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Card className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-dark-700/60 shadow-lg hover:border-white/20 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center text-white shadow-md shadow-accent-rose/20 flex-shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                        {rule.title}
                      </h3>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-dark-600 text-accent-cyan border border-accent-cyan/20">
                      {rule.badge}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed pl-0 sm:pl-16 font-sans">
                    {rule.content}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-dark-700 via-dark-700/80 to-dark-600 border border-white/10 text-center flex flex-col items-center">
          <h3 className="font-display font-bold text-2xl text-white mb-3">
            Vos fichiers respectent ces standards ?
          </h3>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Passez commande directement en toute confiance pour un résultat rapide, percutant et certifié professionnel.
          </p>
          <Button
            variant="primary"
            href="https://www.fiverr.com"
            icon={<HiArrowTopRightOnSquare className="w-5 h-5" />}
            className="py-4 px-8 text-base shadow-xl shadow-accent-rose/25"
          >
            Commander mon montage sur Fiverr
          </Button>
        </div>
      </div>
    </div>
  );
}
