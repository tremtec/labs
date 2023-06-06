import { Head } from "$fresh/runtime.ts";
import { site } from "#/settings.ts";

export default function Meta() {
  return (
  <Head>
    <title>{site.title}</title>
    <meta name="description" content={site.description} />
    <meta name="keywords" content={site.keywords} />
  </Head>
  )
}
