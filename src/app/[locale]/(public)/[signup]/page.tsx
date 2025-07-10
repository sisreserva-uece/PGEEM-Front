import { SignupForm } from '@/features/auth/components/signUpForm';

export default async function SignupPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <SignupForm />
      </div>
    </div>
  );
}
