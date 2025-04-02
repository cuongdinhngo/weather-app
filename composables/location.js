export const useLocation = () => {

  const runtimeConfig = useRuntimeConfig();
  const apiKey = useState('apiKey', () => runtimeConfig.public.apiKey);
  const apiUrl = useState('apiUrl', () => runtimeConfig.public.apiUrl);
  const wishlists = useState('wishlists', () => new Map());
  const currentLocation = useState('currentLocation', () => null);

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
        if (response[0]) {
          currentLocation.value = {
            name: response[0].name,
            lat: response[0].lat,
            lon: response[0].lon,
            country: response[0].country
          };
        } else {
          currentLocation.value = {
            name: response.name,
            lat: response.lat,
            lon: response.lon,
            country: response.country
          };
        }
      }

      // currentLocation.value = {
      //   name: 'Đà Nẵng',
      //   lat: '16.068',
      //   lon: '108.212',
      //   country: 'VN'
      // };
      console.log('current location --> ', currentLocation.value)
    } catch (error) {
      console.error('[ERROR] getGeoCoordinates: ', error);
      currentLocation.value = null;
    }
  }

  const loadWishlists = () => {
    const storedValue = localStorage.getItem('wishlists');
    if (storedValue) {
      wishlists.value = new Map(JSON.parse(storedValue));
    }
    console.log(wishlists.value)
  }

  const toggleWishlist = (location) => {
    const locationId = `${location.lat}_${location.lon}`;
    if (wishlists.value.has(locationId)) {
      wishlists.value.delete(locationId);
    } else {
      wishlists.value.set(locationId, location);
    }

    localStorage.setItem('wishlists', JSON.stringify([...wishlists.value]));
  }

  return {
    wishlists,
    currentLocation,
    getGeoCoordinates,
    toggleWishlist,
    loadWishlists
  }
}