import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiCheck, HiSparkles, HiVideoCamera, HiFire, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import AnimatedSection from '../ui/AnimatedSection';
import SectionTitle from '../ui/SectionTitle';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getServices, getSettings } from '../../utils/api';

const DEFAULT_SERVICES = [
  {
    _id: 'default-1',
    title: 'Clipping IA 9:16 (Shorts/Reels/TikTok)',
    description: 'Extraction intelligente des meilleurs moments de vos flux vidéo longs, restructurés en formats verticaux ultra-captivants.',
    icon: 'HiSparkles',
    features: [
      'Détection IA des hooks & temps forts',
      'Format 9:16 optimisé plein écran',
      'Sous-titres animés style Hormozi / MrBeast',
      'Sound design percutant & B-rolls dynamiques',
      'Export haute fidélité 1080x1920 60fps',
    ],
    ctaLink: 'https://www.fiverr.com',
    ctaText: 'Commander sur Fiverr',
    badge: 'Service Phare',
  },
  {
    _id: 'default-2',
    title: 'Montage Dynamique YouTube (16:9)',
    description: 'Rythme millimétré, rétention maximale et color grading professionnel pour propulser le taux de complétion de vos vidéos.',
    icon: 'HiVideoCamera',
    features: [
      'Dérushage & découpage sans temps mort',
      'Animations graphiques & zooms dynamiques',
      'Mixage audio & mastering voix cristallin',
      'Colorimétrie & étalonnage cinématique',
      'Optimisation pour l\'algorithme YouTube',
    ],
    ctaLink: 'https://www.fiverr.com',
    ctaText: 'Commander sur Fiverr',
  },
  {
    _id: 'default-3',
    title: 'Pack Créateur Mensuel (Clips + Longs)',
    description: 'Déléguez l\'intégralité de votre chaîne de montage pour publier avec une constance implacable et sans friction technique.',
    icon: 'HiFire',
    features: [
      '15 à 30 Shorts/TikTok livrés par mois',
      '2 à 4 vidéos longues 16:9 finalisées',
      'Templates de miniatures & branding sur-mesure',
      'Canal de révision prioritaire direct',
      'Assurance qualité garantie sous 24h',
    ],
    ctaLink: 'https://www.fiverr.com',
    ctaText: 'Commander sur Fiverr',
    badge: 'Tout-en-un',
  },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFiverrUrl, setGlobalFiverrUrl] = useState('https://www.fiverr.com');

  useEffect(() => {
    getSettings().then((data) => {
      if (data?.fiverrUrl) setGlobalFiverrUrl(data.fiverrUrl);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await getServices();
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setServices(data);
          } else {
            setServices(DEFAULT_SERVICES);
          }
        }
      } catch (err) {
        if (isMounted) setServices(DEFAULT_SERVICES);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'HiVideoCamera':
        return <HiVideoCamera className="w-7 h-7 text-white" />;
      case 'HiFire':
        return <HiFire className="w-7 h-7 text-white" />;
      default:
        return <HiSparkles className="w-7 h-7 text-white" />;
    }
  };

  return (
    <AnimatedSection id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-900/60 relative">
      {/* Background flare */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-accent-rose/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle
          title="Services & Offres Dédiées"
          subtitle="Des formules conçues pour maximiser votre visibilité, votre rétention et votre chiffre d'affaires."
          gradient={true}
          className="mb-16"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card p-8 animate-pulse border border-white/5 bg-dark-700/40 rounded-2xl h-96"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {services.map((service, idx) => {
              const isHighlight = idx === 0 || service.badge;
              return (
                <Card
                  key={service._id || idx}
                  className={`p-8 flex flex-col justify-between relative overflow-hidden group ${
                    isHighlight ? 'border-accent-rose/30 bg-dark-700/70 shadow-xl shadow-accent-rose/5' : ''
                  }`}
                >
                  {service.badge && (
                    <div className="absolute top-4 right-4 bg-gradient-accent text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {service.badge}
                    </div>
                  )}

                  <div>
                    {/* Icon container */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center mb-6 shadow-lg shadow-accent-rose/20 group-hover:scale-105 transition-transform duration-300">
                      {renderIcon(service.icon)}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-white mb-3">
                      {service.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features */}
                    {service.features && service.features.length > 0 && (
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-300">
                            <span className="mt-0.5 p-0.5 rounded-full bg-accent-rose/20 text-accent-cyan flex-shrink-0">
                              <HiCheck className="w-4 h-4 text-accent-cyan" />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-white/5">
                    <Button
                      variant={isHighlight ? 'primary' : 'secondary'}
                      href={service.ctaLink || globalFiverrUrl || 'https://www.fiverr.com'}
                      icon={<HiArrowTopRightOnSquare className="w-4 h-4" />}
                      className="w-full justify-center"
                    >
                      {service.ctaText || 'Commander sur Fiverr'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
