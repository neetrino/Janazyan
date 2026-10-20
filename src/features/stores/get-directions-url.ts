/** Builds a Yandex Maps directions URL for a store location. */
export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://yandex.com/maps/?rtext=~${lat},${lng}&rtt=auto`;
}
