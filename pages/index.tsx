import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {
  Input,
  Center,
  Text,
  Spinner,
  Grid,
  GridItem, Box
} from '@chakra-ui/react'
import TokenGraph from "../components/tokenGraph";
import styles from "../styles/Home.module.css";
import getSingleTokenGraph from "../lib/getSingleTokenGraphs";
import {element} from "prop-types";

const Graph = dynamic(() => import('../components/graph2d'), {
  ssr: false
})

export default function Index() {

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
        return l
      }))
    }
    fetchData().then(() => setLoading(false));
  }, [input])

  console.log('data before graph', data)

  const handleSubmit = (event) => {
    setInput(event.target.value)
  }

  let tokenGraphs = getSingleTokenGraph(data)

  if (loading) return <Spinner size='xl' />

  return (
      <div>
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
            : <Center>
                <Box maxW='100xl' maxH='6xl' borderWidth='1px' borderRadius='lg' overflow='hidden' m={[2, 3]}>
                  <Graph data={data}></Graph>
                </Box>
            </Center>
        }
        <section className={styles.grid}>
          {
            tokenGraphs.map(element => <TokenGraph data={element} key={element.index}></TokenGraph>)
          }
        </section>
      </div>
  )
}
