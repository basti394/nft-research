
export async function getStaticProps() {

    const response = await fetch('http://localhost:3000/api/hello')
    const data = await response.json()

    return {
        props: { test: data }
    }
}

export function Hello({ test }) {

    return (
        <div>
            <h1>{test.name}</h1>
        </div>
    )
}

export default Hello
