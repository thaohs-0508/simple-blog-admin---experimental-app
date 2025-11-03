'use client';
interface GreetingProps {
  name: string;
}
export default function RenderGreeting({ name }: GreetingProps) {
  return <h1 className="text-2xl font-bold">Hello, {name}!</h1>;
}
