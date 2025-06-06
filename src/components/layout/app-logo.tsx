import { Building } from 'lucide-react';
import Link from 'next/link';

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
      <Building className="h-7 w-7" />
      <span className="text-xl font-bold font-headline">SafoRoom</span>
    </Link>
  );
}
