import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { site } from "#/settings.ts";
import { NavBar } from "~/components/NavBar.tsx";

const headers = (
  <Head>
    <title>{site.title}</title>
    <meta name="description" content={site.description} />
    <meta name="keywords" content={site.keywords} />
  </Head>
);

export default function _app({ Component }: AppProps) {
  return (
    <>
      {headers}
      <NavBar />
      <Component />
    </>
  );
}
