import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted fonts (no third-party font requests). Only the subsets a page needs are downloaded.
import '@fontsource/alfa-slab-one/400.css';
import '@fontsource-variable/dm-sans/wght.css';
import '@fontsource-variable/cairo/wght.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary scope="app">
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
