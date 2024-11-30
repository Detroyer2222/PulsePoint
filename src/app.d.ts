// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Organization } from "$lib/pulsepointTypes";
import PocketBase, { type AuthModel, type AuthRecord, type RecordModel } from "pocketbase";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase,
			user: AuthRecord,
			organization: Organization
		}
		interface PageData {
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
