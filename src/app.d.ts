// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Organization } from "$lib/pulepointTypes";
import PocketBase, { type AuthModel, type AuthRecord, type RecordModel } from "pocketbase";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase,
			user: AuthRecord,
			organization: RecordModel<Organization>
		}
		interface PageData {
			organization: RecordModel<Organization>
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
