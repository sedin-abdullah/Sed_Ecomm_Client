import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { useToast } from '@/store/toastStore';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  function onSubmit(values: FormValues) {
    login.mutate(values, {
      onSuccess: () => {
        toast.success('Welcome back!');
        navigate((location.state as { from?: string })?.from ?? '/');
      },
      onError: () => toast.error('Invalid email or password'),
    });
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardBody className="space-y-5">
          <h1 className="text-xl font-semibold">{t('auth.login')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label={t('auth.email') as string} placeholder={t('auth.email_placeholder') as string} error={errors.email?.message} {...register('email')} />
            <Input label={t('auth.password') as string} type="password" error={errors.password?.message} {...register('password')} />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-medium text-brand-500 hover:underline">
                {t('auth.forgot_password')}
              </Link>
            </div>
            <Button type="submit" className="w-full" isLoading={login.isPending}>
              {t('auth.sign_in_cta')}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="font-medium text-brand-500 hover:underline">
              {t('auth.register')}
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
