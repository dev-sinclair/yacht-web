import { calculateTrip } from './fuel-math.js';
const $ = id => document.getElementById(`fuel-${id}`);
const fields = ['speed', 'burn', 'price', 'allowance', 'currency', 'return'];
const points = [];
let map, markers = [], mapReady = false;
const fmt = (value, digits = 1) => new Intl.NumberFormat('en-GB', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
const time = hours => { const mins = Math.round(hours * 60); return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`; };
function settings() {
  return { speed: $('speed').valueAsNumber, burn: $('burn').valueAsNumber, price: $('price').valueAsNumber, allowance: $('allowance').valueAsNumber, returnTrip: $('return').checked };
}
function refresh() {
  const result = calculateTrip(points, settings());
  $('distance').textContent = `${fmt(result.distance)} nm`;
  $('time').textContent = result.valid ? time(result.hours) : '—';
  $('litres').textContent = result.valid ? `${fmt(result.litres, 0)} L` : '—';
  $('cost').textContent = result.valid ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: $('currency').value, maximumFractionDigits: 0 }).format(result.cost) : '—';
  $('budget').textContent = result.valid ? `Fuel budget: ${fmt(result.budgetLitres, 0)} litres, including ${fmt(result.allowanceLitres, 0)} litres of additional allowance (${fmt(settings().allowance, 0)}%).` : '';
  $('input-status').textContent = result.valid ? 'Estimate updated using your figures.' : 'Enter positive speed, consumption and price, an allowance of 0–100%, and at least two route points.';
  $('undo').disabled = $('clear').disabled = points.length === 0;
  $('fit').disabled = points.length < 2;
  $('empty').hidden = points.length > 0;
  $('points').replaceChildren();
  points.forEach((point, i) => {
    const li = document.createElement('li');
    const n = document.createElement('strong'); n.textContent = String(i + 1);
    const label = document.createElement('span'); label.textContent = `${point.lat.toFixed(4)}°, ${point.lng.toFixed(4)}°`;
    const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Remove'; button.setAttribute('aria-label', `Remove route point ${i + 1}`);
    button.addEventListener('click', () => { points.splice(i, 1); draw(); });
    li.append(n, label, button); $('points').append(li);
  });
  $('legs').replaceChildren();
  result.legs.forEach(leg => {
    const row = document.createElement('tr');
    [`${leg.from} → ${leg.to}`, `${fmt(leg.distance)} nm`, result.valid ? time(leg.hours) : '—', result.valid ? `${fmt(leg.litres, 0)} L` : '—'].forEach(text => { const cell = document.createElement('td'); cell.textContent = text; row.append(cell); });
    $('legs').append(row);
  });
}
function routeCoordinates() {
  return points.map(point => [point.lng, point.lat]);
}
function updateLine() {
  if (mapReady) map.getSource('fuel-route').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: routeCoordinates() }, properties: {} });
}
function fitRoute(padding = 40) {
  if (points.length < 2) return;
  const bounds = new maplibregl.LngLatBounds();
  routeCoordinates().forEach(point => bounds.extend(point));
  map.fitBounds(bounds, { padding, maxZoom: 12, duration: 0 });
}
function draw() {
  markers.forEach(marker => marker.remove()); markers = [];
  points.forEach((point, i) => {
    const pin = document.createElement('button');
    pin.type = 'button'; pin.className = 'fuel-pin'; pin.textContent = String(i + 1);
    pin.setAttribute('aria-label', `Route point ${i + 1}`);
    pin.addEventListener('click', event => event.stopPropagation());
    const marker = new maplibregl.Marker({ element: pin, draggable: true }).setLngLat([point.lng, point.lat]).addTo(map);
    marker.on('drag', () => { const p = marker.getLngLat().wrap(); points[i] = { lat: p.lat, lng: p.lng }; updateLine(); refresh(); });
    marker.on('dragend', draw);
    markers.push(marker);
  });
  updateLine();
  $('map-status').textContent = points.length ? `${points.length} route point${points.length === 1 ? '' : 's'} added. Add another point or adjust your route.` : 'Map ready. Add your departure point.';
  refresh();
}
fields.forEach(id => $(id).addEventListener('input', refresh));
$('undo').addEventListener('click', () => { points.pop(); draw(); });
$('clear').addEventListener('click', () => { points.length = 0; draw(); });
$('fit').addEventListener('click', () => fitRoute());
$('centre').addEventListener('click', () => { const p = map.getCenter().wrap(); points.push({ lat: p.lat, lng: p.lng }); draw(); });
$('demo').addEventListener('click', () => {
  points.splice(0, points.length, { lat: 43.48, lng: 7.07 }, { lat: 43.46, lng: 7.44 }, { lat: 43.70, lng: 7.44 });
  $('speed').value = '12'; $('burn').value = '250'; $('price').value = '1.50'; $('currency').value = 'EUR'; $('allowance').value = '10'; $('return').checked = false;
  draw(); fitRoute(50);
  $('map-status').textContent = 'Example route and illustrative yacht figures loaded. Replace these with your own.';
});
try {
  if (!window.maplibregl) throw new Error('Map library unavailable');
  map = new maplibregl.Map({ container: 'fuel-map', style: 'https://tiles.openfreemap.org/styles/positron', center: [12, 39], zoom: 4, maxZoom: 18, dragRotate: false, pitchWithRotate: false });
  map.scrollZoom.disable(); map.doubleClickZoom.disable(); map.touchZoomRotate.disableRotation();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
  ['centre', 'demo'].forEach(id => { $(id).disabled = true; });
  map.on('load', () => {
    for (const layer of map.getStyle().layers) {
      if (layer.type === 'fill' && layer['source-layer'] === 'water') map.setPaintProperty(layer.id, 'fill-color', '#c4dfe4');
      if (layer.type === 'background') map.setPaintProperty(layer.id, 'background-color', '#faf8f4');
      if (/road|highway|railway|transportation|building/i.test(layer.id)) map.setLayoutProperty(layer.id, 'visibility', 'none');
      if (layer.type === 'symbol' && layer.layout?.['text-field']) {
        map.setPaintProperty(layer.id, 'text-color', '#425958');
        map.setPaintProperty(layer.id, 'text-halo-color', '#ffffff');
        map.setPaintProperty(layer.id, 'text-halo-width', 1.5);
      }
    }
    map.addSource('fuel-route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({ id: 'fuel-route-halo', type: 'line', source: 'fuel-route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': 7, 'line-opacity': 0.85 } });
    map.addLayer({ id: 'fuel-route-line', type: 'line', source: 'fuel-route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#28666b', 'line-width': 4 } });
    mapReady = true;
    ['centre', 'demo'].forEach(id => { $(id).disabled = false; });
    draw();
  });
  map.on('click', event => { if (!mapReady) return; const p = event.lngLat.wrap(); points.push({ lat: p.lat, lng: p.lng }); draw(); });
  map.on('error', () => { $('map-status').textContent = 'Some map details could not load. Check your connection and reload if needed.'; });
  refresh();
} catch (error) {
  $('map-status').textContent = 'The map could not load. Please check your connection and reload.';
  ['centre', 'demo', 'fit'].forEach(id => { $(id).disabled = true; });
  refresh();
}
