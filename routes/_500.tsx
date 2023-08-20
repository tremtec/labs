import { ErrorPageProps } from "$fresh/server.ts";
import { ButtonLink } from "~/components/Button.tsx";
import ErrorPage from "~/components/ErrorPage.tsx";

export default function InternalErrorPage({ error }: ErrorPageProps) {
  return (
    <ErrorPage
      code={500}
      title="Internal server error"
      description={`An error occured: ${error}`}
    >
      <ButtonLink to="/" class="border-pink-500 text-pink-500">
        Go Home
      </ButtonLink>
    </ErrorPage>
  );
}
