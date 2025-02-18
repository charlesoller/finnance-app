import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { v4 } from 'uuid';

export const useSessionId = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sessionId = searchParams.get('sessionId');

  const setSessionId = (newSessionId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('sessionId', newSessionId);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  if (!sessionId) {
    setSessionId(v4());
  }

  return { sessionId };
};
