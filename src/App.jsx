import React, { Suspense } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import LoadingOverlay from './components/core/loading-overlay';

const NotFound = React.lazy(() => import('./pages/404-not-found'));
const Sports = React.lazy(() => import('./pages/sports'));

function App() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Navigate to="/sports" />} />
          <Route path="/sports" element={<Sports />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
