import dynamic from "next/dynamic";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {gql} from "apollo-server-micro";
import {repeat} from "rxjs/operators";
import {useEffect, useState} from "react";
import {async} from "rxjs";

const Graph = dynamic(() => import('../components/graph2d'), {
  ssr: false
})

// export async function getStaticProps() {
//
//   return {
//     props: {
//       data
//     }
//   }
// }

  const client = new ApolloClient({
    uri: 'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  })
  const getData = async () => {
    try {
      const res = await client.query({
        query: gql`
          {
            users {
              address
              soldTo {
                address
               }
              soldToConnection {
                edges{
                  price
                  marketplace
                }
              }
            }
          }`
    });
    return formatData(res.data)
  } catch (err) {
    console.log(err);
  }
}

const formatData = (data) => {
  const nodes = []
  const links = []

  if (!data?.users) {
    return { nodes, links }
  }

  data?.users.forEach( (user) => {

    if (user.address == '8GSiZbxkd6nR2sNRftCNuAaPyX9Aoa9ER8RsiZDNzGuM') {
      nodes.push({
        id: user.address,
        group: 2
      })
    } else {
      nodes.push({
        id: user.address,
        group: 1
      })
    }

    if (user.soldTo != null && user.soldToConnection != null) {
      user.soldTo.forEach((soldTo, index) => {

        let previous = 0;

        links.forEach((link) => {
          if ((link.source == user.address || link.source == soldTo.address) && (link.target == user.address || link.target == soldTo.address)) {
            previous = previous + 1;
          }
        })

        if (previous % 2 == 0) {
          links.push({
            source: user.address,
            target: soldTo.address,
            curvature: 0.3 * previous,
            name: `price: ${user.soldToConnection.edges[index].price} SOL \n marketplace: ${user.soldToConnection.edges[index].marketplace}`
          })
        } else {
          links.push({
            source: user.address,
            target: soldTo.address,
            curvature: -0.3 * previous,
            name: `price: ${user.soldToConnection.edges[index].price} SOL \n marketplace: ${user.soldToConnection.edges[index].marketplace}`
          })
        }

      });
    }
  })

  return { nodes, links }
}


export default function Index() {

  const [ data, setData ] = useState({ nodes: [], links: [] })

  useEffect(() => {

    const fetchData = async () => {
      setData(await getData())
    }
    fetchData().then();
  }, [])
  // const data = await getData();

  return (
      <div>
        <Graph data={data}></Graph>
      </div>
  )
}

// import dynamic from "next/dynamic";
// import {ApolloClient, InMemoryCache} from "@apollo/client";
// import {gql} from "apollo-server-micro";
//
// const CytoscapeComponent = dynamic(() => import('../lib/CytoscapeComponent'), {
//   ssr: false
// })
//
// const layout = {
//   name: 'random'
// }
//
// const formatData = (data) => {
//   const nodes = []
//   const edges = []
//
//   if (!data.users) {
//     return { nodes, edges }
//   }
//
//   data.users.forEach( (user) => {
//     nodes.push({
//       data: {
//         id: user.address,
//         label: 'user.address'
//       },
//       position: { x: 0, y: 0 }
//     })
//
//     if (user.soldTo) {
//       edges.push({
//         data: {
//           source: user.address,
//           target: user.soldTo.address,
//           label: 'asdf'
//         }
//       })
//     }
//   })
//
//   return { nodes, edges }
// }
//
// export async function getStaticProps() {
//
//   const client = new ApolloClient({
//     uri: 'http://localhost:3000/api/graphql',
//     cache: new InMemoryCache(),
//   })
//
//   const { data, loading, networkStatus } = await client.query({
//     query: gql`
//         {
//           users {
//             address
//             soldTo {
//               address
//              }
//             soldToConnection {
//               edges{
//                 price
//                 marketplace
//               }
//             }
//           }
//         }`
//   })
//
//   return {
//     props: {
//       data
//     }
//   }
// }
//
// export default function Graph({ data }) {
//
//   const { nodes, edges } = formatData(data)
//
//   edges.forEach((value) => nodes.push(value))
//
//   return <CytoscapeComponent
//       // @ts-ignore
//       elements={ nodes }
//       style={ { width: '1000px', height: '700px' } }
//       layout={ layout }
//   />;
// }
