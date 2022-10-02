import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {
  Input,
  Center,
  Text,
  Spinner,
  Flex, Spacer,
  Grid,
  GridItem, Box, Button, Stack, Wrap, useToast
} from '@chakra-ui/react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import styles from "../styles/Home.module.css";
import getSingleTokenGraph from "../lib/getSingleTokenGraphs";
import {element} from "prop-types";
import getSCCs from "../lib/getSCCs";
import {name} from "next/dist/telemetry/ci-info";

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
  const [ marketplaceDistro, setMarketplaceDistro ] = useState(new Map<string, number>())
  const [ showingTokenTxs, setShowingTokenTxs ] = useState(false)

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
    const data: {
      amountOfWashtraders: number,
      washtradedVolume: number,
      ratioOfVolumes: number,
      marketplaceDistro: Map<string, number>
    } = await fetch(`/api/washtrades/${collectionInput}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "same-origin",
    }).then(async (res) => await res.json())

    if (data.amountOfWashtraders == 0 || data.washtradedVolume == 0) {
      noWTtoast()
    }

    setAmountWashtrader(data.amountOfWashtraders)
    setWashtradedVolume(data.washtradedVolume)
    setRatioOfVolumes(data.ratioOfVolumes * 100)
    setMarketplaceDistro(data.marketplaceDistro)
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
    setLoadingToken(false)
    setShowingTokenTxs(true)
  }

  async function resetGraph() {
    setShowingTokenTxs(false)
    setTokenInput("")
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
                    <Text textAlign="center">
                      Please enter the name of a NFT collection
                    </Text>
                  </Center>
                  : <Flex>
                    <Box w='70%' borderWidth='2px' borderRadius='lg' overflow='hidden' m={[2, 3]}>
                      <Graph data={data}></Graph>
                    </Box>
                    <Spacer/>
                    <Box w='30%' m={[2, 3]}>
                      <Stack direction='column'>
                        <span><b>General Informations</b></span>
                        <span>Shown sales: <b>{amountTrades}</b></span>
                        <span>Shown sellers/buyers: <b>{amountTrader}</b></span>
                        <span>Traded NFTs: <b>{amountTradedNFTs}</b></span>
                        <span>Total trading volume: <b>{totalTradingVolume} SOL</b></span>
                      </Stack>
                      <Box h='5'></Box>
                      <Wrap>
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

                        </Stack>

                        { (loadingToken)
                            ? <Spinner></Spinner>
                            : <div></div>
                        }
                        <br/>
                        <Wrap direction='row' spacing={4}>
                          <Button onClick={() => handleShowSCC(allSCCs)}>Show washtrades</Button>
                          <Button onClick={() => handleShowSCC(allData)}>Show all</Button>
                          <Stack direction='row'>
                            <Button onClick={() => handleCalculateStatsClick()} colorScheme='teal' variant='solid'>
                              Calculate washtrading statistic
                            </Button>
                            { (loadingCalculation)
                                ? <Spinner></Spinner>
                                : <div></div>
                            }
                          </Stack>

                        </Wrap>
                        <Box>
                          <Stack direction='column'>
                            <span><b>Wash trading information:</b></span>
                            <span>Amount of wash traders: <b>{amaountWashtrader}</b></span>
                            <span>Malicious trading volume: <b>{washtradedVolume} SOL</b></span>
                            <span>Share of malicious volume: <b>{ratioOfVolumes}%</b></span>
                            <br/>
                            <span><b>Marketplace distribution: </b></span>
                            <span></span>
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
