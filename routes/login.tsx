import { defineRoute } from "$fresh/src/server/defines.ts";
import GithubIcon from "~/icon/GitHubIcon.tsx";
import { github } from "#/settings.ts";
import { cookies } from "~/services/github.ts";

export default defineRoute((req) => {
  const url = new URL(req.url);
  const authToken = cookies.getAccessToken(req);
  if (authToken) {
    return Response.redirect(url.origin + "/app");
  }

  return (
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div class="card-body">
          <div class="text-center lg:text-left">
            <h1 class="text-5xl font-bold">
              Login now! 🧪
            </h1>
            <p class="py-6 text-center text-xl">
            </p>
          </div>
          <div class="form-control mt-6">
            <form action={github.signInUrl}>
              <button
                title="login via github"
                class="btn btn-primary"
                type="submit"
              >
                <GithubIcon />
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});
