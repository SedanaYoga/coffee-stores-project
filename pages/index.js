import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'
import { fetchCoffeeStores } from '../lib/coffee-stores'
import useTrackLocation from '../hooks/use-track-location'
import { useEffect, useState, useContext } from 'react'
import { ACTION_TYPES, StoreContext } from '../store/store-context'

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStores,
    },
  }
}

export default function Home(props) {
  // const [coffeeStores, setCoffeeStores] = useState([])
  const { dispatch, state } = useContext(StoreContext)
  const { coffeeStores, latLong } = state
  const [coffeeStoresError, setCoffeeStoresError] = useState(null)
  const { isFindingLocation, handleTrackLocation, locationErrorMsg } =
    useTrackLocation()
  const handleOnBannerBtnClick = () => {
    console.log('Hi banner button!')
    handleTrackLocation()
  }

  useEffect(() => {
    const fetchData = async () => {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30)
          console.log({ fetchedCoffeeStores })
          // setCoffeeStores(fetchedCoffeeStores)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: fetchedCoffeeStores },
          })
        } catch (err) {
          console.log({ err })
          setCoffeeStoresError(err.message)
        }
      }
    }
    fetchData()
  }, [latLong])

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Loading...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && `Something went wrong: ${locationErrorMsg}`}
        {coffeeStoresError && `Something went wrong: ${coffeeStoresError}`}
        <div className={styles.heroImage}>
          <Image src='/static/hero-image.png' width={700} height={400} />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores Near Me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                )
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores in Denpasar</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
