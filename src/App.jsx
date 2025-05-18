import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { LiveDetection } from './components/LiveDetection';
import { UploadPage } from './components/UploadPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<LiveDetection />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;