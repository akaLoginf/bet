"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/props", label: "Props", icon: PropsIcon },
  { href: "/games", label: "Games", icon: GamesIcon },
  { href: "/models", label: "Models", icon: ModelsIcon },
  { href: "/research", label: "Research", icon: ResearchIcon },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        strokeLinejoin="round"
        fill={active ? "rgba(57,255,20,0.15)" : "none"}
      />
    </svg>
  );
}

function PropsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        fill={active ? "rgba(57,255,20,0.15)" : "none"}
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        fill={active ? "rgba(57,255,20,0.15)" : "none"}
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        fill={active ? "rgba(57,255,20,0.15)" : "none"}
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        fill={active ? "rgba(57,255,20,0.15)" : "none"}
      />
    </svg>
  );
}

function GamesIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        fill={active ? "rgba(57,255,20,0.15)" : "none"}
      />
      <path
        d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="1.5"
      />
      <path
        d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="1.5"
      />
      <path d="M3 12H21" stroke={active ? "#39ff14" : "#666"} strokeWidth="1.5" />
    </svg>
  );
}

function ModelsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <polyline
        points="3,17 8,12 13,15 21,7"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polyline
        points="17,7 21,7 21,11"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ResearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={active ? "#39ff14" : "#666"} strokeWidth="2" />
      <path
        d="M20 20L16.65 16.65"
        stroke={active ? "#39ff14" : "#666"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-gray-950/95 backdrop-blur-sm">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors"
            >
              <Icon active={active} />
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? "#39ff14" : "#666" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
