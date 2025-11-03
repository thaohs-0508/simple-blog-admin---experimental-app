import Image from 'next/image';
import Greeting from './components/Greeting';

export default function RenderHome() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Blog Admin</h1>
      <Image
        src="/sample.png"
        alt="Sample Image"
        width={600}
        height={400}
        className="mb-4"
      />
      <Greeting name="Admin User" />
    </main>
  );
}
