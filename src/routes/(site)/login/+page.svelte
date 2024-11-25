<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	import { Button, Card, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';
	import AppInput from '$lib/components/Input.svelte';
	import { toast } from 'svelte-sonner';

	let { form, data }: { form: ActionData; data: PageData } = $props();

	$inspect(form);

	let loading = $state(false);
</script>

<div class="flex h-screen items-center justify-center">
	<Card>
		<form
			class="flex flex-col space-y-6"
			action="?/login"
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					switch (result.type) {
						case 'success':
							await update();
							break;
						case 'failure':
							toast.error('Invalid email or password');
							await update();
							loading = false;
							break;
						case 'error':
							toast.error(result.error.message);
							loading = false;
							break;
						default:
							await update();
							loading = false;
							break;
					}
				};
			}}
		>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Login</h3>
			<AppInput
				type="email"
				label="Email"
				name="email"
				placeholder="name@pulsepoint.com"
				value={form?.data?.email ?? ''}
				required
				errors={form?.errors?.email}
				disabled={loading}
			/>
			<AppInput
				type="password"
				label="Password"
				name="password"
				placeholder="•••••"
				required
				errors={form?.errors?.password}
				disabled={loading}
			/>
			<!-- TODO
            <div class="flex items-start">
				<Checkbox>Remember me</Checkbox>
				<a href="/reset-password" class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500">
					Forgot password?
				</a>
			</div>
            -->
			<Button type="submit" class="w-full" disabled={loading}>Login to your account</Button>
			{#if form?.notVerified}
				<Alert color="red">
					<InfoCircleSolid slot="icon" class="h-5 w-5" />
					<span class="font-medium">Email not verified!</span>
					Please verify your email before logging in.
				</Alert>
			{/if}
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
				Not registered? <a
					href="/register"
					class="text-primary-700 hover:underline dark:text-primary-500"
				>
					Create account
				</a>
			</div>
		</form>
	</Card>
</div>
