import { SignInForm } from '@/features/auth/components/signInForm';

export default async function SigninPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <SignInForm />
      </div>
    </div>
  );
}
