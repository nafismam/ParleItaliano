import { serverEnv } from '@parle/platform';
import { AuthForm } from '@/components/auth-form';
export default function Page() {
  return <AuthForm mode="sign-up" googleEnabled={Boolean(serverEnv().AUTH_GOOGLE_ID)} />;
}
