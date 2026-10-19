import { serverEnv } from '@parle/platform';
import { AuthForm } from '@/components/auth-form';
export default function Page() {
  return <AuthForm mode="sign-in" googleEnabled={Boolean(serverEnv().AUTH_GOOGLE_ID)} />;
}
