<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { Input, Label, Helper, Button, Checkbox, A, Card, Alert } from 'flowbite-svelte';
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    import { enhance } from '$app/forms';
    
    let { form, data}: { form:ActionData, data:PageData } = $props();
</script>

<div class="flex items-center justify-center h-screen">
    <Card>
        <form class="flex flex-col space-y-6" action="?/resetPassword" method="POST" use:enhance>
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">Reset your password</h3>
            <h6 class="text-sm font-normal text-gray-900 dark:text-white">We'll send you an email to reset your password.</h6>
            <Label class="space-y-2">
                <span>Email</span>
                <Input type="email" name="email" placeholder="name@company.com" required />
            </Label>
            <Button type="submit" class="w-full">Reset password</Button>
            {#if form?.success}
            <Alert color="green">
                <InfoCircleSolid slot="icon" class="w-5 h-5" />
                An email has ben sent to reset your password!
              </Alert>
            {/if}
        </form>
    </Card>
</div>
