import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {
  Input,
  Center,
  Text,
  Spinner,
  Flex, Spacer,
  Grid,
  GridItem, Box, Button
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

const Graph = dynamic(() => import('../components/graph2d'), {
  ssr: false
})

let allTokenGraphs = []
let allData = { nodes: [], links: [] }

export default function Index(){

  const [ input, setInput ] = useState('')
  const [ data, setData ] = useState({ nodes: [], links: [] })
  const [ loading, setLoading ] = useState(false)

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
        allTokenGraphs = getSingleTokenGraph(l)
        return l
      }))
    }
    fetchData().then(() => setLoading(false));
  }, [input])

  const handleSubmit = (event) => {
    setInput(event.target.value)
  }

  console.log('<sdfasdfasfasdf', allTokenGraphs)

  if (loading) return <Spinner size='xl' />

  function handleTokenSelect(data: {nodes: any[], links: any[]}) {
    setData(data)
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
                  <Menu>
                    <MenuButton as={Button} w='100%'>
                      Select Token
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => handleTokenSelect(allData)}>
                        Entire Collection
                      </MenuItem>
                      <MenuDivider />
                      {
                        allTokenGraphs.map(element =>
                        <MenuItem
                            key={element.index}
                            onClick={() => handleTokenSelect(element)}
                        >
                          {element.links[0].token}
                        </MenuItem>)
                      }
                    </MenuList>
                  </Menu>
                </Box>
              </Flex>
        }
      </Box>
  )
}
