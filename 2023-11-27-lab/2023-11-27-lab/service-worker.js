self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('my-cache').then(function(cache) {
            return cache.addAll([
                'lab3.html',
                'lab_main.js',
                'lab3.css',
                'manifest.json',
                'images/logo.jpg',
            ]);
        })
    );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request).catch(function(error) {
                console.error('Fetch failed:', error);
            });
        })
    );
});

