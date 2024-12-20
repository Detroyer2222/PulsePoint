<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Fileupload,
		Heading,
		Helper,
		Input,
		Label,
		Modal,
		NumberInput,
		P,
		Popover,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Textarea
	} from 'flowbite-svelte';
	import type { ActionData, PageData } from './$types';
	import { getImageUrlFromPocketBase } from '$lib/utils';
	import placeholder from '$lib/assets/outpost_placeholder.webp';
	import AppInput from '$lib/components/Input.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { OutpostCommodity } from '$lib/pulsepointTypes';
	import BadgeFilter from '$lib/components/BadgeFilter.svelte';
	import { ArrowDownOutline, ArrowUpDownOutline, ArrowUpOutline } from 'flowbite-svelte-icons';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let imageChanged = $state(false);
	let inputImage = $state<FileList | undefined>(undefined);

	// Function to handle image click
	const handleImageClick = () => {
		const outpostImageCardInput = document.getElementById(
			'outpostImageCardInput'
		) as HTMLInputElement;
		outpostImageCardInput.click();
	};

	// Function to handle file selection
	const showPreview = (event: Event) => {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (files && files.length > 0) {
			const src = URL.createObjectURL(files[0]);
			const preview = document.getElementById('outpostImage') as HTMLImageElement;
			preview.src = src;
			imageChanged = true;
		}
	};

	let updateOutpostModalOpen = $state(false);

	const outpostCommodities = $state<OutpostCommodity[]>(data.outpostCommodities);
	let selectedFilter = $state<string[]>([]);
	const filteredCommodities = $derived<OutpostCommodity[]>(
		outpostCommodities.filter(
			(commodity) =>
				selectedFilter.length === 0 ||
				(commodity?.expand?.commodity?.type &&
					selectedFilter.includes(commodity.expand.commodity.type))
		)
	);

	let commoditySorting = $state({ column: 'commodity', direction: 'asc' });

	const toggleSorting = (column: string) => {
		if (commoditySorting.column === column) {
			commoditySorting.direction = commoditySorting.direction === 'asc' ? 'desc' : 'asc';
		} else {
			commoditySorting.column = column;
			commoditySorting.direction = 'asc';
		}
	};

	let sortedCommodities = $derived<OutpostCommodity[]>(
		filteredCommodities.toSorted((a, b) => {
			const { column, direction } = commoditySorting;
			const multiplier = direction === 'asc' ? 1 : -1;

			switch (column) {
				case 'commodity':
					if (a.expand?.commodity?.name && b.expand?.commodity?.name) {
						return multiplier * a.expand.commodity.name.localeCompare(b.expand.commodity.name);
					}
					return 0;

				case 'type':
					if (a.expand?.commodity?.type && b.expand?.commodity?.type) {
						return multiplier * a.expand.commodity.type.localeCompare(b.expand.commodity.type);
					}
					return 0;

				case 'quantity':
					return multiplier * a.quantity - b.quantity;
				default:
					return 0;
			}
		})
	);

	let requestCommodityModalOpen = $state(false);
	let selectedCommodity = $state<string>('');

	const onCommodityRequestedClicked = (commodityId: string) => {
		selectedCommodity = commodityId;
		requestCommodityModalOpen = true;
	};

	$inspect(data.outpostCommodities);
</script>

