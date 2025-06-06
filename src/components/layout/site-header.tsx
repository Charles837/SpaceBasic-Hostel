import { AppLogo } from "@/components/layout/app-logo";
import { UserNav } from "@/components/layout/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface SiteHeaderProps {
  showLogoOnMobile?: boolean;
}

export function SiteHeader({ showLogoOnMobile = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
        <div className="mr-4 hidden md:flex">
          <AppLogo />
        </div>
        
        <div className="flex items-center md:hidden">
          <SidebarTrigger className="mr-2" />
          {showLogoOnMobile && <AppLogo />}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {/* Add any header navigation items here if needed */}
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}
