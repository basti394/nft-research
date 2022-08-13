import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {
  Input,
  Center, Text, Spinner
} from '@chakra-ui/react'


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

  if (loading) return <Spinner size='xl' />

  return (
      <div>
        <Center>
          <Input
              m={[2, 3]}
              placeholder='Enter a NFT Collection'
              variant='filled'
              onKeyPress={e=> {
                if (e.key === 'Enter') {
                  handleSubmit(e)
                  console.log('sdfsadfsadfsadf')
                }
              }}
          ></Input>
        </Center>
        {
          (data.nodes.length == 0 && data.links.length == 0)
            ? <Center>
                <Text
                    textAlign="center">
                  Bitte geb eine Kollektion ein
                </Text>
              </Center>
            : <div><Graph data={data}></Graph></div>
        }
      </div>
  )
}
