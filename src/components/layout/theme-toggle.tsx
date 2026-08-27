"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const themeStorageKey = "emprende-theme";

export function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    document.documentElement.style.colorScheme = nextIsDark ? "dark" : "light";
    localStorage.setItem(themeStorageKey, nextIsDark ? "dark" : "light");
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={mobile ? "lg" : "icon-lg"}
      onClick={toggleTheme}
      aria-label="Cambiar tema de color"
      title="Cambiar tema de color"
      className={cn(
        "group/theme border-primary/15 bg-card/80 hover:border-brand-orange/40 hover:bg-accent",
        mobile && "w-full justify-start px-4",
      )}
    >
      <span className="relative size-4">
        <Moon
          aria-hidden="true"
          className="absolute inset-0 size-4 rotate-0 scale-100 text-primary transition-transform dark:-rotate-90 dark:scale-0"
        />
        <Sun
          aria-hidden="true"
          className="text-brand-orange absolute inset-0 size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
        />
      </span>
      {mobile && "Cambiar tema"}
    </Button>
  );
}
