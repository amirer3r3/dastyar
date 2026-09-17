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
    <div className="print-hide fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <nav className="mx-auto flex max-w-[392px] items-end justify-around rounded-full bg-card px-2 py-2 shadow-[0_8px_30px_rgba(15,23,42,0.16)] ring-1 ring-black/5">
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
                className="flex flex-1 flex-col items-center"
              >
                <span className="-mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-nav-active text-white shadow-lg shadow-nav-active/40 ring-4 ring-card transition-transform hover:scale-105 active:scale-95">
                  <Icon size={28} />
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 py-1 transition-transform active:scale-95"
            >
              <Icon
                size={22}
                className={isActive ? "text-nav-active" : "text-muted"}
              />
              <span
                className={`text-[11px] ${
                  isActive ? "font-bold text-nav-active" : "text-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
