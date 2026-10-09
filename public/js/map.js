mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates,
    zoom: 9
});

const marker = new mapboxgl.Marker({ color: 'red', rotation: 25 })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25})
        .setHTML(`<h4>${listing.title}</h4><p>Exact location provided after booking</p>`))
    .addTo(map);

