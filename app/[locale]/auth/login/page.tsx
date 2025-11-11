import LoginForm from '@/app/[locale]/auth/login/LoginForm';
import { getDictionary } from '@/app/lib/get-dictionary';

type props = {
  params: Promise<{ locale: 'en' | 'vi' }>;
};
interface LoginPageProps {
  params: Promise<{ locale: 'en' | 'vi' }>;
}

export default async function GetLoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <LoginForm dictionary={dictionary} locale={locale} />
      </div>
    </div>
  );
}
