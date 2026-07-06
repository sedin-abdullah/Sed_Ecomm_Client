import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResetPassword } from '@/features/auth/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { useToast } from '@/store/toastStore';

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [password, setPassword] = useState('');
  const resetPassword = useResetPassword();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    resetPassword.mutate(
      { token, password },
      {
        onSuccess: () => {
          toast.success('Password reset — please log in');
          navigate('/login');
        },
        onError: () => toast.error('Reset link is invalid or has expired'),
      },
    );
  }

  return (
    <AuthShell>
      <Card className="w-full max-w-sm">
        <CardBody className="space-y-5">
          <h1 className="text-xl font-semibold">{t('auth.reset_password')}</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label={t('auth.password') as string}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <Button type="submit" className="w-full" isLoading={resetPassword.isPending}>
              {t('auth.reset_password')}
            </Button>
          </form>
        </CardBody>
      </Card>
    </AuthShell>
  );
}
