import React from 'react';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Portfolio from '../components/home/Portfolio';
import Creations from '../components/home/Creations';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <Hero />
      <Services />
      <Portfolio />
      <Creations />
      <Testimonials />
      <FAQ />
      <Contact />
    </div>
  );
}
