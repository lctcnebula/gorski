import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const handlers = {};
const shown = [];
const opened = [];
let windows = [];
const self = {
  location: { origin: 'https://example.test' },
  addEventListener: (name, handler) => { handlers[name] = handler; },
  registration: { showNotification: async (title, options) => shown.push({ title, ...options }) },
  clients: {
    matchAll: async () => windows,
    openWindow: async url => opened.push(url),
  },
};
vm.runInNewContext(readFileSync(new URL('../public/admin/sw.js', import.meta.url), 'utf8'), { self, URL });
async function dispatch(name, properties) {
  let pending;
  handlers[name]({ ...properties, waitUntil: promise => { pending = promise; } });
  await pending;
}
await dispatch('push', { data: { json: () => ({ title: 'New request', url: '/admin?id=123' }) } });
assert.equal(shown[0].data.url, '/admin?id=123');
await dispatch('push', { data: { json: () => { throw new Error('Malformed'); } } });
assert.equal(shown[1].title, 'Gorski Office');
await dispatch('push', { data: { json: () => ({ url: 'https://evil.test' }) } });
assert.equal(shown[2].data.url, '/admin');
await dispatch('push', { data: { json: () => null } });
assert.equal(shown[3].title, 'Gorski Office');
const click = data => dispatch('notificationclick', { notification: { data, close() {} } });
await click(undefined);
assert.equal(opened.pop(), 'https://example.test/admin');
await click({ url: '//evil.test/admin' });
assert.equal(opened.pop(), 'https://example.test/admin');
let navigated;
let focused = false;
windows = [{ url: 'https://example.test/admin', navigate: async url => { navigated = url; return { focus: async () => { focused = true; } }; } }];
await click({ url: '/admin?id=123' });
assert.equal(navigated, 'https://example.test/admin?id=123');
assert.equal(focused, true);
windows = [{ url: 'https://example.test/administrator', navigate: () => assert.fail('Wrong tab reused') }];
await click({ url: '/admin' });
assert.equal(opened.pop(), 'https://example.test/admin');
console.log('PASS: push payloads, malformed payload fallback, safe targets, opening dashboard, and focusing existing dashboard.');
