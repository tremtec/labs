import { Handlers, PageProps } from "$fresh/server.ts";
import { Page, Layout } from "$fresh_layout/mod.ts";
import { WithSession } from "$fresh_session/mod.ts";
import { NavBar } from "~/components/NavBar.tsx";
import Meta from "~/components/Meta.tsx";

export type Data = { session: Record<string, string> };

export const handler: Handlers<
  Data,
  WithSession // indicate with Typescript that the session is in the `ctx.state`
> = {
  GET(_req, ctx) {
    // The session is accessible via the `ctx.state`
    const { session } = ctx.state;

    // Access data stored in the session
    session.get("email");
    // Set new value in the session
    session.set("email", "hello@deno.dev");
    // returns `true` if the session has a value with a specific key, else `false`
    session.has("email");
    // clear all the session data
    session.clear();
    // Access all session data value as an object
    session.data;
    // Add flash data which will disappear after accessing it
    session.flash("success", "Successfully flashed a message!");
    // Accessing the flashed data
    // /!\ This flashed data will disappear after accessing it one time.
    session.flash("success");

    return ctx.render({
      session: session.data, // You can pass the whole session data to the page
    });
  },
};

const layout: Layout = (child: Page<Data>, props?: PageProps<Data>) => {
  console.log(props?.data);
  return (
    <div class="dark:bg-black dark:text-white h-screen">
      <Meta />
      <NavBar />
      {child(props)}
    </div>
  );
};

export default layout;
