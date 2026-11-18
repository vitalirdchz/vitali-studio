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
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';

const CGV_SECTIONS = [
  {
    icon: HiOutlineDocumentText,
    title: 'Article 1 — Objet & Champ d’Application',
    content: `Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des prestations de services numériques conclues entre Vitali Studio (ci-après « le Prestataire ») et tout client particulier ou professionnel (ci-après « le Client »).
    
Vitali Studio propose des services professionnels de montage vidéo, clipping par intelligence artificielle, découpage vertical (Shorts / Reels / TikTok), motion design, sound design et post-production numérique. Toute commande passée implique l'adhésion pleine, entière et sans réserve du Client aux présentes CGV ainsi qu'au respect de la Charte Technique de l'agence.`,
  },
  {
    icon: HiOutlineCreditCard,
    title: 'Article 2 — Modalités de Commande & Paiement Sécurisé',
    content: `Sauf accord contractuel spécifique préalable, les commandes et règlements s'effectuent prioritairement via la plateforme sécurisée Fiverr (tiers de confiance agréé mondialement).
    
En passant commande via Fiverr, le Client bénéficie du système de séquestre bancaire : le montant de la prestation est consigné par la plateforme et n'est débloqué au Prestataire qu'une fois le livrable final réceptionné et validé par le Client. Les devis sur-mesure hors plateforme sont payables à 50% d'acompte à la commande et le solde à la livraison finale sans filigrane.`,
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Article 3 — Fourniture des Fichiers & Charte Technique',
    content: `Le Client s'engage à transmettre des rushes conformes à la Charte Technique officielle de Vitali Studio :
• Résolution native minimale de 1080p (Full HD 1920x1080) à 30 ou 60 fps (4K recommandé).
• Piste audio intelligible, exploitable et synchronisée.
• Liens de téléchargement directs stables (Google Drive, Dropbox, WeTransfer).
    
Le Prestataire se réserve le droit de suspendre ou de refuser tout projet dont les fichiers bruts présentent une qualité visuelle ou sonore insuffisante ne permettant pas de garantir le standard d'excellence du studio.`,
  },
  {
    icon: HiOutlineArrowPath,
    title: 'Article 4 — Délais d’Exécution & Politique de Révisions',
    content: `Le délai indicatif moyen de livraison pour les lots de clipping IA est de 24 à 48 heures ouvrées à compter de la réception effective de l'ensemble des fichiers sources exploitables.
    
Chaque commande standard comprend un cycle de 2 révisions incluses, permettant au Client de demander des ajustements sur le rythme, les sous-titres, les animations ou la musique. Les demandes de révision doivent être formulées dans un délai de 7 jours calendaires suivant la livraison provisoire. Les révisions ne permettent pas de substituer un nouveau fichier source complet à celui fourni initialement.`,
  },
  {
    icon: HiOutlineScale,
    title: 'Article 5 — Propriété Intellectuelle & Droits d’Auteur',
    content: `Le Client garantit être titulaire de l'ensemble des droits de propriété intellectuelle sur les images, voix, logos et musiques qu'il transmet au Prestataire, et dégage Vitali Studio de toute responsabilité en cas de litige de contrefaçon intenté par un tiers.
    
Dès paiement intégral de la commande, Vitali Studio cède au Client, à titre exclusif pour le monde entier et pour toute la durée légale des droits, les droits d'exploitation, de diffusion et de reproduction sur les montages finaux livrés. Vitali Studio se réserve le droit mentionner la réalisation à titre de référence dans son portfolio professionnel, sauf demande écrite contraire du Client.`,
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
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-dark-800 min-h-screen relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-accent-rose/10 via-accent-cyan/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 mb-6">
            <HiOutlineScale className="w-4 h-4 text-accent-cyan" />
            <span>Cadre Juridique & Relations Contractuelles</span>
          </div>
          <SectionTitle
            title="Conditions Générales de Vente"
            subtitle="Transparence, rigueur et protection mutuelle. Consultez les dispositions encadrant nos prestations de montage et de post-production."
            gradient={true}
          />
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
                transition={{ duration: 0.5, delay: idx * 0.06 }}
              >
                <Card className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-dark-700/60 shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center text-white shadow-md shadow-accent-rose/20 flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                      {sec.title}
                    </h3>
                  </div>
                  <div className="text-gray-300 text-sm sm:text-base leading-relaxed pl-0 sm:pl-16 space-y-3 font-sans whitespace-pre-line">
                    {sec.content}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Mentions Légales Box */}
        <Card className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-dark-900/80 text-sm text-gray-400 space-y-3">
          <h4 className="font-display font-bold text-base text-white">
            Mentions Légales & Hébergement
          </h4>
          <p>
            • <strong className="text-gray-300">Éditeur du site :</strong> Vitali Studio — Studio de création vidéo & clipping IA.
          </p>
          <p>
            • <strong className="text-gray-300">Contact :</strong> Via le formulaire officiel de contact ou par email à contact@vitalistudio.com.
          </p>
          <p>
            • <strong className="text-gray-300">Hébergement :</strong> Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA.
          </p>
          <p>
            • <strong className="text-gray-300">Tiers de Paiement :</strong> Fiverr International Ltd., 8 Eliezer Kaplan St., Tel Aviv 6473409, Israël.
          </p>
        </Card>
      </div>
    </div>
  );
}
