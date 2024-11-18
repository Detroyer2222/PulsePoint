<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { Input, Label, Helper, Button, Checkbox, A, Card } from 'flowbite-svelte';
    import { enhance } from '$app/forms';
	import InputSvelte from '$lib/components/Input.svelte';

	let { form, data }: { form: ActionData; data: PageData } = $props();
</script>

<div class="flex items-center justify-center h-screen">
    <Card>
        <form class="flex flex-col space-y-6" action="?/register" method="post" use:enhance>
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">Create an account</h3>
            <InputSvelte type="text" label="Username" name="username" placeholder="Username" value={form?.data?.username ?? ''} required errors={form?.errors?.username}/>
            <InputSvelte type="email" label="Email" name="email" placeholder="name@pulsepoint.com" value={form?.data?.email ?? ''} required errors={form?.errors?.email}/>
            <InputSvelte type="password" label="Password" name="password" placeholder="•••••" value={form?.data?.password ?? ''} required errors={form?.errors?.password}/>
            <InputSvelte type="password" label="Confirm Password" name="passwordConfirm" placeholder="•••••" value={form?.data?.passwordConfirm ?? ''} required errors={form?.errors?.passwordConfirm}/>
            <!-- TODO -->
            <!--
                        <div class="flex items-start">
                <Checkbox>Remember me</Checkbox>
                <a href="/" class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500">
                    Lost password?
                </a>
            </div>
            -->

            <Button type="submit" class="w-full">Create</Button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                Already registered? <A href="/login" class="text-primary-700 hover:underline dark:text-primary-500">
                    Login here
                </A>
            </div>
        </form>
    </Card>
</div>

