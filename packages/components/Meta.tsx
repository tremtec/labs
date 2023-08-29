import { Head } from "$fresh/runtime.ts";
import { site } from "#/settings.ts";

export function Meta() {
  return (
    <Head>
      <title>{site.title}</title>

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <meta name="description" content={site.description} />
      <meta name="keywords" content={site.keywords} />

      <DaisyUI />
    </Head>
  );
}

function DaisyUI() {
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/daisyui@3.6.3/dist/full.css"
        rel="stylesheet"
        type="text/css"
      />
      <script src="https://cdn.tailwindcss.com"></script>
    </>
  );
}
