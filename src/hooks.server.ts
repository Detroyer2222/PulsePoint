import PocketBase from 'pocketbase'
import { PUBLIC_POCKETBASE_URL } from '$env/static/public'
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);

    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        if (event.locals.pb.authStore.isValid) {
            event.locals.pb.collection('users').authRefresh();
            event.locals.user = structuredClone(event.locals.pb.authStore.record)
        }
        
    } catch (_) {
        event.locals.pb.authStore.clear();
        event.locals.user = null;
    }

    const response = await resolve(event);

    response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

    return response;
}