import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import Gear from "~/icon/Gear.tsx";
import Moon from "~/icon/Moon.tsx";
import Sun from "~/icon/Sun.tsx";
import Dots from "~/icon/HDots.tsx";

import { Theme, WithTheme } from "~/shared/types.ts";

export default function ThemeSwitcher(
  { theme = "system" }: Partial<WithTheme>,
) {
  const { selectedTheme, system, toggle } = useTheme(theme);

  return (
    <button
      class="btn btn-circle btn-ghost border-none rounded-full p-2 active:outline-none focus:outline-none"
      disabled={!IS_BROWSER}
      onClick={() => toggle(selectedTheme.value)}
      onContextMenu={(e) => {
        e.preventDefault();
        system();
      }}
    >
      {IS_BROWSER ? iconTheme(selectedTheme.value) : <Dots />}
    </button>
  );
}

function useTheme(theme: Theme) {
  if (!IS_BROWSER) {
    return {
      selectedTheme: { value: "system" as Theme },
      toggle: () => {},
      system: () => {},
    };
  }

  const selectedTheme = useSignal<Theme>(getThemeMode(theme, localStorage));

  const setTheme = (theme: Theme) => {
    if (theme === "system") delete localStorage.theme;
    else localStorage.theme = theme;
    selectedTheme.value = theme;
    applyDocumentClass();
  };

  const toggle = (theme: Theme) => {
    theme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    return setTheme(theme);
  };

  const system = () => setTheme("system");

  return {
    system,
    toggle,
    selectedTheme,
  };
}

const themeIconMap: Record<Theme, JSX.Element> = {
  dark: <Sun />,
  light: <Moon />,
  system: <Gear />,
};

const iconTheme = (theme: Theme) => themeIconMap[theme];

function getThemeMode(prev: Theme, localStorage: Storage): Theme {
  if (!IS_BROWSER) return prev;
  if (localStorage.theme) return localStorage.theme as Theme;
  return "system";
}

function applyDocumentClass() {
  const isDark = localStorage.theme
    ? window.localStorage.theme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList[isDark ? "add" : "remove"]("dark");
}

export const initialLoadTheme = `(${String(applyDocumentClass)})()`;
