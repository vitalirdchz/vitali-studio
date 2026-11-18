import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const LaboPage = lazy(() => import('./pages/LaboPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Charte = lazy(() => import('./pages/Charte'));
const Cgv = lazy(() => import('./pages/Cgv'));
const Admin = lazy(() => import('./pages/Admin'));

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-gray-500 tracking-widest uppercase">
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
          path="/services"
          element={
            <Layout>
              <ServicesPage />
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}
