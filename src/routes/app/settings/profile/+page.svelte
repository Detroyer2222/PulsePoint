<script lang="ts">
	import {
		Avatar,
		Heading,
		Label,
		Fileupload,
		Helper,
		Input,
		Spinner,
		Hr,
		Modal,
		Button,
		Alert
	} from 'flowbite-svelte';
	import type { PageData, ActionData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { getImageUrlFromPocketBase } from '$lib/utils';
	import { invalidateAll } from '$app/navigation';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import { toast } from 'svelte-sonner';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	$inspect(data, form);

	let loading = $state(false);
	const submitUpdateProfile = () => {
		loading = true;
		/* @ts-ignore */
		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					toast.success('Profile updated successfully');
					await invalidateAll();
					break;
				case 'error':
					toast.error('An error occurred while updating your profile');
					break;
				default:
					await applyAction(result);
			}
			loading = false;
		};
	};

	let userNameModalOpen = $state(false);
	$effect(() => {
		if (form?.success) {
			userNameModalOpen = false;
		}
	});

	const handleAvatarClick = () => {
		const avatarInput = document.getElementById('avatar') as HTMLInputElement;
		avatarInput.click();
	};
	const showPreview = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length > 0) {
			const src = URL.createObjectURL(files[0]);
			const preview = document.getElementById('userAvatar') as HTMLImageElement;
			preview.src = src;
		}
	};
</script>

<div class="w-full-h-full flex flex-col space-y-6">
	<form
		action="?/updateProfile"
		method="post"
		class="flex w-full flex-col space-y-5"
		enctype="multipart/form-data"
		use:enhance={submitUpdateProfile}
	>
		<Heading tag="h3" class="font-medium">Update Profile</Heading>
		<Hr />

		<div class="flex flex-row space-x-4">
			<div>
				<Label for="userAvatar" class="pb-2">
					<span class="label-text">Profile Picture</span>
				</Label>
				<Avatar
					class="cursor-pointer"
					src={getImageUrlFromPocketBase(
						data.user?.collectionId ?? '',
						data.user?.id ?? '',
						data.user?.avatar,
						'36x36'
					) ?? ''}
					size="xl"
					id="userAvatar"
					onclick={handleAvatarClick}
				></Avatar>
			</div>

			<div class="w-2/5 self-end">
				<Label for="avatar" class="pb-2">Upload picture</Label>
				<Fileupload
					id="avatar"
					name="avatar"
					accept="image/*"
					class="w-full"
					disabled={loading}
					onchange={showPreview}
				></Fileupload>
				<Helper class="mt-2">SVG, PNG, JPG (144x144px)</Helper>
			</div>
		</div>

		<Button type="submit" class="w-3/5" disabled={loading}>
			{#if loading}
				<Spinner class="me-3" size="4" color="white" />Loading ...
			{:else}
				Update Profile
			{/if}
		</Button>
	</form>

	<Heading tag="h3" class="mt-5 font-medium">Change Username</Heading>
	<Hr />

	<div class="flex w-3/5 flex-col space-y-5">
		<Label>
			<span class="label-text">Username</span>
			<Input type="text" name="username" value={data.user?.username} disabled />
		</Label>
		{#if form?.usernameExists}
			<Alert color="red">
				<InfoCircleSolid slot="icon" class="h-5 w-5" />
				<span class="font-medium">Username already exists!</span>
				Please choose a different name and try again.
			</Alert>
		{/if}
		<Button onclick={() => (userNameModalOpen = true)}>Change Username</Button>

		<Modal
			bind:open={userNameModalOpen}
			size="xs"
			autoclose={false}
			class=""
			title="Change your Username"
		>
			<form
				class="flex flex-col space-y-6"
				action="?/updateUsername"
				method="post"
				use:enhance={() => {
					return async ({ result, update }) => {
						switch (result.type) {
							case 'success':
								toast.success('Username updated successfully');
								await update();
								break;
							default:
								await applyAction(result);
						}
					};
				}}
			>
				<Label class="space-y-2">
					<span>Enter your new Username</span>
					<Input type="text" name="username" placeholder="name" required />
				</Label>
				<Button type="submit" class="w-full">Change My Username</Button>
			</form>
		</Modal>
	</div>
</div>
