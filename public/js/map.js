mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});


const marker1 = new mapboxgl.Marker({ color: '#fe424d'})
    .setLngLat(coordinates)
    .addTo(map);