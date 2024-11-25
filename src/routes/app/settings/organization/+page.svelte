<script lang="ts">
	import {
		Heading,
		Hr,
		Label,
		Avatar,
		Fileupload,
		Helper,
		Button,
		P,
		Modal,
		Textarea,
		Tabs,
		TabItem,
		TableHeadCell,
		Table,
		TableHead,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		Input
	} from 'flowbite-svelte';
	import type { ActionData, PageData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { getImageUrlFromPocketBase } from '$lib/utils';
	import AppInput from '$lib/components/Input.svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import type { OrganizationMember } from '$lib/pulepointTypes';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let organizationLogo = $state(data.organization?.logo);
	let organizationMembers = $state<OrganizationMember[]>(data.organization?.expand.members);
	let organizationAdmins = $state<OrganizationMember[]>(data.organization?.expand.admins);
	let organization = $state(data.organization);
	let loading = $state(false);

	$inspect({ organizationAdmins, organizationMembers });

	let updateOrganizationModalOpen = $state(false);
</script>

<div class="flex h-full w-full flex-col space-y-6">
	{#if data.organization}
		<Heading tag="h3" class="mt-5 font-medium">Your Organization</Heading>
		<div class="flex flex-row items-start gap-x-6">
			<Avatar
				rounded
				src={organizationLogo
					? getImageUrlFromPocketBase(
							data.organization?.collectionId ?? '',
							data.organization?.id ?? '',
							data.organization?.logo,
							'36x36'
						)
					: ''}
				size="xl"
			/>
			<div class="flex flex-col">
				<Heading tag="h4" class="font-medium text-gray-800 dark:text-gray-200">
					{data.organization.name}
				</Heading>
				<P color="text-gray-500 dark:text-gray-400">
					{data.organization.description}
				</P>
			</div>
		</div>

		{#if data.organization.owner === data.user?.id || data.organization.admins.includes(data.user?.id)}
			<Button onclick={() => (updateOrganizationModalOpen = true)} class="w-2/4"
				>Update Organization</Button
			>
			<Modal
				bind:open={updateOrganizationModalOpen}
				title="Update Organization"
				size="xs"
				class="w-full"
				autoclose={false}
			>
				<form
					class="flex flex-col space-y-6"
					method="post"
					action="?/updateOrganization"
					enctype="multipart/form-data"
					use:enhance={() => {
						return async ({ result, update }) => {
							switch (result.type) {
								case 'success':
									toast.success('Organization updated successfully');
									await invalidateAll();
									updateOrganizationModalOpen = false;
									break;
								case 'error':
									toast.error(result.error.message);
									break;
								default:
									await applyAction(result);
							}
						};
					}}
				>
					<div>
						<Label class="mb-2" color={form?.errors?.description ? 'red' : 'gray'}
							>Organization Description</Label
						>
						<Textarea
							id="description"
							name="description"
							placeholder="Your Description"
							rows={3}
							value={form?.data?.description
								? form?.data?.description
								: data.organization.description}
							color={form?.errors?.description ? 'red' : 'base'}
						/>
						{#if form?.errors?.description}
							{#each form?.errors?.description as error}
								<Helper class="mt-2" color="red">{error}</Helper>
							{/each}
						{/if}
					</div>
					<div>
						<Label class="pb-2" color={form?.errors?.logo ? 'red' : 'gray'}
							>Upload Organization Logo</Label
						>
						<Fileupload
							id="logo"
							name="logo"
							accept="image/*"
							class="w-full"
							disabled={loading}
							color={form?.errors?.logo ? 'red' : 'base'}
						></Fileupload>
						<Helper class="mt-2">SVG, PNG, JPG (144x144px)</Helper>
						{#if form?.errors?.logo}
							{#each form?.errors?.logo as error}
								<Helper class="mt-2" color="red">{error}</Helper>
							{/each}
						{/if}
					</div>
					<Button type="submit" class="w-full">Update Organization</Button>
				</form>
			</Modal>
		{/if}
	{:else}
		<Heading tag="h3" class="mt-5 font-medium">Create your Organization</Heading>
		<Hr />
		<form
			class="flex flex-col space-y-6"
			method="post"
			action="?/createOrganization"
			enctype="multipart/form-data"
			use:enhance
		>
			<AppInput
				type="text"
				label="Organization Name"
				name="name"
				placeholder="PulsePoint"
				value={form?.data?.name}
				errors={form?.errors?.name}
			/>
			<Label for="description" class="mb-2" color={form?.errors?.description ? 'red' : 'gray'}
				>Organization Description</Label
			>
			<Textarea
				id="description"
				name="description"
				placeholder="Your Description"
				rows={3}
				value={form?.data?.description}
				color={form?.errors?.description ? 'red' : 'base'}
			/>
			{#if form?.errors?.description}
				{#each form?.errors?.description as error}
					<Helper class="mt-2" color="red">{error}</Helper>
				{/each}
			{/if}
			<AppInput
				type="text"
				label="Organization Description"
				name="description"
				placeholder="Your Description"
				value={form?.data?.description}
				errors={form?.errors?.description}
			/>
			<div class="flex flex-row space-x-4">
				<div>
					<Label for="avatar" class="pb-2">
						<span class="label-text">Profile Picture</span>
					</Label>
					<Avatar
						rounded
						src={organizationLogo
							? getImageUrlFromPocketBase(
									data.organization?.collectionId ?? '',
									data.organization?.id ?? '',
									data.organization?.logo,
									'36x36'
								)
							: ''}
						size="xl"
					></Avatar>
				</div>

				<div class="w-2/5 self-end">
					<Label for="logo" class="pb-2" color={form?.errors?.logo ? 'red' : 'gray'}
						>Upload Organization Logo</Label
					>
					<Fileupload
						id="logo"
						name="logo"
						accept="image/*"
						class="w-full"
						disabled={loading}
						color={form?.errors?.logo ? 'red' : 'base'}
					></Fileupload>
					<Helper class="mt-2">SVG, PNG, JPG (144x144px)</Helper>
					{#if form?.errors?.logo}
						{#each form?.errors?.logo as error}
							<Helper class="mt-2" color="red">{error}</Helper>
						{/each}
					{/if}
				</div>
			</div>
			<Button type="submit" class="w-full">Create Organization</Button>
		</form>
	{/if}

	<Heading tag="h3" class="mt-5 font-medium">Manage Organization</Heading>
	<div>
		<Tabs tabStyle="underline">
			<TabItem title="Members" open={true}>
				<div class="flex-column flex space-y-6">
					<form action="?/addMembers" method="post" class="flex flex-row space-x-6" use:enhance>
						<AppInput
							type="text"
							label="Add Member/s"
							name="usernames"
							placeholder="Username; Username; Username"
							value={form?.data?.usernames}
							errors={form?.errors?.usernames}
						/>
						<Button type="submit" class="">Add Members</Button>
					</form>
				</div>

				<Heading tag="h3" class="mt-5 font-medium" color="white">Data Organization</Heading>
				{#each data.organization.expand.members as item}
					<!-- content here -->
					<Heading tag="h3" class="mt-5 font-medium" color="white">{item.username}</Heading>
				{/each}
				<Heading tag="h3" class="mt-5 font-medium" color="white">OrganizationMembers</Heading>
				{#each organizationMembers as item}
					<!-- content here -->
					<Heading tag="h3" class="mt-5 font-medium" color="white">{item.username}</Heading>
				{/each}
				<Table items={data.organization.expand.members} hoverable={true}>
					<TableHead>
						<TableHeadCell>Username</TableHeadCell>
						<TableHeadCell><span class="sr-only">Remove</span></TableHeadCell>
					</TableHead>
					<TableBody tableBodyClass="divide-y">
						<TableBodyRow slot="row" let:item>
							<TableBodyCell>{(item as OrganizationMember).username}</TableBodyCell>
							<TableBodyCell>
								<form
									method="post"
									action="?/removeMember"
									use:enhance={() => {
										return async ({ result, update }) => {
											if (result.type === 'success') {
												toast.success('Member removed successfully');
												await update();
											} else {
												await applyAction(result);
											}
										};
									}}
									class="flex flex-row justify-end"
								>
									<Input type="hidden" name="userId" value={(item as OrganizationMember).id} />
									<Button type="submit" class="">Remove</Button>
								</form>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
			</TabItem>
			<TabItem title="Admins">
				<Table items={organizationAdmins} hoverable={true}>
					<TableHead>
						<TableHeadCell>Username</TableHeadCell>
						<TableHeadCell><span class="sr-only">Remove</span></TableHeadCell>
					</TableHead>
					<TableBody tableBodyClass="divide-y">
						<TableBodyRow slot="row" let:item>
							<TableBodyCell>{(item as OrganizationMember).username}</TableBodyCell>
							<TableBodyCell>
								<form
									method="post"
									action="?/removeAdmin"
									use:enhance
									class="flex flex-row justify-end"
								>
									<Input type="hidden" name="userId" value={(item as OrganizationMember).id} />

									<Button type="submit" class="">Remove</Button>
								</form>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
			</TabItem>

			<TabItem title="Owner">
				<Table hoverable={true}>
					<TableHead>
						<TableHeadCell>Username</TableHeadCell>
					</TableHead>
					<TableBody tableBodyClass="divide-y">
						<TableBodyRow>
							<TableBodyCell>{data.organization.owner.username}</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
			</TabItem>
		</Tabs>
	</div>
</div>
