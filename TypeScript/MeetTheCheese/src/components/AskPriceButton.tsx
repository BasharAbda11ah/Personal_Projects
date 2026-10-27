import { MessageCircle } from 'lucide-react';
import { whatsappPhones } from '../data/branches';
import { useBranch } from '../context/BranchContext';
import { useI18n } from '../i18n/LanguageContext';
import { whatsappHref } from '../utils/contact';

/** For items whose price could not be read: ask the selected branch on WhatsApp instead of adding to cart. */
export default function AskPriceButton({ productName, small }: { productName: string; small?: boolean }) {
  const { branch } = useBranch();
  const { t } = useI18n();
  const phone = branch && whatsappPhones(branch)[0];
  const href = phone && whatsappHref(phone, `Hello Meet The Cheese, what is the price of ${productName}?`);
  if (!href) return <p className="text-center text-xs text-muted">{t('product.priceNotConfirmed')}</p>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-secondary w-full ${small ? 'btn-sm' : ''}`}
      aria-label={t('product.askPriceAria', { name: productName })}
    >
      <MessageCircle size={16} aria-hidden="true" /> {t('product.askPrice')}
    </a>
  );
}
