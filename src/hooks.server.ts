import PocketBase from 'pocketbase'
import { SECRET_POCKETBASE_URL } from '$env/static/private'
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase('https://dev.pulsepoint.pocketbase.detroyerlabs.com');

    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    if (event.locals.pb.authStore.isValid) {
        event.locals.user = structuredClone(event.locals.pb.authStore.record)
    } else {
        event.locals.user = null;
    }

    const response = await resolve(event);

    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

    return response;
}