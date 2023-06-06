import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { site } from "#/settings.ts";
import { NavBar } from "~/components/NavBar.tsx";
import { Page, Layout } from "$fresh_layout/mod.ts";

const headers = (
  <Head>
    <title>{site.title}</title>
    <meta name="description" content={site.description} />
    <meta name="keywords" content={site.keywords} />
  </Head>
);

const layout: Layout = (child: Page, props?: PageProps) => {
  console.log({ props, child })
  return (
    <div class="dark:bg-black dark:text-white h-screen">
      {headers}
      <NavBar />
      {child(props)}
    </div>
  );
};

export default layout
