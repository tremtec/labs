import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";
import { initialLoadTheme } from "#/islands/ThemeSwitcher.tsx";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: initialLoadTheme }} />
      </Head>

      <body class={`bg(gray-100 dark:gray-800) dark:text-gray-100`}>
        <Component />
      </body>
    </html>
  );
}
