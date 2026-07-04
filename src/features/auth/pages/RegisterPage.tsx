import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegister } from '@/features/auth/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { useToast } from '@/store/toastStore';

const schema = z
  .object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email(),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const registerUser = useRegister();
  const navigate = useNavigate();
  const toast = useToast();

  function onSubmit(values: FormValues) {
    registerUser.mutate(values, {
      onSuccess: () => {
        toast.success('Account created!');
        navigate('/');
      },
      onError: () => toast.error('Could not create account — email may already be in use'),
    });
  }

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardBody className="space-y-5">
          <h1 className="text-xl font-semibold">{t('auth.register')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label={t('auth.name') as string} placeholder={t('auth.name_placeholder') as string} error={errors.name?.message} {...register('name')} />
            <Input label={t('auth.email') as string} placeholder={t('auth.email_placeholder') as string} error={errors.email?.message} {...register('email')} />
            <Input label={t('auth.password') as string} type="password" error={errors.password?.message} {...register('password')} />
            <Input label={t('auth.confirm_password') as string} type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            <Button type="submit" className="w-full" isLoading={registerUser.isPending}>
              {t('auth.sign_up_cta')}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {t('auth.have_account')}{' '}
            <Link to="/login" className="font-medium text-brand-500 hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
