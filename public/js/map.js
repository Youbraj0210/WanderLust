mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [77.2090, 28.6139], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
