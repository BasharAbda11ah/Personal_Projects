import { useEffect, useRef } from 'react';
import { BranchProvider } from './context/BranchContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { MenuFilterProvider } from './context/MenuFilterContext';
import { LanguageProvider, useI18n } from './i18n/LanguageContext';
import { useHashRoute, type Route } from './hooks/useHashRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import BranchSelector from './components/BranchSelector';
import CartDrawer from './components/CartDrawer';
import Toaster from './components/Toaster';
import ErrorBoundary from './components/ErrorBoundary';
import DemoBanner from './components/DemoBanner';
import HomePage from './pages/HomePage';
import OrderSummaryPage from './pages/OrderSummaryPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';

const TITLES: Record<Route, { en: string; ar: string }> = {
  home: { en: 'Meet The Cheese — Menu & WhatsApp Ordering | Ajman · Al Zubair · Kalba', ar: 'Meet The Cheese — المنيو والطلب عبر واتساب' },
  summary: { en: 'Order Summary — Meet The Cheese', ar: 'ملخص الطلب — Meet The Cheese' },
  privacy: { en: 'Privacy — Meet The Cheese', ar: 'الخصوصية — Meet The Cheese' },
  'not-found': { en: 'Page not found — Meet The Cheese', ar: 'الصفحة غير موجودة — Meet The Cheese' },
};

function Shell() {
  const route = useHashRoute();
  const { t, lang } = useI18n();

  useEffect(() => {
    document.title = TITLES[route][lang];
  }, [route, lang]);

  // After moving to another page, put keyboard/screen-reader focus at the start of the new content.
  const firstRoute = useRef(true);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [route]);

  return (
    <>
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-cheese focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
      >
        {t('skip')}
      </a>
      <div className="bg-brick flex min-h-dvh flex-col">
        <DemoBanner />
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {/* Keyed by route so moving to another page clears a previous error. */}
          <ErrorBoundary scope="page" key={route}>
            {route === 'home' && <HomePage />}
            {route === 'summary' && <OrderSummaryPage />}
            {route === 'privacy' && <PrivacyPage />}
            {route === 'not-found' && <NotFoundPage />}
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
      <CartDrawer />
      <BranchSelector />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <BranchProvider>
          <CartProvider>
            <MenuFilterProvider>
              <Shell />
            </MenuFilterProvider>
          </CartProvider>
        </BranchProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
