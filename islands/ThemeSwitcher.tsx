import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Button } from "~/components/Button.tsx";
import Sun from "../packages/icon/Sun.tsx";
import Moon from "../packages/icon/Moon.tsx";

type Theme = "dark" | "light";

const selectedTheme = signal<Theme>(localStorage.theme ?? "dark");
const toggleTheme = (theme: Theme): Theme => (theme === "dark" ? "light" : "dark");
const iconTheme = (theme: Theme) => (theme === "dark" ? <Sun /> : <Moon />);

selectedTheme.subscribe((theme) => {
  localStorage.theme = theme;
});

export default function ThemeSwitcher() {
  const toggledTheme = toggleTheme(selectedTheme.value);
  const handleClick = () => {
    selectedTheme.value = toggledTheme;
  };

  useEffect(
    () =>
      selectedTheme.subscribe((theme) => {
        // Change document theme
        document.body.classList.remove(toggleTheme(theme));
        document.body.classList.add(theme);
      }),
    []
  );

  return (
    <Button
      onClick={handleClick}
      class="border-none rounded-full p-2 active:outline-none focus:outline-none"
    >
      {iconTheme(selectedTheme.value)}
    </Button>
  );
}
