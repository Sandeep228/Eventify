import React, {useState, useEffect} from "react";

function Event() {
  const [data, setData] = useState()

  const GetEventsQuery = `
    query EventCollection($first: Int!) {
      eventCollection(first: $first) {
        edges {
          node {
            id
            name
            description
            createdAt
          }
        }
      }
    }
  `


  const fetchData = async () => {
    const response = await fetch('https://eventify-main-pujaagarwal5263.grafbase.app/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTE3NzcyNjYsImlzcyI6ImdyYWZiYXNlIiwiYXVkIjoiMDFIN0pXR1gwUjVNN0ZQUjkzV1pNQUtGMzgiLCJqdGkiOiIwMUg3SldHWDhRNVlWTVc1RkI0RDJFQ1dTUiIsImVudiI6InByb2R1Y3Rpb24iLCJwdXJwb3NlIjoicHJvamVjdC1hcGkta2V5In0.CnKts9fBm59UJw5enBJIgrXAIhLqvK_CGchRa--qw-Y'
      },
      body: JSON.stringify({
        query: GetEventsQuery,
        variables: {
          first: 100
        }
      })
    })

    const result = await response.json()
    setData(result)
  }

  useEffect(() => {
    fetchData()
  },[])
  
  return (
  <div>
    <div>Event</div>
    {data && (
        <>
          <ul>
            {data.data.eventCollection?.edges?.map(({ node }) => (
              <li key={node.id}>
                {node.name} - {node.description} - {node.createdAt}
              </li>
            ))}
          </ul>
        </>
      )}
  </div>
  );
}

export default Event;
