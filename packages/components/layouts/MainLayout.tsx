import { Meta } from "~/components/Meta.tsx";
import { NavBar } from "~/components/NavBar.tsx";
import { WithChildren } from "~/shared/types.ts";
import { WithUserProfile } from "~/entities/userProfile.ts";

export default function MainLayout(
	props: WithChildren & Partial<WithUserProfile>,
) {
	return (
		<div class="min-h-screen">
			<Meta />
			<NavBar userProfile={props.userProfile} />
			<div class="p-4 mx-auto max-w-screen-md text-center flex flex-col gap-8 items-center">
				{props.children}
			</div>
		</div>
	);
}
