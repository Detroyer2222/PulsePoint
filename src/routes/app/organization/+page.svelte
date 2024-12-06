<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Heading,
		Helper,
		Label,
		Modal,
		Input,
		Select,
		Textarea,
		Toggle,
		NumberInput
	} from 'flowbite-svelte';
	import type { ActionData, PageData } from './$types';
	import { getImageUrlFromPocketBase } from '$lib/utils';
	import AppInput from '$lib/components/Input.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { Moon, Planet } from '$lib/pulsepointTypes';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import placeholder from '$lib/assets/outpost_placeholder.webp';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let outpostModalOpen = $state(false);

	// Client-side caches
	const planetsCache = new Map<string, Planet[]>();
	const moonsCache = new Map<string, Moon[]>();

	// Variables for selections and data
	let selectedStarSystem = $state('');
	let planets: Planet[] = $state([]);
	const onStarSystemChange = async () => {
		planets = [];
		selectedPlanet = '';
		moons = [];
		selectedMoon = '';

		if (planetsCache.has(selectedStarSystem)) {
			planets = planetsCache.get(selectedStarSystem) as Planet[];
		} else {
			const response = await fetch(
				`${PUBLIC_POCKETBASE_URL}/api/collections/planets/records?filter=star_system="${selectedStarSystem}"&fields=id,name`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${data.token}`
					}
				}
			);
			const json = await response.json();
			planets = json.items as Planet[];
			planetsCache.set(selectedStarSystem, planets);
		}
	};

	let selectedPlanet = $state('');
	let moons: Moon[] = $state([]);
	const onPlanetChange = async () => {
		moons = [];
		selectedMoon = '';

		if (moonsCache.has(selectedPlanet)) {
			moons = moonsCache.get(selectedPlanet) as Moon[];
		} else {
			const response = await fetch(
				`${PUBLIC_POCKETBASE_URL}/api/collections/moons/records?filter=planet="${selectedPlanet}"&fields=id,name`,
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `${data.token}`
					}
				}
			);
			const json = await response.json();
			moons = json.items as Moon[];
			moonsCache.set(selectedPlanet, moons);
		}
	};

	let selectedMoon = $state('');
	let advancedLocationChecked = $state(false);
</script>

<div class="flex h-full w-full flex-col space-y-6 px-8 pt-4">
	<Heading tag="h4" class="font-bold">Outposts:</Heading>
	<div class="flex flex-row flex-wrap content-start justify-start gap-2">
		{#each data?.outposts as outpost}
			<Card horizontal size="xs" href="organizaton/outpost/kjgkhgkjguzgfkjhgfuzfkgh">
				<div class="flex flex-col content-start justify-start gap-0.5">
					<Heading tag="h5" class="font-bold tracking-tight text-gray-900 dark:text-white"
						>{outpost.name}</Heading
					>
					<Heading tag="h6" class="color-primary text-sm">{outpost.code}</Heading>
					<div class="flex flex-row content-center justify-start gap-2">
						{#if outpost.expand.star_system}
							<Badge large rounded color="indigo">{outpost.expand.star_system.name}</Badge>
						{/if}
						{#if outpost.expand.planet}
							<Badge large rounded color="purple">{outpost.expand.planet.name}</Badge>
						{/if}
						{#if outpost.expand.moon}
							<Badge large rounded color="pink">{outpost.expand.moon.name}</Badge>
						{/if}
					</div>
				</div>
			</Card>
		{/each}

		<Card
			horizontal
			padding="md"
			size="xs"
			class="flex-column flex items-center justify-center gap-0.5 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
			onclick={() => (outpostModalOpen = true)}
		>
			<Heading
				tag="h3"
				class="w-full text-center font-bold tracking-tight text-primary-900 dark:text-primary-500"
				>Add Outpost</Heading
			>
			<Modal bind:open={outpostModalOpen} size="xs" autoclose class="w-full">
				<form
					action="?/addOutpost"
					class="flex flex-col space-y-6"
					method="post"
					use:enhance={() => {
						return async ({ result, update }) => {
							switch (result.type) {
								case 'success':
									toast.success('Outpost added');
									await update();
									break;
								case 'failure':
									toast.error('Failed to create outpost');
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
					<Heading tag="h3" class="text-xl font-medium ">Add Outpost</Heading>
					<AppInput
						type="text"
						name="name"
						label="Name"
						placeholder="Outpost Name"
						value={form?.data?.name}
						required
						errors={form?.errors?.name}
					/>

					<div class="space-y-2">
						<Label class="mb-2" color={form?.data?.errors.code ? 'red' : 'gray'}
							>Identification Code</Label
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
							value={form?.data?.description ?? ''}
							color={form?.errors?.description ? 'red' : 'base'}
						/>
						{#if form?.errors?.description}
							{#each form?.errors?.description as error}
								<Helper class="mt-2" color="red">{error}</Helper>
							{/each}
						{/if}
					</div>

					<div class="space-y-2">
						<Label>Star System</Label>
						<Select
							name="starSystem"
							placeholder="Select Star System..."
							onchange={onStarSystemChange}
							required
							bind:value={selectedStarSystem}
						>
							{#each data?.starSystems as system}
								<option value={system.id}>{system.name}</option>
							{/each}
						</Select>
					</div>

					<div class="space-y-2">
						<Label>Planet</Label>
						<Select
							name="planet"
							placeholder="Select Planet..."
							onchange={onPlanetChange}
							required
							bind:value={selectedPlanet}
							disabled={selectedStarSystem.length === 0}
						>
							{#each planets as planet}
								<option value={planet.id}>{planet.name}</option>
							{/each}
						</Select>
					</div>

					<div class="space-y-2">
						<Label>Moon</Label>
						<Select
							name="moon"
							placeholder="Select Moon..."
							bind:value={selectedMoon}
							disabled={selectedPlanet.length === 0}
						>
							{#each moons as moon}
								<option value={moon.id}>{moon.name}</option>
							{/each}
						</Select>
						<Helper color="gray">Optional</Helper>
					</div>
					<Toggle size="default" bind:checked={advancedLocationChecked}
						>Precise Location (Optional)</Toggle
					>

					{#if advancedLocationChecked}
						<div class="space-y-2">
							<Label color={form?.errors?.lat ? 'red' : 'gray'}>Latitude</Label>
							<NumberInput
								name="latitude"
								placeholder="Enter latitude (e.g., 45.123456)"
								step="0.000001"
								color={form?.errors?.lat ? 'red' : 'base'}
							/>
							<Helper color={form?.errors?.lat ? 'red' : 'gray'}>Max 6 Decimals</Helper>
							{#if form?.errors?.lat}
								{#each form?.errors?.lng as error}
									<Helper class="mt-2" color="red">{error}</Helper>
								{/each}
							{/if}
						</div>

						<div class="space-y-2">
							<Label color={form?.errors?.lng ? 'red' : 'gray'}>Longitude</Label>
							<Input
								type="number"
								name="longitude"
								placeholder="Enter longitude (e.g., 12.654321)"
								step="0.000001"
								color={form?.errors?.lng ? 'red' : 'base'}
							/>
							<Helper color={form?.errors?.lat ? 'red' : 'gray'}>Max 6 Decimals</Helper>
							{#if form?.errors?.lng}
								{#each form?.errors?.lng as error}
									<Helper class="mt-2" color="red">{error}</Helper>
								{/each}
							{/if}
						</div>
					{/if}

					<Button type="submit" color="primary" class="mt-4 w-full justify-self-center">Add</Button>
				</form>
			</Modal>
		</Card>
	</div>
</div>
