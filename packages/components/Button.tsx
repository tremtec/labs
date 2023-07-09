import { h } from "preact";
import { cls } from "~/shared/tw.tsx";

export function Button(props: h.JSX.HTMLAttributes<HTMLButtonElement>) {
  const styles = cls(
    props.class,
    "px-2 py-1 border(gray-100 2)",
    "hover:bg-gray-200 dark:hover:bg-gray-900",
  );

  return <button {...props} class={styles} />;
}
