import { Suspense } from 'react';
import Chat from '../../_components/Chat/Chat';
import { Loader } from '@mantine/core';

export default function ChatPage() {
  return (
    <Suspense fallback={<Loader color="green" />}>
      <Chat />
    </Suspense>
  );
}
