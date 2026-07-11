"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { bottomNavItems } from "@/app/lib/navigation";

const hiddenRoutes = ["/login", "/register"];

function shouldHideNav(pathname: string): boolean {
  if (hiddenRoutes.includes(pathname)) return true;
  if (/^\/quiz\/[^/]+\/take$/.test(pathname)) return true;
  return false;
}

export default function BottomNav() {
  const pathname = usePathname();

  if (shouldHideNav(pathname)) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-md items-end justify-around border-t border-border bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      {bottomNavItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        if (item.primary) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform active:scale-95">
                <Icon size={26} />
              </span>
              <span className="text-[11px] font-medium text-primary">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1 py-1"
          >
            <Icon
              size={22}
              className={isActive ? "text-primary" : "text-muted"}
            />
            <span
              className={`text-[11px] ${
                isActive ? "font-semibold text-primary" : "text-muted"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
