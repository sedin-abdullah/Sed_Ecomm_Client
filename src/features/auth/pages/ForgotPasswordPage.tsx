import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const forgotPassword = useForgotPassword();

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardBody className="space-y-5">
          <h1 className="text-xl font-semibold">{t('auth.forgot_password')}</h1>
          {forgotPassword.isSuccess ? (
            <p className="text-sm text-muted-foreground">
              If an account exists for <strong>{email}</strong>, we've sent a password reset link (check the server
              console in this demo — email sending is simulated).
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                forgotPassword.mutate(email);
              }}
              className="space-y-4"
            >
              <Input
                label={t('auth.email') as string}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" isLoading={forgotPassword.isPending}>
                {t('auth.reset_password')}
              </Button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="font-medium text-brand-500 hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
