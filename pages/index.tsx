import dynamic from "next/dynamic";
import Image from 'next/image'
import {useEffect, useState} from "react";
import {
  Input,
  Center,
  Text,
  Spinner,
  Flex, Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  TableContainer,
  Box, Button, Stack, Wrap, useToast, Td
} from '@chakra-ui/react'
import getSCCs from "../lib/getSCCs";

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
  const [ amaountWashtrader, setAmountWashtrader ] = useState(0)
  const [ washtradedVolume, setWashtradedVolume ] = useState(0)
  const [ ratioOfVolumes, setRatioOfVolumes ] = useState(0)
  const [ marketplaceDistro, setMarketplaceDistro ] = useState([])
  const [ showingTokenTxs, setShowingTokenTxs ] = useState(false)
  const [ imageUrl, setImageUrl ] = useState("")

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
    console.log(url)

    const data: {
      amountOfWashtraders: number,
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

    setAmountWashtrader(data.amountOfWashtraders)
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
    fetchData().then(() => setLoadingToken(false))
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
          : <div>{
              (data.nodes.length == 0 && data.links.length == 0)
                ? <Center>
                    <Stack direction='column'>
                      <Text textAlign="center" fontSize='xl'>
                        Please enter the name of a NFT collection
                      </Text>
                      <br/>
                      <br/>
                      <Text textAlign="center" fontSize='sm'>
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
                : <Flex>
                  <Box w='70%' borderWidth='2px' borderRadius='lg' overflow='hidden' m={[2, 3]}>
                    <Graph data={data}></Graph>
                  </Box>
                  <Spacer/>
                  <Box w='30%' m={[2, 3]}>
                    <Flex>
                      <Stack direction='column'>
                        <span><b>General Informations</b></span>
                        <span>Shown sales: <b>{amountTrades}</b></span>
                        <span>Shown sellers/buyers: <b>{amountTrader}</b></span>
                        <span>Traded NFTs: <b>{amountTradedNFTs}</b></span>
                        <span>Total trading volume: <b>{totalTradingVolume} SOL</b></span>
                      </Stack>
                      <Spacer/>
                      { (imageUrl.length == 0)
                          ? <div></div>
                          : <Box height='20%' width='20%'>
                            <Box borderRadius='lg' overflow='hidden'>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                  src={imageUrl}
                                  alt='example image'
                              />
                            </Box>

                          </Box>
                      }
                    </Flex>
                    <Box h='5'></Box>
                    <Wrap direction='column'>
                      <Input
                          m={[2, 3]}
                          placeholder='Enter a token address to check'
                          variant='filled'
                          value={tokenInput}
                          onInput={e => setTokenInputWrapper(e)}
                      ></Input>
                      <Stack direction='row'>
                        <Button onClick={async () => await getTokenHistory(tokenInput)} colorScheme='teal' variant='solid'>
                          Search
                        </Button>
                        {
                          showingTokenTxs
                            ? <Button onClick={async () => await resetGraph()} colorScheme='red' variant='solid'>
                                Reset
                              </Button>
                            : <div></div>
                        }
                        { (loadingToken)
                          ? <Spinner></Spinner>
                          : <div></div>
                        }
                      </Stack>
                      <Wrap direction='row' spacing={4}>
                        <Button onClick={() => handleShowSCC(allSCCs)}>Show washtrades</Button>
                        <Button onClick={() => handleShowSCC(allData)}>Show all</Button>
                      </Wrap>
                      <Stack direction='row'>
                        <Button onClick={() => handleCalculateStatsClick()} colorScheme='teal' variant='solid'>
                          Calculate washtrading statistic
                        </Button>
                        { (loadingCalculation)
                            ? <Spinner></Spinner>
                            : <div></div>
                        }
                      </Stack>
                      <br/>
                      <Box>
                        <Stack direction='column'>
                          <span><b>Wash trading information:</b></span>
                          <span>Amount of wash traders: <b>{amaountWashtrader}</b></span>
                          <span>Malicious trading volume: <b>{washtradedVolume} SOL</b></span>
                          <span>Share of malicious volume: <b>{ratioOfVolumes}%</b></span>
                          <br/>
                          <span><b>Marketplace distribution: </b></span>
                          <span>
                            <TableContainer>
                              <Table variant='simple'>
                                <TableCaption>Marketplace Distribution</TableCaption>
                                <Thead>
                                  <Tr>
                                    <Th>Marketplace</Th>
                                    <Th>Amount</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  { marketplaceDistro.map((value) => (
                                          <Tr key='marketDistro'>
                                            <Td>{value[0]}</Td>
                                            <Td>{value[1]}</Td>
                                          </Tr>
                                      )
                                    )
                                  }
                                </Tbody>
                              </Table>
                            </TableContainer>
                          </span>
                        </Stack>
                      </Box>
                    </Wrap>
                  </Box>
                </Flex>
        }</div>
        }
      </Box>
  )
}
