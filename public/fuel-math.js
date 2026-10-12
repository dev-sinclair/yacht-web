const EARTH_METRES = 6371008.8;
export function distanceNm(a, b) {
  const rad = Math.PI / 180;
  const dlat = (b.lat - a.lat) * rad;
  const dlon = (b.lng - a.lng) * rad;
  const h = Math.sin(dlat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dlon / 2) ** 2;
  return EARTH_METRES * 2 * Math.atan2(Math.sqrt(Math.min(1, h)), Math.sqrt(Math.max(0, 1 - h))) / 1852;
}
export function calculateTrip(points, settings) {
  const legs = points.slice(1).map((point, i) => ({ from: i + 1, to: i + 2, distance: distanceNm(points[i], point) }));
  if (settings.returnTrip) {
    const outbound = legs.slice();
    legs.push(...outbound.reverse().map(leg => ({ ...leg, from: leg.to, to: leg.from })));
  }
  const distance = legs.reduce((sum, leg) => sum + leg.distance, 0);
  const valid = ['speed', 'burn', 'price'].every(key => Number.isFinite(settings[key]) && settings[key] > 0) && Number.isFinite(settings.allowance) && settings.allowance >= 0 && settings.allowance <= 100;
  if (!valid || points.length < 2) return { legs, distance, valid: false };
  const hours = distance / settings.speed;
  const litres = hours * settings.burn;
  const allowanceLitres = litres * settings.allowance / 100;
  return { legs: legs.map(leg => ({ ...leg, hours: leg.distance / settings.speed, litres: leg.distance / settings.speed * settings.burn })), distance, valid: true, hours, litres, allowanceLitres, budgetLitres: litres + allowanceLitres, cost: (litres + allowanceLitres) * settings.price };
}
