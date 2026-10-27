import { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardCopy, MessageCircle, Send } from 'lucide-react';
import { whatsappPhones } from '../data/branches';
import { useToast } from '../context/ToastContext';
import { useI18n } from '../i18n/LanguageContext';
import type { Branch, PhoneContact, ResolvedCartLine } from '../types';
import { buildOrderMessage, buildWhatsAppUrl } from '../utils/orderMessage';
import Modal from './Modal';
import Phone from './Phone';

interface WhatsAppOrderPanelProps {
  branch: Branch;
  lines: ResolvedCartLine[];
  subtotal: number;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Customer-initiated ordering: opens WhatsApp (to the selected branch's verified number) with the
 * full order typed in. Nothing is sent until the customer presses Send inside WhatsApp.
 */
export default function WhatsAppOrderPanel({ branch, lines, subtotal }: WhatsAppOrderPanelProps) {
  const { t, tn } = useI18n();
  const { notify } = useToast();
  const phones = whatsappPhones(branch);
  const [opened, setOpened] = useState(false);
  const [fallback, setFallback] = useState<{ url: string; number: string } | null>(null);
  const empty = lines.length === 0;
  // Always built from the live cart, so the message can never be stale or for another branch.
  const message = buildOrderMessage(branch, lines, subtotal);

  useEffect(() => setOpened(false), [lines, branch]);

  const send = (phone: PhoneContact) => {
    if (empty || !phone.e164) return;
    const url = buildWhatsAppUrl(phone.e164, message);
    const win = window.open(url, '_blank');
    if (!win) {
      setFallback({ url, number: phone.display });
      return;
    }
    try {
      win.opener = null;
    } catch {
      /* cross-origin — fine */
    }
    setOpened(true);
  };

  const copy = async () => {
    const ok = await copyText(message);
    notify(ok ? t('toast.copied') : t('toast.copyFailed'), { tone: ok ? 'success' : 'info' });
  };

  return (
    <section aria-labelledby="send-title" className="frame border-cheese bg-gradient-to-b from-ink-3 to-ink-2 p-5 shadow-xl shadow-flame/10 sm:p-6">
      <h2 id="send-title" className="font-display flex items-center gap-2 text-xl text-cheese">
        <MessageCircle size={22} aria-hidden="true" /> {t('send.title')}
      </h2>
      <p className="mt-2 text-sm text-muted">{t('send.body')}</p>

      {phones.length === 0 ? (
        <p className="mt-4 text-sm text-amber-300">{t('send.noWhatsapp')}</p>
      ) : (
        <div className="mt-4 space-y-2">
          {phones.length > 1 && <p className="text-xs text-muted">{t('send.chooseNumber')}</p>}
          {phones.map((p, i) => (
            <button
              key={p.display}
              type="button"
              disabled={empty}
              onClick={() => send(p)}
              className={`btn min-h-12 w-full text-base ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Send size={18} className="rtl:-scale-x-100" aria-hidden="true" />
              {phones.length > 1 ? (
                <span>{tn('send.buttonTo', { number: <Phone>{p.display}</Phone> })}</span>
              ) : (
                t('send.button')
              )}
            </button>
          ))}
          {empty && <p className="text-xs text-muted">{t('send.empty')}</p>}
        </div>
      )}

      {opened && (
        <p role="status" className="mt-4 flex gap-2 rounded-xl bg-success/10 p-3 text-sm text-cream">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
          {t('send.opened')}
        </p>
      )}

      {!empty && (
        <details className="group mt-4 rounded-xl border border-white/5 bg-ink/60">
          <summary className="cursor-pointer list-none rounded-xl px-3 py-2.5 text-sm font-semibold text-cream/90 hover:text-cheese">
            {t('send.preview')}
          </summary>
          <pre dir="ltr" lang="en" className="max-h-72 overflow-auto px-3 pb-3 font-sans text-xs leading-relaxed whitespace-pre-wrap text-muted">
            {message}
          </pre>
        </details>
      )}

      <button type="button" onClick={copy} disabled={empty} className="btn btn-ghost btn-sm mt-3 w-full">
        <ClipboardCopy size={16} aria-hidden="true" /> {t('summary.copy')}
      </button>

      <Modal open={fallback !== null} onClose={() => setFallback(null)} title={t('send.fallbackTitle')} wide>
        <p>{t('send.fallbackBody', { number: fallback?.number ?? '' })}</p>
        <a
          href={fallback?.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-4 w-full"
          onClick={() => {
            setFallback(null);
            setOpened(true);
          }}
        >
          <MessageCircle size={18} aria-hidden="true" /> {t('send.openLink')}
        </a>
        <label htmlFor="order-message" className="mt-5 block text-sm font-semibold text-cream">
          {t('send.messageLabel')}
        </label>
        <textarea
          id="order-message"
          readOnly
          dir="ltr"
          value={message}
          rows={8}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-2 w-full rounded-xl border border-line bg-ink p-3 font-sans text-xs text-cream"
        />
        <button type="button" onClick={copy} className="btn btn-secondary mt-3 w-full">
          <ClipboardCopy size={16} aria-hidden="true" /> {t('summary.copy')}
        </button>
      </Modal>
    </section>
  );
}
