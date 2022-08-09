import dynamic from "next/dynamic";
import {useEffect, useState} from "react";

const Graph = dynamic(() => import('../components/graph2d'), {
  ssr: false
})

export default function Index() {

  const [ data, setData ] = useState({ nodes: [], links: [] })

  useEffect(() => {
    const fetchData = async () => {
      setData(await fetch('/api/history/degods', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        credentials: "same-origin",
      }).then((res) => res.json()))
    }
    fetchData().then();
  }, [])

  console.log('data before graph', data)

  return (
    <div>
      <Graph data={data}></Graph>
    </div>
  )
}
