import { calculateTrip } from './fuel-math.js';
const $ = id => document.getElementById(`fuel-${id}`);
const fields = ['speed', 'burn', 'price', 'allowance', 'currency', 'return'];
const points = [];
let map, markers = [], line, tiles;
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
function draw() {
  markers.forEach(marker => marker.remove()); markers = [];
  points.forEach((point, i) => {
    const marker = L.marker(point, { draggable: true, icon: L.divIcon({ className: 'fuel-pin', html: String(i + 1), iconSize: [30, 30], iconAnchor: [15, 15] }), title: `Route point ${i + 1}`, alt: `Route point ${i + 1}` }).addTo(map);
    marker.on('drag', () => { const p = marker.getLatLng().wrap(); points[i] = { lat: p.lat, lng: p.lng }; line.setLatLngs(points); refresh(); });
    marker.on('dragend', draw);
    markers.push(marker);
  });
  line.setLatLngs(points);
  $('map-status').textContent = points.length ? `${points.length} route point${points.length === 1 ? '' : 's'} added. Add another point or adjust your route.` : 'Map ready. Add your departure point.';
  refresh();
}
fields.forEach(id => $(id).addEventListener('input', refresh));
$('undo').addEventListener('click', () => { points.pop(); draw(); });
$('clear').addEventListener('click', () => { points.length = 0; draw(); });
$('fit').addEventListener('click', () => map.fitBounds(points, { padding: [30, 30], maxZoom: 12, animate: false }));
$('centre').addEventListener('click', () => { const p = map.getCenter().wrap(); points.push({ lat: p.lat, lng: p.lng }); draw(); });
$('demo').addEventListener('click', () => {
  points.splice(0, points.length, { lat: 43.48, lng: 7.07 }, { lat: 43.46, lng: 7.44 }, { lat: 43.70, lng: 7.44 });
  $('speed').value = '12'; $('burn').value = '250'; $('price').value = '1.50'; $('currency').value = 'EUR'; $('allowance').value = '10'; $('return').checked = false;
  draw(); map.fitBounds(points, { padding: [50, 50], animate: false });
  $('map-status').textContent = 'Example route and illustrative yacht figures loaded. Replace these with your own.';
});
try {
  if (!window.L) throw new Error('Map library unavailable');
  map = L.map('fuel-map', { scrollWheelZoom: false, doubleClickZoom: false, worldCopyJump: true }).setView([39, 12], 5);
  tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
  tiles.on('tileerror', () => { $('map-status').textContent = 'Some map tiles could not load. Check your connection before plotting your route.'; });
  line = L.polyline([], { color: '#28666b', weight: 3 }).addTo(map);
  map.on('click', e => { const p = e.latlng.wrap(); points.push({ lat: p.lat, lng: p.lng }); draw(); });
  draw();
} catch (error) {
  $('map-status').textContent = 'The map could not load. Please check your connection and reload.';
  ['centre', 'demo', 'fit'].forEach(id => { $(id).disabled = true; });
  refresh();
}
