import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {
  Input,
  Center,
  Text,
  Spinner,
  Flex, Spacer,
  Grid,
  GridItem, Box, Button, Stack
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

const Graph = dynamic(() => import('../components/graph2d'), {
  ssr: false
})

let allSCCs: { nodes: any[]; links: any[] }
let allData = { nodes: [], links: [] }

export default function Index(){

  const [ input, setInput ] = useState('')
  const [ data, setData ] = useState({ nodes: [], links: [] })
  const [ loading, setLoading ] = useState(false)
  const [ amaountWashtrader, setAmountWashtrader ] = useState(0)
  const [ washtradedVolume, setWashtradedVolume ] = useState(0)
  const [ ratioOfVolumes, setRatioOfVolumes ] = useState(0)

  useEffect(() => {
    if (input == '') {
      return
    }
    console.log('request to backend')
    setLoading(true)
    const fetchData = async () => {
      setData(await fetch(`/api/history/${input}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "same-origin",
      }).then((res) => res.json()).then((l) => {
        setLoading(false)
        console.log('sdfasdfasdfasdfasdf', l)
        allData = l
        allSCCs = getSCCs(l)
        return l
      }))
    }
    fetchData().then(() => {
      setLoading(false)
      console.log('data fetched')
    });
  }, [input])

  const handleSubmit = (event) => {
    setInput(event.target.value)
  }

  if (loading) return <Spinner size='xl' />

  function handleShowSCC(data: {nodes: any[], links: any[]}) {
    setData(data)
  }

  async function handleCalculateStatsClick() {
    const data: {
      amountOfWashtraders: number,
      washtradedVolume: number,
      ratioOfVolumes: number
    } = await fetch(`/api/washtrades/${input}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "same-origin",
    }).then((res) => res.json())

    setAmountWashtrader(data.amountOfWashtraders)
    setWashtradedVolume(data.washtradedVolume)
    setRatioOfVolumes(data.ratioOfVolumes * 100)
  }

  return (
      <Box h='100%'>
        <Center>
          <Input
              defaultValue={input}
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
          (data.nodes.length == 0 && data.links.length == 0)
            ? <Center>
                <Text
                    textAlign="center"
                >
                  Please enter the name of a NFT collection
                </Text>
              </Center>
            : <Flex>
                <Box w='70%' borderWidth='2px' borderRadius='lg' overflow='hidden' m={[2, 3]}>
                  <Graph data={data}></Graph>
                </Box>
                <Spacer />
                <Box w='30%' m={[2, 3]}>
                  <Stack direction='row' spacing={4}>
                    <Button onClick={() => handleShowSCC(allSCCs)}>Show washtrades</Button>
                    <Button onClick={() => handleShowSCC(allData)}>Show all</Button>
                    <Button onClick={() => handleCalculateStatsClick()} colorScheme='teal' variant='solid'>
                      Calculate washtrading statistic
                    </Button>
                  </Stack>
                </Box>
                <Box>
                  <Stack direction='column'>
                    <span>{amaountWashtrader}</span>
                    <br/>
                    <span>{washtradedVolume} SOl</span>
                    <br/>
                    <span>{ratioOfVolumes} %</span>
                    <br/>
                  </Stack>
                </Box>
              </Flex>
        }
      </Box>
  )
}
