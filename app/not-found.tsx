import Link from "next/link";
import { Button, Card } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-5 py-24">
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <span className="font-display text-signal-dim text-4xl font-700">404</span>
        <h1 className="font-display text-lg font-600">Page not found</h1>
        <p className="text-dim text-sm">That route doesn&apos;t exist.</p>
        <Link href="/" className="mt-2">
          <Button>Back home</Button>
        </Link>
      </Card>
    </main>
  );
}
