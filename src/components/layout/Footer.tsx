import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { useToast } from '@/store/toastStore';

export function Footer() {
  const { t } = useTranslation();
  const toast = useToast();
  const [email, setEmail] = useState('');

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success(t('footer.subscribe') as string);
    setEmail('');
  }

  return (
    <footer className="mt-16 border-t border-border bg-surface pb-24 pt-12 lg:pb-12">
      <Reveal variant="up" className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-xl font-bold tracking-tight text-foreground">
            Sed<span className="text-brand-500">_</span>Ecomm
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t('app.tagline')}</p>
          <form onSubmit={subscribe} className="mt-5 max-w-sm">
            <p className="mb-2 text-sm font-semibold text-foreground">{t('footer.newsletter_title')}</p>
            <p className="mb-3 text-xs text-muted-foreground">{t('footer.newsletter_subtitle')}</p>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter_placeholder') ?? ''}
              />
              <Button type="submit">{t('footer.subscribe')}</Button>
            </div>
          </form>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">{t('footer.about_title')}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t('footer.about_us')}</li>
            <li>{t('footer.careers')}</li>
            <li>{t('footer.press')}</li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">{t('footer.help_title')}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t('footer.help_center')}</li>
            <li>{t('footer.shipping_returns')}</li>
            <li>{t('footer.track_order')}</li>
            <li>{t('footer.contact_us')}</li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">{t('footer.legal_title')}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t('footer.terms')}</li>
            <li>{t('footer.privacy')}</li>
            <li>{t('footer.cookies')}</li>
          </ul>
        </div>
      </Reveal>

      <div className="container mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
        {t('footer.rights', { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
