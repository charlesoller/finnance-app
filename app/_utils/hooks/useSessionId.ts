import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export const useSessionId = () => {
  const params = useParams();
  const router = useRouter();

  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) return;
    
    if (params.sessionId && typeof params.sessionId === 'string') {
      setSessionId(params.sessionId);
    } else {
      const uuid = v4();
      setSessionId(uuid);
      router.replace(`/chat/${uuid}`)
    }
  }, [params, router, sessionId])

  return sessionId;
}