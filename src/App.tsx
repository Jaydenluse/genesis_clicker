import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import GalacticCollector from './pages/GalacticCollector';
import UpgradeTree from './pages/UpgradeTree';
import SkillTree from './pages/SkillTree';
import NoScrollWrapper from './components/NoScroll';


const App = () => {
  return (
    <Router>
      <NoScrollWrapper>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<GalacticCollector />} />
            <Route path="/upgrades" element={<UpgradeTree />} />
            <Route path='/knowledge' element={<SkillTree />} />
          </Route>
        </Routes>
      </NoScrollWrapper>
    </Router>
  );
};

export default App;