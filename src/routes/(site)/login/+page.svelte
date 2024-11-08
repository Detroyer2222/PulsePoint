<script lang="ts">
    import type { PageData } from './$types';
    import { Input, Label, Helper, Button, Checkbox, A, Card } from 'flowbite-svelte';
    
    export let data: PageData;
</script>

<div class="flex items-center justify-center h-screen">
    <Card>
        <form class="flex flex-col space-y-6" action="?/login" method="post">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">Login</h3>
    
            <Label class="space-y-2">
                <span>Email</span>
                <Input type="email" name="email" placeholder="name@company.com" required />
            </Label>
            <Label class="space-y-2">
                <span>Your password</span>
                <Input type="password" name="password" placeholder="•••••" required />
            </Label>
            <div class="flex items-start">
                <Checkbox>Remember me</Checkbox>
                <a href="/" class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500">
                    Lost password?
                </a>
            </div>
            <Button type="submit" class="w-full">Login to your account</Button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered? <a href="/register" class="text-primary-700 hover:underline dark:text-primary-500">
                    Create account
                </a>
            </div>
        </form>
    </Card>
</div>
