export const useLocations = () => {

  const runtimeConfig = useRuntimeConfig();
  const apiKey = useState('apiKey', () => runtimeConfig.public.apiKey);
  const apiUrl = useState('apiUrl', () => runtimeConfig.public.apiUrl);
  const wishlists = useState('wishlists', () => new Map());
  const currentLocation = useState('currentLocation', () => null);
  const isFavouriteLocation = useState('isFavouriteLocation', () => false);

  const getGeoCoordinates = async(searchTerm) => {
    let fullPath = `${apiUrl.value}/geo/1.0`;
    if (searchTerm.match(/\d/)) {
      fullPath = `${fullPath}/zip?zip=${searchTerm}&appid=${apiKey.value}`
    } else {
      fullPath = `${fullPath}/direct?q=${searchTerm}&limit=1&appid=${apiKey.value}`
    }

    try {
      const response = await $fetch(fullPath);
      if (response) {
        let coords = {}
        if (response[0]) {
          coords = {lat: response[0].lat, lon: response[0].lon};
        } else {
          coords = {lat: response.lat, lon: response.lon};
        }
        const detailLocation = await getDetailLocation(coords.lat, coords.lon);
        currentLocation.value = {
          ...coords,
          name: `${detailLocation?.address.city}, ${detailLocation?.address.country}`,
          country: detailLocation?.address.country
        };
      }

      // currentLocation.value = {
      //   name: 'Đà Nẵng',
      //   lat: '16.068',
      //   lon: '108.212',
      //   country: 'VN'
      // };
    } catch (error) {
      console.error('[ERROR] getGeoCoordinates: ', error);
    }
  }

  const loadWishlists = () => {
    const storedValue = localStorage.getItem('wishlists');
    if (storedValue) {
      wishlists.value = new Map(JSON.parse(storedValue));
    }
  }

  const checkFavouriteLocation = (location) => {
    return wishlists.value.has(generateFavouriteLocationId(location))
  }

  function generateFavouriteLocationId(location) {
    return `${location.lat}_${location.lon}`;
  }

  const toggleWishlist = (location) => {
    const locationId = generateFavouriteLocationId(location);
    if (wishlists.value.has(locationId)) {
      wishlists.value.delete(locationId);
    } else {
      wishlists.value.set(locationId, location);
    }

    localStorage.setItem('wishlists', JSON.stringify([...wishlists.value]));
  }

  return {
    apiKey,
    wishlists,
    currentLocation,
    toggleWishlist,
    loadWishlists,
    isFavouriteLocation,
    getGeoCoordinates,
    checkFavouriteLocation
  }
}