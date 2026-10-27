import { MessageCircle, Phone as PhoneIcon } from 'lucide-react';
import { useI18n } from '../i18n/LanguageContext';
import type { Branch } from '../types';
import { DEFAULT_WHATSAPP_MESSAGE, telHref, whatsappHref } from '../utils/contact';
import Phone from './Phone';

interface ContactButtonsProps {
  branch: Branch;
  /** Prefilled WhatsApp message. */
  message?: string;
  compact?: boolean;
}

/**
 * One row per supplied number with Call (tel:) and WhatsApp (wa.me) links.
 */
export default function ContactButtons({ branch, message = DEFAULT_WHATSAPP_MESSAGE, compact }: ContactButtonsProps) {
  const { t } = useI18n();
  return (
    <ul className="space-y-3">
      {branch.phones.map((phone) => {
        const tel = telHref(phone);
        const wa = whatsappHref(phone, message);
        return (
          <li key={phone.display} className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="min-w-0 flex-1 basis-36">
              <div className="text-xs font-medium tracking-wide text-muted uppercase">{t(`phone.${phone.label}`)}</div>
              <Phone className="font-bold text-cream">{phone.display}</Phone>
            </div>
            <div className="flex gap-2">
              {tel && (
                <a href={tel} className={`btn btn-secondary ${compact ? 'btn-sm' : ''}`} aria-label={t('phone.callAria', { number: phone.display })}>
                  <PhoneIcon size={16} aria-hidden="true" /> {t('phone.call')}
                </a>
              )}
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-secondary ${compact ? 'btn-sm' : ''}`}
                  aria-label={t('phone.whatsappAria', { number: phone.display })}
                >
                  <MessageCircle size={16} aria-hidden="true" /> {t('phone.whatsapp')}
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