<div class="flex h-full w-full flex-col space-y-6 px-8 pt-4">
	<form
		method="post"
		action="?/updateOutpost"
		enctype="multipart/form-data"
		class="flex flex-row justify-between"
		use:enhance={() => {
			return async ({ result, update }) => {
				switch (result.type) {
					case 'success':
						toast.success('Outpost updated');
						updateOutpostModalOpen = false;

						await update();
						break;
					case 'failure':
						if (form?.errors?.image) {
							toast.error('Image size is too large. Try uploading as .webp');
						} else {
							toast.error('Failed to update outpost');
						}
						break;
					case 'error':
						toast.error(result.error.message);
						break;
					default:
						await applyAction(result);
				}
				imageChanged = false;
				inputImage = undefined;
			};
		}}
	>
		<input type="hidden" name="outpostId" value={data.outpost.id} />
		<div class="flex flex-col justify-between">
			<div class="flex flex-col space-y-4">
				<Heading tag="h2">{data.outpost.name}</Heading>
				<Heading tag="h3" color="text-rose-600">{data.outpost.code}</Heading>
				<P class="max-w-md break-words dark:text-gray-400">{data.outpost.description}</P>
			</div>
			<!--Possible optimization when the value is a $derived()-->
			{#if data.user && data.organization.admins.includes(data.user.id)}
				<div class="flex flex-row gap-5">
					<Button
						onclick={() => {
							updateOutpostModalOpen = true;
						}}>Update Outpost</Button
					>
					{#if imageChanged}
						<Button type="submit" outline>Save Image</Button>
					{/if}
				</div>
			{/if}
		</div>

		<div
			class="max-w-sm rounded-lg border border-gray-200 bg-white shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div class="aspect-video h-48 overflow-hidden">
				<img
					id="outpostImage"
					class="h-full w-full cursor-pointer rounded-t-lg object-cover"
					src={getImageUrlFromPocketBase(
						data.outpost.collectionId,
						data.outpost.id,
						data.outpost.image
					) ?? placeholder}
					alt="Outpost"
					onclick={handleImageClick}
				/>
			</div>
			{#if data.user && data.organization.admins.includes(data.user.id)}
				<input
					id="outpostImageCardInput"
					name="image"
					type="file"
					class="hidden"
					onchange={showPreview}
					bind:files={inputImage}
				/>
			{/if}

			<div class="p-5">
				<div class="flex flex-row content-center justify-start gap-2">
					{#if data.outpost?.expand?.star_system}
						<Badge large rounded color="indigo" id="star_system" class="cursor-default">
							{data.outpost.expand.star_system.name}
						</Badge>
						<Popover triggeredBy="#star_system" trigger="hover">Star System</Popover>
					{/if}
					{#if data.outpost?.expand?.planet}
						<Badge large rounded color="purple" id="planet" class="cursor-default">
							{data.outpost.expand.planet.name}
						</Badge>
						<Popover triggeredBy="#planet" trigger="hover">Planet</Popover>
					{/if}
					{#if data.outpost?.expand?.moon}
						<Badge large rounded color="pink" id="moon" class="cursor-default">
							{data.outpost.expand.moon.name}
						</Badge>
						<Popover triggeredBy="#moon" trigger="hover">Moon</Popover>
					{/if}
				</div>
			</div>
		</div>
		<Modal bind:open={updateOutpostModalOpen} size="xs" class="w-full">
			<div class="space-y-6">
				<Heading tag="h3" class="text-xl font-medium ">Update Outpost</Heading>
				<AppInput type="text" label="Outpost Name" name="name" errors={form?.errors?.name} />
				<div>
					<Label class="mb-2" color={form?.errors?.code ? 'red' : 'gray'}>Identification Code</Label
					>
					<Input
						type="text"
						name="code"
						placeholder="ABCD"
						value={form?.data?.code}
						color={form?.errors?.code ? 'red' : 'base'}
					/>
					<Helper color="gray" class="mt-2">4 Letter Code (Optional)</Helper>
					{#if form?.errors?.code}
						{#each form?.errors?.code as error}
							<Helper class="mt-2" color="red">{error}</Helper>
						{/each}
					{/if}
				</div>

				<div>
					<Label class="mb-2" color={form?.errors?.description ? 'red' : 'gray'}
						>Outpost Description</Label
					>
					<Textarea
						id="description"
						name="description"
						placeholder="Your Description"
						rows={3}
						value={(form?.data?.description as string) ?? ''}
						color={form?.errors?.description ? 'red' : 'base'}
					/>
					{#if form?.errors?.description}
						{#each form?.errors?.description as error}
							<Helper class="mt-2" color="red">{error}</Helper>
						{/each}
					{/if}
				</div>

				<div>
					<Label class="mb-2" color={form?.errors?.image ? 'red' : 'gray'}>Outpost Image</Label>
					<Fileupload name="image" bind:files={inputImage} />
					<Helper color="gray" class="mt-2">Max Image size 5MB. Try uploading as .webp</Helper>
					{#if form?.errors?.image}
						{#each form?.errors?.image as error}
							<Helper class="mt-2" color="red">{error}</Helper>
						{/each}
					{/if}
				</div>
				<Button type="submit">Update Outpost</Button>
			</div>
		</Modal>
	</form>

	<Heading tag="h3">Commodities</Heading>
	<div class="flex flex-row flex-wrap gap-2">
		<BadgeFilter
			filters={data.commodityTypes.map((f) => f.name)}
			bind:selectedFilters={selectedFilter}
		></BadgeFilter>
	</div>
	<div class="space-between flex flex-row">
		<Table shadow noborder={true} hoverable={true} striped={true}>
			<TableHead>
				<!-- Sort by Commodity Name -->
				<!-- Sort by Commodity Name -->
				<TableHeadCell class="cursor-pointer" onclick={() => toggleSorting('commodity')}>
					<div class="flex flex-row space-x-1">
						Commodity
						{#if commoditySorting.column === 'commodity'}
							{#if commoditySorting.direction === 'asc'}
								<ArrowUpOutline />
							{:else}
								<ArrowDownOutline />
							{/if}
						{:else}
							<ArrowUpDownOutline />
						{/if}
					</div>
				</TableHeadCell>

				<!-- Sort by Type -->
				<TableHeadCell class="cursor-pointer" onclick={() => toggleSorting('type')}>
					<div class="flex flex-row space-x-1">
						Type
						{#if commoditySorting.column === 'type'}
							{#if commoditySorting.direction === 'asc'}
								<ArrowUpOutline />
							{:else}
								<ArrowDownOutline />
							{/if}
						{:else}
							<ArrowUpDownOutline />
						{/if}
					</div>
				</TableHeadCell>

				<!-- Sort by Amount -->
				<TableHeadCell class="cursor-pointer" onclick={() => toggleSorting('quantity')}>
					<div class="flex flex-row space-x-1">
						Quantity
						{#if commoditySorting.column === 'quantity'}
							{#if commoditySorting.direction === 'asc'}
								<ArrowUpOutline />
							{:else}
								<ArrowDownOutline />
							{/if}
						{:else}
							<ArrowUpDownOutline />
						{/if}
					</div>
				</TableHeadCell>
				<TableHeadCell>Incoming/Outgoing</TableHeadCell>
				<TableHeadCell><sr-only>Request</sr-only></TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each sortedCommodities as outpostCommodity}
					<TableBodyRow>
						<TableBodyCell>{outpostCommodity.expand?.commodity?.name}</TableBodyCell>
						<TableBodyCell>{outpostCommodity.expand?.commodity?.type}</TableBodyCell>
						<TableBodyCell>{outpostCommodity.quantity}</TableBodyCell>
						<TableBodyCell>Change</TableBodyCell>
						<TableBodyCell>
							<Button
								onclick={() => {
									const id = outpostCommodity.expand?.commodity?.id;
									if (id) onCommodityRequestedClicked(id);
								}}>Request</Button
							>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
			<tfoot>
				<tr class="font-semibold text-gray-900 dark:text-white">
					<th scope="row" class="px-6 py-3 text-base">Total</th>
					<td class="px-6 py-3"></td>
					<td class="px-6 py-3">
						{#if outpostCommodities.length > 0}
							{outpostCommodities.reduce((acc, cur) => acc + cur.quantity, 0)}
						{/if}
					</td>
				</tr>
			</tfoot>
		</Table>
		<Modal
			bind:open={requestCommodityModalOpen}
			size="xs"
			autoclose={false}
			class="w-full"
			title="Request Commodity"
		>
			<form
				method="post"
				action="?/requestCommodity"
				enctype="multipart/form-data"
				class="flex flex-col space-y-6"
				use:enhance={() => {
					return async ({ result, update }) => {
						switch (result.type) {
							case 'success':
								toast.success('Job Created');
								requestCommodityModalOpen = false;
								await update();
								break;
							case 'failure':
								toast.error('Failed to create job');
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
				<input type="hidden" name="outpostId" value={data.outpost.id} />

				<div class="space-y-2">
					<Label>Commodity</Label>
					<Select
						name="commodityId"
						placeholder="Select Commodity..."
						required
						bind:value={selectedCommodity}
					>
						{#each outpostCommodities as outpostCommodity}
							<option value={outpostCommodity.expand?.commodity?.id}
								>{outpostCommodity.expand?.commodity?.name}</option
							>
						{/each}
					</Select>
				</div>

				<div class="flex flex-col space-y-2">
					<Label color={form?.errors?.quantity ? 'red' : 'gray'}>Amount</Label>
					<Input
						name="quantity"
						type="text"
						placeholder="SCU"
						value={form?.data?.quantity}
						required
						color={form?.errors?.quantity ? 'red' : 'base'}
					/>
					{#if form?.errors?.quantity}
						{#each form?.errors?.quantity as error}
							<Helper color="red">{error}</Helper>
						{/each}
					{/if}
				</div>

				<Button type="submit">Request Commodity</Button>
			</form>
		</Modal>
	</div>
</div>
