import type { PhoneContact } from '../types';
import { buildWhatsAppUrl } from './orderMessage';

export const DEFAULT_WHATSAPP_MESSAGE = 'Hello Meet The Cheese, I have a question about my order.';

/** tel: link. */
export function telHref(phone: PhoneContact): string | undefined {
  return phone.e164 ? `tel:+${phone.e164}` : undefined;
}

/** wa.me link, only for numbers supplied as WhatsApp contacts. */
export function whatsappHref(phone: PhoneContact, message = DEFAULT_WHATSAPP_MESSAGE): string | undefined {
  if (!phone.e164 || !phone.whatsapp) return undefined;
  return buildWhatsAppUrl(phone.e164, message);
}
