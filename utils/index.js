export async function getDetailLocation(lat, lon) {
  return await $fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
}

export function useCapitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function convertUnixToReadable(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ` +
       `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
}