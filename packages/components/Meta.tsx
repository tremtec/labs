import { Head } from "$fresh/runtime.ts";
import { site } from "#/settings.ts";

export function Meta() {
  return (
    <Head>
      <title>{site.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={site.description} />
      <meta name="keywords" content={site.keywords} />
    </Head>
  );
}
