import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const Home = lazy(() => import('./pages/Home'));
const Charte = lazy(() => import('./pages/Charte'));
const Cgv = lazy(() => import('./pages/Cgv'));
const Admin = lazy(() => import('./pages/Admin'));

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full bg-gradient-accent opacity-20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-gradient-accent opacity-40 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-accent opacity-60 animate-pulse" />
        </div>
        <span className="gradient-text font-display text-xl font-bold tracking-wider">
          VITALI STUDIO
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
