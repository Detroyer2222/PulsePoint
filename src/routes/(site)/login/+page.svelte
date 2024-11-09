<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { Input, Label, Helper, Button, Checkbox, A, Card, Alert } from 'flowbite-svelte';
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    
    let { form, data}: { form:ActionData, data:PageData } = $props();
</script>

<div class="flex items-center justify-center h-screen">
    <Card>
        <form class="flex flex-col space-y-6" action="?/login" method="POST">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">Login</h3>
            <Label class="space-y-2">
                <span>Email</span>
                <Input type="email" name="email" placeholder="name@company.com" required />
            </Label>
            <Label class="space-y-2">
                <span>Your password</span>
                <Input type="password" name="password" placeholder="•••••" required />
            </Label>
            <Helper class="text-sm text-gray-500 dark:text-gray-300">
                <span>Forgot your password?</span>
                <A href="/reset-password" class="text-primary-700 hover:underline dark:text-primary-500">
                    Reset password
                </A>
            </Helper>
            <div class="flex items-start">
                <Checkbox>Remember me</Checkbox>
                <a href="/" class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500">
                    Lost password?
                </a>
            </div>
            <Button type="submit" class="w-full">Login to your account</Button>
            {#if form?.notVerified}
            <Alert color="red">
                <InfoCircleSolid slot="icon" class="w-5 h-5" />
                <span class="font-medium">Email not verified!</span>
                Please verify your email before logging in.
              </Alert>
            {/if}
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered? <a href="/register" class="text-primary-700 hover:underline dark:text-primary-500">
                    Create account
                </a>
            </div>
        </form>
    </Card>
</div>
