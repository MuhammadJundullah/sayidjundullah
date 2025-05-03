import React from 'react'

const Page = ({ params }: { params: { [key: string]: string | string[] } }) => {
    return (
        <div>
            <h1>Params:</h1>
            <pre>{JSON.stringify(params, null, 2)}</pre>
        </div>
    )
}

export default Page