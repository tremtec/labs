import { JSX } from "preact/jsx-runtime";

export type WithChildren = {
  children: JSX.Element;
};

export type Falsy = undefined | false | null;

export type Theme = "dark" | "light";

export type WithTheme = {
  theme: Theme;
};