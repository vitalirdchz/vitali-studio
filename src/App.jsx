import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import GlobalAmbientBackground from './components/ui/GlobalAmbientBackground';
import CookieBanner from './components/ui/CookieBanner';

const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ClippingServicePage = lazy(() => import('./pages/ClippingServicePage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const LaboPage = lazy(() => import('./pages/LaboPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Charte = lazy(() => import('./pages/Charte'));
const Cgv = lazy(() => import('./pages/Cgv'));
const Admin = lazy(() => import('./pages/Admin'));

function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#0B0D12] text-[#D6DCE6] flex flex-col justify-between selection:bg-[#8EAFFF]/25 selection:text-[#F5F6F8]">
      <GlobalAmbientBackground />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0B0D12] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#8EAFFF] border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-[#B6C0D0] tracking-widest uppercase">
          VITALI STUDIO // CHARGEMENT
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/a-propos"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <ServicesPage />
            </Layout>
          }
        />
        <Route
          path="/services/clipping"
          element={
            <Layout>
              <ClippingServicePage />
            </Layout>
          }
        />
        <Route
          path="/portfolio"
          element={
            <Layout>
              <PortfolioPage />
            </Layout>
          }
        />
        <Route
          path="/labo"
          element={
            <Layout>
              <LaboPage />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactPage />
            </Layout>
          }
        />
        <Route
          path="/charte"
          element={
            <Layout>
              <Charte />
            </Layout>
          }
        />
        <Route
          path="/cgv"
          element={
            <Layout>
              <Cgv />
            </Layout>
          }
        />
        <Route path="/studio-panel-v" element={<Admin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}
