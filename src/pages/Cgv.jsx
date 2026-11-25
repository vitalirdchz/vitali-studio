import React from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineScale,
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineLockClosed,
} from 'react-icons/hi2';

const CGV_SECTIONS = [
  {
    icon: HiOutlineDocumentText,
    title: 'Article 1 — Objet & Champ d’Application',
    content: `Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des prestations de services numériques conclues entre Vitali Studio (ci-après « le Prestataire ») et tout client particulier ou professionnel (ci-après « le Client »).
    
Vitali Studio propose des services professionnels de montage vidéo, clipping par intelligence artificielle, découpage vertical (Shorts / Reels / TikTok), web scraping et solutions numériques sur-mesure. Toute commande passée implique l'adhésion pleine, entière et sans réserve du Client aux présentes CGV ainsi qu'au respect de la Charte Technique du studio.`,
  },
  {
    icon: HiOutlineCreditCard,
    title: 'Article 2 — Modalités de Commande & Paiement Sécurisé',
    content: `Sauf accord contractuel spécifique préalable, les commandes et règlements s'effectuent prioritairement via la plateforme sécurisée Fiverr (tiers de confiance agréé).
    
En passant commande via Fiverr, le Client bénéficie du système de séquestre bancaire : le montant de la prestation est consigné par la plateforme et n'est débloqué au Prestataire qu'une fois le livrable final réceptionné et validé par le Client. Les prestations sur-mesure hors plateforme font l'objet d'un devis formel validé d'un commun accord.`,
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Article 3 — Fourniture des Fichiers & Charte Technique',
    content: `Le Client s'engage à transmettre des rushes conformes à la Charte Technique officielle de Vitali Studio :
• Résolution native minimale conseillée de 1080p (Full HD 1920x1080) à 30 ou 60 fps (4K recommandé).
• Piste audio intelligible, exploitable et synchronisée.
• Liens de téléchargement directs stables (Google Drive, Dropbox, WeTransfer).
    
Le Prestataire se réserve le droit d'alerter le Client si les fichiers bruts présentent une qualité insuffisante ne permettant pas d'assurer un rendu professionnel optimal.`,
  },
  {
    icon: HiOutlineArrowPath,
    title: 'Article 4 — Délais d’Exécution & Politique de Révisions',
    content: `Le délai indicatif moyen de livraison pour les lots de clipping standard est de 24 à 48 heures ouvrées à compter de la réception effective de l'ensemble des fichiers sources exploitables.
    
Chaque commande standard comprend un cycle de 2 révisions incluses, permettant au Client de demander des ajustements sur le rythme, les sous-titres, les animations ou la musique. Les demandes de révision doivent être formulées dans un délai de 7 jours calendaires suivant la livraison provisoire. Les révisions ne permettent pas de substituer un nouveau fichier source complet à celui fourni initialement.`,
  },
  {
    icon: HiOutlineScale,
    title: 'Article 5 — Propriété Intellectuelle & Droits d’Auteur',
    content: `Le Client garantit être titulaire de l'ensemble des droits de propriété intellectuelle sur les images, voix, logos et musiques qu'il transmet au Prestataire, et dégage Vitali Studio de toute responsabilité en cas de litige de contrefaçon intenté par un tiers.
    
Dès paiement intégral de la commande, Vitali Studio cède au Client, à titre exclusif pour le monde entier et pour toute la durée légale des droits, les droits d'exploitation, de diffusion et de reproduction sur les montages finaux livrés. Vitali Studio se réserve le droit de mentionner la réalisation à titre de référence dans son portfolio professionnel, sauf demande écrite contraire du Client.`,
  },
  {
    icon: HiOutlineLockClosed,
    title: 'Article 6 — Droit de Rétractation & Données Personnelles',
    content: `Conformément à l’article L. 221-28 du Code de la Consommation, le droit de rétractation ne s'applique pas aux contrats de fourniture de contenus numériques et de services nettement personnalisés et confectionnés selon les spécifications uniques du consommateur.
    
Vitali Studio s'engage à respecter la confidentialité la plus stricte concernant les fichiers transmis et les données personnelles collectées (RGPD). Aucune donnée n'est cédée ni commercialisée à des tiers.`,
  },
];

export default function Cgv() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen relative overflow-hidden">
      {/* Halo radial diffus en arrière-plan */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none radial-halo opacity-90 z-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-[#1A1F2B] text-[#8EAFFF] border border-[#8EAFFF]/40 mb-6 shadow-sm">
            <HiOutlineScale className="w-4 h-4 text-[#8EAFFF]" />
            <span>Cadre Juridique & Relations Contractuelles</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F6F8] mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-[#D6DCE6] text-base max-w-2xl mx-auto leading-relaxed font-sans">
            Transparence, rigueur et protection mutuelle. Consultez les dispositions encadrant nos prestations techniques et créatives.
          </p>
        </div>

        {/* Articles */}
        <div className="space-y-6 mb-16">
          {CGV_SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <div className="p-8 sm:p-10 rounded-2xl border border-[#394150] bg-[#1A1F2B] hover:border-[#8EAFFF]/60 hover:bg-[#232A38] shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#11151D] border border-[#394150] text-[#8EAFFF] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#F5F6F8]">
                      {sec.title}
                    </h3>
                  </div>
                  <div className="text-[#D6DCE6] text-sm sm:text-base leading-relaxed pl-0 sm:pl-16 space-y-3 font-sans whitespace-pre-line">
                    {sec.content}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mentions Légales Box */}
        <div className="p-8 sm:p-10 rounded-2xl border border-[#394150] bg-[#1A1F2B] text-sm text-[#B6C0D0] space-y-3 shadow-2xl">
          <h4 className="font-display font-bold text-base text-[#F5F6F8]">
            Mentions Légales & Hébergement
          </h4>
          <p>
            • <strong className="text-[#F5F6F8]">Éditeur du site :</strong> Vitali Studio — Studio digital indépendant (Code, Vidéo & Data).
          </p>
          <p>
            • <strong className="text-[#F5F6F8]">Contact :</strong> Via le formulaire officiel de contact ou par email à vitali.studio.contact@gmail.com.
          </p>
          <p>
            • <strong className="text-[#F5F6F8]">Hébergement :</strong> Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA.
          </p>
          <p>
            • <strong className="text-[#F5F6F8]">Tiers de Paiement :</strong> Fiverr International Ltd., 8 Eliezer Kaplan St., Tel Aviv 6473409, Israël.
          </p>
        </div>
      </div>
    </div>
  );
}
