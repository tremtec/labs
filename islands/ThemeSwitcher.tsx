import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { Button } from "~/components/Button.tsx";
import Moon from "~/icon/Moon.tsx";
import Sun from "~/icon/Sun.tsx";

type Theme = "dark" | "light";

type Props = {
  theme?: Theme;
};

export default function ThemeSwitcher({ theme = "dark" }: Props) {
  const selectedTheme = useSignal<Theme>(theme);
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

const toggleTheme = (theme: Theme): Theme => (theme === "dark" ? "light" : "dark");

const iconTheme = (theme: Theme) => (theme === "dark" ? <Sun /> : <Moon />);
