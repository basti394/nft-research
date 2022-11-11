import dynamic from "next/dynamic";
import Image from 'next/image'
import {useEffect, useState} from "react";
import {
    Input,
    Center,
    Text,
    Spinner,
    Flex, Spacer,
    Box, Button, Stack, Wrap, useToast, WrapItem,
} from '@chakra-ui/react'
import getSCCs from "../lib/getSCCs";
import CollectionInformation from "../components/collectionInformation";
import getSOLPrice from "../lib/getSOLPrice";
import CollectionWTInformation from "../components/collectionWTInformation";
import MarketPlaceDistro from "../components/marketPlaceDistro";
import NFT from "../components/nft";

const Graph = dynamic(() => import('../components/graph2d'), {
  ssr: false
})

let allSCCs: { nodes: any[]; links: any[] }
let allData = { nodes: [], links: [] }

export default function Index(){

  const [ collectionInput, setCollectionInput ] = useState('')
  const [ tokenInput, setTokenInput ] = useState('')
  const [ data, setData ] = useState({ nodes: [], links: [] })
  const [ amountTrades, setAmountTrades ] = useState(0)
  const [ amountTradedNFTs, setAmountTradedNFTs ] = useState(0)
  const [ amountTrader, setAmountTrader ] = useState(0)
  const [ totalTradingVolume, setTotalTradingVolume ] = useState(0)
  const [ loading, setLoading ] = useState(false)
  const [ loadingToken, setLoadingToken ] = useState(false)
  const [ loadingCalculation, setLoadingCalculation ] = useState(false)
  const [ amountWashtraders, setAmountWashtraders ] = useState(0)
  const [ amountWashtrades, setAmountWashtrades ] = useState(0)
  const [ washtradedVolume, setWashtradedVolume ] = useState(0)
  const [ ratioOfVolumes, setRatioOfVolumes ] = useState(0)
  const [ marketplaceDistro, setMarketplaceDistro ] = useState([])
  const [ showingTokenTxs, setShowingTokenTxs ] = useState(false)
  const [ imageUrl, setImageUrl ] = useState("")
  const [ solPrice, setSolPrice ] = useState(0)

  const noWTtoast = useToast({
    position: 'bottom-right',
    title: `No wash trading happened in these transactions`,
    containerStyle: {
      maxWidth: '100%',
    },
  })

  const noTransactionToast = useToast({
    position: 'bottom-right',
    title: `No transactions found with this token`,
    containerStyle: {
      maxWidth: '100%',
    },
  })

  useEffect(() => {
    if (collectionInput == '') {
      return
    }
    console.log('request to backend')
    setLoading(true)
    const fetchData = async () => {
        setData(await fetch(`/api/history/${collectionInput}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8",
            },
            credentials: "same-origin",
        }).then((res) => {
            return res.json()
        }).then(async (l) => {
            setLoading(false)
            allData = l.data
            allSCCs = getSCCs(l.data)
            setAmountTrades(l.amountTrades)
            setAmountTradedNFTs(l.amountTradedNFTs)
            setAmountTrader(l.amountTrader)
            setTotalTradingVolume(l.totalTradingVolume)
            setMarketplaceDistro(l.marketplaceDistro)
            setSolPrice(await getSOLPrice())
            return l.data
        }))
    }
    fetchData().then(() => {
      setLoading(false)
      console.log('data fetched')
    });
  }, [collectionInput])

  const handleSubmit = (event) => {
    console.log('LOL')
    if (event.target.value == collectionInput) return
    setCollectionInput(event.target.value)
  }

  function handleShowSCC(data: {nodes: any[], links: any[]}) {
    if (data.nodes.length == 0 && data.links.length == 0) {
      noWTtoast()
      return
    }
    setData(data)
  }

  function setTokenInputWrapper(event) {
    setTokenInput(event.target.value)
  }

  async function handleCalculateStatsClick() {
    setLoadingCalculation(true)
    const url = (tokenInput == '')
        ? `/api/washtrades/${collectionInput}`
        : `/api/washtrades/${collectionInput}?token=${tokenInput}`
    console.log('url: ', url)

    const data: {
      amountOfWashtraders: number,
      amountOfWashtrades: number
      washtradedVolume: number,
      ratioOfVolumes: number,
      marketplaceDistro: any[]
    } = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "same-origin",
    }).then(async (res) => await res.json())

    if (data.amountOfWashtraders == 0 || data.washtradedVolume == 0) {
      noWTtoast()
    } else {
      setMarketplaceDistro(data.marketplaceDistro)
    }

    setAmountWashtraders(data.amountOfWashtraders)
    setAmountWashtrades(data.amountOfWashtrades)
    setWashtradedVolume(data.washtradedVolume)
    setRatioOfVolumes(data.ratioOfVolumes * 100)
    setLoadingCalculation(false)
  }

  async function getTokenHistory(token) {
    if (token.length == 0) return
    setLoadingToken(true)
    console.log('LOL2')
    console.log(token)
    const newData = await fetch(`/api/history/${collectionInput}/${tokenInput}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "same-origin",
    }).then(async (res) => {
      return await res.json()
    })
    console.log(newData)
    if (newData.data.nodes.length == 0) {
      noTransactionToast()
      setLoadingToken(false)
      return
    }
    setData(newData.data)
    allData = newData.data
    allSCCs = getSCCs(newData.data)
    setAmountTrades(newData.amountTrades)
    setAmountTradedNFTs(newData.amountTradedNFTs)
    setAmountTrader(newData.amountTrader)
    setTotalTradingVolume(newData.totalTradingVolume)
    setImageUrl(newData.imageUrl)
    setLoadingToken(false)
    setShowingTokenTxs(true)
    setMarketplaceDistro(newData.marketplaceDistro)
    await handleCalculateStatsClick()
  }

  async function resetGraph() {
    setShowingTokenTxs(false)
    setTokenInput('')
    setImageUrl('')
    setLoadingToken(true)
    const fetchData = async () => {
      setData(await fetch(`/api/history/${collectionInput}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "same-origin",
      }).then((res) => {
        return res.json()
      }).then((l) => {
        setLoading(false)
        allData = l.data
        allSCCs = getSCCs(l.data)
        setAmountTrades(l.amountTrades)
        setAmountTradedNFTs(l.amountTradedNFTs)
        setAmountTrader(l.amountTrader)
        setTotalTradingVolume(l.totalTradingVolume)
        setMarketplaceDistro(l.marketplaceDistro)
        return l.data
      }))
    }
    await fetchData().then(() => {
        setLoadingToken(false);
    })
  }

  return (
      <Box h='100%'>
        <Center>
          <Input
              defaultValue={collectionInput}
              m={[2, 3]}
              placeholder='Enter a NFT Collection'
              variant='filled'
              onKeyPress={e=> {
                if (e.key === 'Enter') {
                  handleSubmit(e)
                }
              }}
          ></Input>
        </Center>
        {
          (loading)
          ? <Center><Spinner size='xl' /></Center>
          : <div>
              <div>
                  {(data.nodes.length == 0 && data.links.length == 0)
                  ? <Center>
                      <Stack direction='column'>
                          <Text textAlign="center" fontSize='2xl'>
                              Please enter the name of a NFT collection
                          </Text>
                          <br/>
                          <br/>
                          <Text textAlign="center" fontSize='2xl'>
                              Please consider using the name from the URL of the collection on MagicEden
                          </Text>
                          <div>
                              <Box margin='auto' width='60%' height='60%' borderRadius='lg' overflow='hidden'>
                                  <Image
                                      src={require('../assets/example_name.png')}
                                      alt='example image'
                                  />
                              </Box>
                          </div>
                      </Stack>
                  </Center>
                  : <div>
                      <Flex>
                          <Box w='70%' borderWidth='2px' borderRadius='lg' overflow='hidden' m={[2, 3]} borderColor='gray.100'>
                              <Graph data={data}></Graph>
                          </Box>
                          <Spacer/>
                          <Box w='30%' m={[2, 3]}>
                              <CollectionInformation
                                  amountTrades={amountTrades}
                                  amountTrader={amountTrader}
                                  amountTradedNFTs={amountTradedNFTs}
                                  totalTradingVolume={totalTradingVolume}
                                  solPrice={solPrice}
                              ></CollectionInformation>
                              <br/>
                              <Stack direction='column'>
                                  <CollectionWTInformation
                                      washTrades={amountWashtrades}
                                      washTrader={amountWashtraders}
                                      totalWashTradedVolume={washtradedVolume}
                                      volumeRatio={ratioOfVolumes}
                                      solPrice={solPrice}
                                      ></CollectionWTInformation>
                                  <Box w='30%'>
                                      <Button
                                          onClick={() => handleCalculateStatsClick()}
                                          isLoading={loadingCalculation}
                                          loadingText='Calculate washtrading statistic'
                                          backgroundColor='#0079B6'
                                          color='white'
                                          colorScheme='blue'
                                          variant='solid'
                                          >
                                          Calculate washtrading statistic
                                      </Button>
                                  </Box>
                                </Stack>
                              <br/>
                              <Stack direction='column'>
                                  <Input
                                      placeholder='Enter a token address to check'
                                      variant='filled'
                                      value={tokenInput}
                                      onInput={e => setTokenInputWrapper(e)}
                                  ></Input>
                                  <Wrap direction='row'>
                                      <WrapItem>
                                          <Button onClick={async () => await getTokenHistory(tokenInput)} isLoading={loadingToken} loadingText='Search' backgroundColor='#0079B6' color='white' colorScheme='blue'  variant='solid'>
                                             Search
                                          </Button>
                                      </WrapItem>

                                      <WrapItem>
                                          {
                                              showingTokenTxs
                                              ? <Button onClick={async () => await resetGraph()} colorScheme='red' variant='solid'>
                                                  Reset
                                              </Button>
                                              : <div></div>
                                          }
                                      </WrapItem>

                                      <WrapItem>
                                          <NFT image={imageUrl}></NFT>
                                      </WrapItem>
                                  </Wrap>
                                  <br/>
                                  <Wrap direction='row' spacing={4}>
                                      <Button onClick={() => handleShowSCC(allSCCs)}>Show washtrades</Button>
                                      <Button onClick={() => handleShowSCC(allData)}>Show all</Button>
                                  </Wrap>
                                  <br/>
                                  {/* eslint-disable-next-line react/jsx-no-undef */}
                                  <MarketPlaceDistro marketplaceDistro={marketplaceDistro}></MarketPlaceDistro>
                              </Stack>
                          </Box>
                      </Flex>
                  </div> }
                </div>
        </div>
        }
      </Box>
  )
}
