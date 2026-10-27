import { Component, type ErrorInfo, type ReactNode } from 'react';
import { STORAGE_KEYS, readJSON, removeKey } from '../utils/storage';

interface Props {
  children: ReactNode;
  /** "page" keeps the header/footer around it; "app" is the last-resort full-screen fallback. */
  scope: 'page' | 'app';
}

interface State {
  error: Error | null;
}

/**
 * Shows a helpful message instead of a blank page if a component crashes unexpectedly.
 * The error is still logged to the console (nothing is hidden), and there is no automatic retry.
 * Text is built in (not from the i18n context) so it works even if the providers themselves fail.
 */
const TEXT = {
  en: {
    title: 'Something went wrong',
    body: 'Sorry, this part of the page couldn’t load. Your cart and branch are still saved on this device.',
    reload: 'Reload page',
    home: 'Back to Home',
    reset: 'Still not working? Clear saved data on this device',
  },
  ar: {
    title: 'حدث خطأ ما',
    body: 'عذرًا، تعذّر تحميل هذا الجزء من الصفحة. سلتك والفرع المختار ما زالا محفوظين على هذا الجهاز.',
    reload: 'إعادة تحميل الصفحة',
    home: 'العودة إلى الرئيسية',
    reset: 'ما زالت المشكلة قائمة؟ احذف البيانات المحفوظة على هذا الجهاز',
  },
} as const;

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Meet The Cheese] Unexpected error:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    // A crash during the first render can happen before <html lang> is set, so also check the saved choice.
    const isArabic = document.documentElement.lang === 'ar' || readJSON<string>(STORAGE_KEYS.lang) === 'ar';
    const text = isArabic ? TEXT.ar : TEXT.en;
    const full = this.props.scope === 'app';

    return (
      <div role="alert" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'} className={`flex flex-col items-center px-4 text-center ${full ? 'min-h-dvh justify-center bg-ink' : 'py-24'}`}>
        <img src="/images/brand/logo-480.png" alt="" aria-hidden="true" width={480} height={457} className="h-20 w-auto opacity-90" />
        <h1 className="font-display mt-6 text-3xl text-cream">{text.title}</h1>
        <p className="mt-3 max-w-md text-muted">{text.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            {text.reload}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              window.location.hash = '/';
              this.setState({ error: null });
            }}
          >
            {text.home}
          </button>
        </div>
        <button
          type="button"
          className="mt-6 text-sm text-muted underline underline-offset-4 hover:text-cheese"
          onClick={() => {
            Object.values(STORAGE_KEYS).forEach(removeKey);
            window.location.hash = '/';
            window.location.reload();
          }}
        >
          {text.reset}
        </button>
      </div>
    );
  }
}
