mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

var el = document.createElement('div');
el.innerHTML = '<i class="fa-solid fa-house"></i>'
el.style.backgroundColor = "#fe424d";
el.style.padding="10px";
el.style.fontSize="20px";
el.style.color= "white";
el.style.borderRadius = "50%";




const marker1 = new mapboxgl.Marker(el)
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`))
    .addTo(map);



