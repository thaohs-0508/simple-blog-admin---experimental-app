import { getDictionary } from '@/app/lib/get-dictionary';
import RegisterForm from './RegisterForm';

interface RegisterPageProps {
  params: Promise<{
    locale: 'en' | 'vi';
  }>;
}

export default async function GetRegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <RegisterForm dictionary={dictionary} locale={locale} />
      </div>
    </div>
  );
}
