<script lang="ts">
	import { enhance } from '$app/forms';
	import { Heading, Hr, Label, Button, Input, Alert, Modal } from 'flowbite-svelte';
	import { InfoCircleSolid, EyeOutline, EyeSlashOutline } from 'flowbite-svelte-icons';
	import type { ActionData, PageData } from './$types';
	import AppInput from '$lib/components/Input.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	$inspect(data, form);

	$effect(() => {
		if (form?.success) {
			emailModalOpen = false;
		}
	});

	let emailModalOpen = $state(false);
</script>

<div class="w-full-h-full flex flex-col space-y-6">
	<Heading tag="h3" class="mt-5 font-medium">Change Email</Heading>
	<Hr />

	<div class="flex w-3/5 flex-col space-y-5">
		<AppInput
			type="email"
			label="Email"
			name="email"
			placeholder=""
			value={data.user?.email}
			errors={form?.errors?.email}
		/>
		{#if form?.emailChanged}
			<Alert color="green">
				<InfoCircleSolid slot="icon" class="h-5 w-5" />
				<span class="font-medium">Email change requested!</span>
				Please check your new Email for confirmation.
			</Alert>
		{/if}
		<Button onclick={() => (emailModalOpen = true)}>Change Your Email</Button>

		<Modal
			bind:open={emailModalOpen}
			size="xs"
			autoclose={false}
			class=""
			title="Change your Email"
		>
			<form class="flex flex-col space-y-6" action="?/updateEmail" method="post" use:enhance>
				<AppInput
					type="email"
					label="Email"
					name="email"
					placeholder="support@pulsepoint.com"
					value={form?.data?.email}
					errors={form?.errors?.email}
				/>
				<Button type="submit" class="w-full">Request Email Change</Button>
			</form>
		</Modal>

		<Heading tag="h3" class="mt-5 font-medium">Change Password</Heading>
		<Hr />
		<form class="flex flex-col space-y-6" action="?/updatePassword" method="post" use:enhance>
			<AppInput
				type="password"
				label="Old Password"
				name="oldPassword"
				placeholder="•••••"
				errors={form?.errors?.oldPassword}
			/>

			<AppInput
				type="password"
				label="New Password"
				name="password"
				placeholder="•••••"
				errors={form?.errors?.password}
			/>

			<AppInput
				type="password"
				label="Confirm New Password"
				name="passwordConfirm"
				placeholder="•••••"
				errors={form?.errors?.passwordConfirm}
			/>

			<Button type="submit">Request Password Change</Button>
		</form>
		<!-- Information that an email with request password was sent -->
	</div>
</div>
