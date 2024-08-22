import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import GalacticCollector from './pages/GalacticCollector';
import UpgradeTree from './pages/UpgradeTree';
import SkillTree from './pages/SkillTree';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<GalacticCollector />} />
          <Route path="/upgrades" element={<UpgradeTree />} />
          <Route path='/skills' element={<SkillTree />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;