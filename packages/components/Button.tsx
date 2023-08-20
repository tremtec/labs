import { h } from "preact";
import { cls } from "~/shared/tw.tsx";
import { WithChildren } from "~/shared/types.ts";

export function Button(props: h.JSX.HTMLAttributes<HTMLButtonElement>) {
  const styles = cls(
    props.class,
    "px-2 py-1 border(gray-100 2)",
    "hover:bg-gray-200 dark:hover:bg-gray-900",
  );

  return <button {...props} class={styles} />;
}

export interface ButtonProps extends WithChildren {
  to?: string;
  target?: string;
  class?: string;
}

export function ButtonLink({
  children,
  target,
  to = "#",
  class: className = "",
}: ButtonProps) {
  const composedStyle = `
    uppercase inline-block px-8 py-2 text-sm font-medium transition border border-current
    rounded hover:scale-110 hover:shadow-xl active:opacity-50
    focus:outline-none focus:ring ${className}
  `;
  return (
    <a class={composedStyle} href={to} target={target}>
      {children}
    </a>
  );
}
