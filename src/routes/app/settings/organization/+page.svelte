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
		Input,
		Select,
		ButtonGroup,
		Checkbox
	} from 'flowbite-svelte';
	import type { ActionData, PageData } from './$types';
	import { applyAction, enhance } from '$app/forms';
	import { getImageUrlFromPocketBase } from '$lib/utils';
	import AppInput from '$lib/components/Input.svelte';
	import { invalidate } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import type { OrganizationMember } from '$lib/pulsepointTypes';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let organizationLogo = $state(data.organization?.logo);
	const showPreview = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		console.log('Showing preview', file);
		if (file) {
			const src = URL.createObjectURL(file);
			const avatar = document.getElementById('organizationAvatar') as HTMLImageElement;
			console.log('Avatar', avatar);
			avatar.src = src;
		}
	};
	let loading = $state(false);

	let updateOrganizationModalOpen = $state(false);

	let pageSize = $state(25);
	let pageSizes = [
		{ value: 10, name: '10' },
		{ value: 25, name: '25' },
		{ value: 50, name: '50' },
		{ value: 100, name: '100' }
	];

	let members: OrganizationMember[] = $state(data.organization?.expand.members ?? []);
	let currentMemberPage = $state(1);
	let totalMemberPages = $derived(Math.ceil(members.length / pageSize));
	let currentMemberPageData = $derived(
		members.slice((currentMemberPage - 1) * pageSize, currentMemberPage * pageSize)
	);
	const previousMember = () => {
		if (currentMemberPage > 1) {
			currentMemberPage--;
		}
	};
	const nextMember = () => {
		if (currentMemberPage < totalMemberPages) {
			currentMemberPage++;
		}
	};
	const memberPageClicked = (page: number) => {
		currentMemberPage = page;
	};

	let admins: OrganizationMember[] = $state(data.organization?.expand.admins ?? []);
	let currentAdminPage = $state(1);
	let totalAdminPages = $derived(Math.ceil(admins.length / pageSize));
	let currentAdminPageData = $derived(
		admins.slice((currentAdminPage - 1) * pageSize, currentAdminPage * pageSize)
	);
	const previousAdmin = () => {
		if (currentMemberPage > 1) {
			currentMemberPage--;
		}
	};
	const nextAdmin = () => {
		if (currentMemberPage < totalMemberPages) {
			currentMemberPage++;
		}
	};
	const adminPageClicked = (page: number) => {
		currentMemberPage = page;
	};

	let adminModalOpen = $state(false);
	let memberSearch = $state('');
	let filteredMembers = $derived(
		members.filter((member) => member.username.toLowerCase().includes(memberSearch.toLowerCase()))
	);
	let selectedUsers: string[] = $state([]);
	const adminSelected = (userId: string) => {
		if (selectedUsers.includes(userId)) {
			selectedUsers = selectedUsers.filter((id) => id !== userId);
		} else {
			selectedUsers.push(userId);
		}
	};

	$effect(() => {
		members = data.organization?.expand.members ?? [];
		admins = data.organization?.expand.admins ?? [];
	});
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

		{#if data.user?.id && (data.organization.owner === data.user.id || data.organization.admins.includes(data.user.id))}
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
									await update();
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
							onchange={showPreview}
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

		<Heading tag="h3" class="mt-5 font-medium">Manage Members</Heading>
		<div>
			<Tabs tabStyle="underline">
				<TabItem title="Members" open={true}>
					<div class="flex w-full flex-col space-y-6">
						<form
							action="?/addMembers"
							method="post"
							class="flex w-full flex-row items-end space-x-6"
							use:enhance
						>
							<div class="flex-1 space-y-2">
								<Label color={form?.errors?.usernames ? 'red' : 'gray'}>Add Members</Label>
								<Input
									type="text"
									name="usernames"
									placeholder="Username, Username, ..."
									value={form?.data?.usernames ?? ''}
									required
									color={form?.errors?.usernames ? 'red' : 'base'}
									class="w-full"
								/>
								{#if form?.errors?.usernames}
									{#each form?.errors?.usernames as error}
										<Helper color="red">{error}</Helper>
									{/each}
								{/if}
							</div>

							<Button type="submit" class="h-[42px] px-4">Add Members</Button>
						</form>
					</div>

					<Table hoverable={true} class="my-3">
						<TableHead>
							<TableHeadCell>Username</TableHeadCell>
							<TableHeadCell><span class="sr-only">Remove</span></TableHeadCell>
						</TableHead>
						<TableBody>
							{#each currentMemberPageData as member}
								<TableBodyRow>
									<TableBodyCell>{member.username}</TableBodyCell>
									<TableBodyCell
										><form
											method="post"
											action="?/removeMember"
											use:enhance={() => {
												return async ({ result, update }) => {
													switch (result.type) {
														case 'success':
															toast.success('Member removed successfully');
															await update();
															break;
														case 'failure':
															if (form?.data?.isOwner) {
																toast.error('Cannot remove owner');
															} else {
																toast.error('Failed to remove admin');
															}
															break;
														case 'error':
															toast.error(result.error.message);
															break;
														default:
															await applyAction(result);
													}
												};
											}}
											class="flex flex-row justify-end"
										>
											<Input type="hidden" name="userId" value={member.id} />
											{#if data.user?.id && (data.organization.owner === data.user?.id || data.organization.admins.includes(data.user.id))}
												<Button type="submit" class="">Remove</Button>
											{/if}
										</form>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
					<div class="flex w-full flex-row items-end justify-between">
						<Label>
							Page Size
							<Select class="mt-2" items={pageSizes} bind:value={pageSize} />
						</Label>

						<div class="mt-3">
							<ButtonGroup>
								<Button
									outline
									disabled={currentMemberPage == 1 ? true : false}
									onclick={previousMember}>Previous</Button
								>
								{#each Array(totalMemberPages)
									.fill(0)
									.map((_, i) => i + 1) as num}
									<Button
										outline
										disabled={currentMemberPage == num ? true : false}
										onclick={() => memberPageClicked(num)}>{num}</Button
									>
								{/each}
								<Button
									outline
									disabled={currentMemberPage == totalMemberPages ? true : false}
									onclick={nextMember}>Next</Button
								>
							</ButtonGroup>
						</div>
					</div>
				</TabItem>
				<TabItem title="Admins">
					<div class="mb-6 mt-3">
						{#if data.user?.id && (data.organization.owner === data.user?.id || data.organization.admins.includes(data.user.id))}
							<Button onclick={() => (adminModalOpen = true)}>Add Admins</Button>
						{/if}

						<Modal
							title="Add Admins"
							bind:open={adminModalOpen}
							size="xs"
							autoclose={false}
							class="w-full"
						>
							<form
								action="?/addAdmins"
								method="post"
								class="flex flex-col space-y-6"
								use:enhance={() => {
									return async ({ result, update }) => {
										switch (result.type) {
											case 'success':
												toast.success('Admin added');
												adminModalOpen = false;
												await update();
												break;
											case 'failure':
												toast.error('Failed to add admin');
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
								<Input type="text" placeholder="Search by Username" bind:value={memberSearch} />
								<Table hoverable={true}>
									<TableHead>
										<TableHeadCell>Select</TableHeadCell>
										<TableHeadCell>Username</TableHeadCell>
									</TableHead>
									<TableBody tableBodyClass="divide-y">
										{#each filteredMembers as member}
											<TableBodyRow>
												<TableBodyCell>
													<Checkbox value={member.id} onclick={() => adminSelected(member.id)}
													></Checkbox>
												</TableBodyCell>
												<TableBodyCell>{member.username}</TableBodyCell>
											</TableBodyRow>
										{/each}
									</TableBody>
								</Table>
								<input type="hidden" name="selectedUsers" value={JSON.stringify(selectedUsers)} />
								<Button
									type="submit"
									class="w-full"
									disabled={selectedUsers.length < 1 ? true : false}>Add</Button
								>
							</form>
						</Modal>
					</div>
					<Table hoverable={true} class="my-3">
						<TableHead>
							<TableHeadCell>Username</TableHeadCell>
							<TableHeadCell><span class="sr-only">Remove</span></TableHeadCell>
						</TableHead>
						<TableBody>
							{#each currentAdminPageData as member}
								<TableBodyRow>
									<TableBodyCell>{member.username}</TableBodyCell>
									<TableBodyCell
										><form
											method="post"
											action="?/removeAdmin"
											use:enhance={() => {
												return async ({ result, update }) => {
													switch (result.type) {
														case 'success':
															toast.success('Admin removed successfully');
															await update();
															break;
														case 'failure':
															if (form?.data?.isOwner) {
																toast.error('Cannot remove owner');
															} else {
																toast.error('Failed to remove admin');
															}
															break;
														case 'error':
															toast.error(result.error.message);
															break;
														default:
															await applyAction(result);
													}
												};
											}}
											class="flex flex-row justify-end"
										>
											<Input type="hidden" name="userId" value={member.id} />
											{#if data.organization.owner === data.user?.id}
												<Button type="submit" class="">Remove</Button>
											{/if}
										</form>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
					<div class="flex w-full flex-row items-end justify-between">
						<Label>
							Page Size
							<Select class="mt-2" items={pageSizes} bind:value={pageSize} />
						</Label>

						<div class="mt-3">
							<ButtonGroup>
								<Button
									outline
									disabled={currentMemberPage == 1 ? true : false}
									onclick={previousAdmin}>Previous</Button
								>
								{#each Array(totalAdminPages)
									.fill(0)
									.map((_, i) => i + 1) as num}
									<Button
										outline
										disabled={currentAdminPage == num ? true : false}
										onclick={() => adminPageClicked(num)}>{num}</Button
									>
								{/each}
								<Button
									outline
									disabled={currentMemberPage == totalMemberPages ? true : false}
									onclick={nextAdmin}>Next</Button
								>
							</ButtonGroup>
						</div>
					</div>
				</TabItem>

				<TabItem title="Owner">
					<Table hoverable={true}>
						<TableHead>
							<TableHeadCell>Username</TableHeadCell>
						</TableHead>
						<TableBody tableBodyClass="divide-y">
							<TableBodyRow>
								<TableBodyCell>{data.organization?.expand?.owner.username}</TableBodyCell>
							</TableBodyRow>
						</TableBody>
					</Table>
				</TabItem>
			</Tabs>
		</div>
		{#if data.organization.owner === data.user?.id}
			<Heading tag="h3" class="mt-5 font-medium" color="text-red-700 dark:text-red-500"
				>Danger Zone</Heading
			>
			<form
				action="?/deleteOrganization"
				method="post"
				class="flex flex-col space-y-6"
				use:enhance={() => {
					return async ({ result }) => {
						switch (result.type) {
							case 'success':
								toast.success('Organization deleted successfully');
								await invalidate('organization');
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
				<Button type="submit" color="red">Delete Organization</Button>
			</form>
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
			<div>
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
			</div>
			<div class="flex flex-row space-x-4">
				<div>
					<Label for="avatar" class="pb-2">
						<span class="label-text">Profile Picture</span>
					</Label>
					<Avatar rounded src={organizationLogo ?? ''} size="xl" id="organizationAvatar"></Avatar>
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
						onchange={showPreview}
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
</div>
