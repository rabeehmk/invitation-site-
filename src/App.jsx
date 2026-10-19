import React, { useState, useEffect } from 'react';
import { cleanRoutePayload } from './utils/helpers';
import LandingView from './views/LandingView';
import BuilderView from './views/BuilderView';
import GuestView from './views/GuestView';
import RsvpsView from './views/RsvpsView';

function App() {
  const [route, setRoute] = useState({ path: 'home', data: null });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (!hash || hash === '#' || hash === '#/home' || hash === '#home') {
        setRoute({ path: 'home', data: null });
      } else if (hash.startsWith('#/i/') || hash.startsWith('#i/')) {
        const prefix = hash.startsWith('#/i/') ? '#/i/' : '#i/';
        const data = cleanRoutePayload(hash.slice(prefix.length));
        setRoute({ path: 'guest', data });
      } else if (hash.startsWith('#/studio') || hash.startsWith('#studio')) {
        const queryRel = hash.includes('rel=') ? hash.split('rel=')[1]?.split('&')[0]?.trim() : null;
        setRoute({ path: 'studio', data: queryRel });
      } else if (hash === '#/rsvps' || hash === '#rsvps') {
        setRoute({ path: 'rsvps', data: null });
      } else {
        // Fallback to home
        setRoute({ path: 'home', data: null });
      }
    };

    // Listen for hash change event
    window.addEventListener('hashchange', handleHashChange);
    // Parse route on initial load
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigateTo = (path) => {
    window.location.hash = `#/${path}`;
  };

  // Render the appropriate view based on the parsed route
  switch (route.path) {
    case 'studio':
      return <BuilderView onNavigate={navigateTo} initialReligionId={route.data} />;
    case 'guest':
      return <GuestView data={route.data} />;
    case 'rsvps':
      return <RsvpsView onNavigate={navigateTo} />;
    case 'home':
    default:
      return <LandingView onNavigate={navigateTo} />;
  }
}

export default App;
