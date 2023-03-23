import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Input,
  Select,
  Spacer,
  Spinner,
  Stack,
  Text,
  useToast,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import getSCCs from "../lib/getSCCs";
import CollectionInformation from "../components/collectionInformation";
import CollectionWTInformation from "../components/collectionWTInformation";
import MarketPlaceDistro from "../components/marketPlaceDistro";
import NFT from "../components/nft";
import getAllStoredCollectionNames from "../lib/getAllStoredCollectionNames";
import ExplanationETH from "../components/ExplanationETH";
import ExplanationSOL from "../components/ExplanationSOL";

const Graph = dynamic(() => import('../components/graph2d'), {
  ssr: false
})

let allSCCs: { nodes: any[]; links: any[] }
let allData = { nodes: [], links: [] }

export default function Index({ data }) {

  const [ collectionInput, setCollectionInput ] = useState('')
  const [ tokenInput, setTokenInput ] = useState('')
  const [ myData, setMyData ] = useState({ nodes: [], links: [] })
  const [ amountTrades, setAmountTrades ] = useState(0)
  const [ amountTradedNFTs, setAmountTradedNFTs ] = useState(0)
  const [ amountTrader, setAmountTrader ] = useState(0)
  const [ totalTradingVolume, setTotalTradingVolume ] = useState("0 (≈ 0.00€)")
  const [ loading, setLoading ] = useState(false)
  const [ loadingToken, setLoadingToken ] = useState(false)
  const [ loadingCalculation, setLoadingCalculation ] = useState(false)
  const [ amountWashtraders, setAmountWashtraders ] = useState(0)
  const [ amountWashtrades, setAmountWashtrades ] = useState(0)
  const [ amountWashTradedNFTs, setAmountWashTradedNFTs ] = useState(0)
  const [ washtradedVolume, setWashtradedVolume ] = useState("0 (≈ 0.00€)")
  const [ ratioOfVolumes, setRatioOfVolumes ] = useState(0)
  const [ marketplaceDistro, setMarketplaceDistro ] = useState([])
  const [ showingTokenTxs, setShowingTokenTxs ] = useState(false)
  const [ imageUrl, setImageUrl ] = useState("")
  const [ transactionTimeStamp, setTransactionTimeStamp ] = useState([])

  const errorToast = useToast({
    position: 'top',
    status: "error",
    title: `Error occured, please try again in a few minutes. If the error occurs multiple times, please try again in 24 hours`,
    containerStyle: {
      maxWidth: '100%',
    },
  })

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
        setMyData(await fetch(`/api/history/${collectionInput}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8",
            },
            credentials: "same-origin",
        }).then((res) => {
          if (res.status == 500) {
            setLoading(false)
            return null
          }
            return res.json()
        }).then(async (l) => {
          if (l == null) {
            setLoading(false)
            errorToast()
            return allData
          }
            setLoading(false)
            allData = l.data
            allSCCs = getSCCs(l.data)
            setAmountTrades(l.amountTrades)
            setAmountTradedNFTs(l.amountTradedNFTs)
            setAmountTrader(l.amountTrader)
            setTotalTradingVolume(l.totalTradingVolume)
            setMarketplaceDistro(l.marketplaceDistro)
            setTransactionTimeStamp(l.transactionTimeSpan)
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
    setAmountWashtraders(0)
    setAmountWashtrades(0)
    setAmountWashTradedNFTs(0)
    setWashtradedVolume("0 (≈ 0.00€)")
    setRatioOfVolumes(0)
    setCollectionInput(event.target.value)
  }

  function handleShowSCC(data: {nodes: any[], links: any[]}) {
    if (data.nodes.length == 0 && data.links.length == 0) {
      noWTtoast()
      return
    }
    setMyData(data)
  }

  function setTokenInputWrapper(event) {
    setTokenInput(event.target.value)
  }

  async function handleCalculateStatsClick() {
    console.log(tokenInput)
    setLoadingCalculation(true)
    const url = (tokenInput == '')
        ? `/api/washtrades/${collectionInput}`
        : `/api/washtrades/${collectionInput}?token=${tokenInput}`
    console.log('url: ', url)

    const data: {
      amountOfWashtraders: number,
      amountOfWashtrades: number,
      amountWashTradedNFTs: number,    
      washtradedVolume: string,
      ratioOfVolumes: number,
      marketplaceDistro: any[]
    } = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "same-origin",
    }).then(async (res) => await res.json())

    if (data.amountOfWashtraders == 0) {
      noWTtoast()
    } else {
      setMarketplaceDistro(data.marketplaceDistro)
    }

    setAmountWashtraders(data.amountOfWashtraders)
    setAmountWashtrades(data.amountOfWashtrades)
    setAmountWashTradedNFTs(data.amountWashTradedNFTs)
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
    setMyData(newData.data)
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
    setTransactionTimeStamp(newData.transactionTimeSpan)
    await handleCalculateStatsClick()
  }

  async function resetGraph() {
    setShowingTokenTxs(false)
    setTokenInput('')
    setImageUrl('')
    setLoadingToken(true)
    const fetchData = async () => {
      setMyData(await fetch(`/api/history/${collectionInput}`, {
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
        setTransactionTimeStamp(l.transactionTimeSpan)
        return l.data
      }))
    }
    await fetchData().then(() => {
        setLoadingToken(false);
    })
  }

  return (
      <Box h='100%'>
        <HStack>
          <Box w='80%'>
            <Center>
              <Input
                  defaultValue={collectionInput}
                  ml={3}
                  mt={3}
                  placeholder='Enter a NFT Collection'
                  variant='filled'
                  onKeyPress={e=> {
                    if (e.key === 'Enter') {
                      handleSubmit(e)
                    }
                  }}
              ></Input>
            </Center>
          </Box>
          <Box w='20%'>
            <Select
                placeholder='or Select collection'
                mt={3}
                mr={3}
                onChange={(value) => {
                  const { target } = value;

                  if (target.type === 'select-one') {
                    const selectValue: string = target.selectedOptions[0].value;
                    setCollectionInput(selectValue)
                  }
                }}
            >
              { data.map((value) => (
                  <option value={value} key={value}>{value}</option>
              ))
              }
            </Select>
          </Box>
        </HStack>

        {
          (loading)
          ? <Center><Spinner size='xl' /></Center>
          : <div>
              <div>
                  {(myData.nodes.length == 0 && myData.links.length == 0)
                  ? <Center>
                      <Stack direction='column'>
                        <Text textAlign="center" fontSize='2xl'>
                          Please enter the name of a NFT collection
                        </Text>
                        <Text textAlign="center" fontSize='l'>
                          (It is possible that the search takes a few minutes. That&apos;s the case when the collection is searched for the first time. Just leave the window open)
                        </Text>
                        <br/>
                        <br/>
                        <Stack direction='column'>
                          <Center>
                            <ExplanationSOL/>
                          </Center>
                          <Center>
                            <ExplanationETH/>
                          </Center>
                        </Stack>
                      </Stack>
                  </Center>
                  : <div>
                      <Flex>
                          <Box w='70%' borderWidth='2px' borderRadius='lg' overflow='hidden' m={[2, 3]} borderColor='gray.100'>
                              <Graph data={myData}></Graph>
                          </Box>
                          <Spacer/>
                          <Box w='30%' m={[2, 3]}>
                              <CollectionInformation
                                  amountTrades={amountTrades}
                                  amountTrader={amountTrader}
                                  amountTradedNFTs={amountTradedNFTs}
                                  totalTradingVolume={totalTradingVolume}
                              ></CollectionInformation>
                              <br/>
                              <Stack direction='column'>
                                  <CollectionWTInformation
                                      washTrades={amountWashtrades}
                                      washTrader={amountWashtraders}
                                      washTradedNFTs={amountWashTradedNFTs}
                                      totalWashTradedVolume={washtradedVolume}
                                      volumeRatio={ratioOfVolumes}
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
                                  <Center>
                                    <Text>
                                      <b>Timespan: </b> {new Date(transactionTimeStamp[0] * 1000).toUTCString()} - {new Date(transactionTimeStamp[1] * 1000).toUTCString()}
                                    </Text>
                                  </Center>
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

export async function getServerSideProps() {

  const storedCollections: string[] = await getAllStoredCollectionNames(undefined)

  console.log(storedCollections)

  return {
    props : {
      data: storedCollections
    }
  }
}
