// initialize unsplash
import { createApi } from 'unsplash-js'

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
})
const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&radius=30000&limit=${limit}`
}

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 40,
  })
  const unsplashResult = photos.response.results
  return unsplashResult.map((result) => result.urls['small'])
}

export const fetchCoffeeStores = async (
  latLong = '-8.6565871,115.242866',
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos()
  const response = await fetch(
    getUrlForCoffeeStores(latLong, 'coffee shop', limit),
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  )
  const data = await response.json()
  return data.results.map((result, index) => ({
    id: result.fsq_id,
    name: result.name,
    address: result.location.address || '',
    neighborhood:
      result.location.neighborhood || result.location.cross_street || '',
    imgUrl: photos[index],
  }))
}
