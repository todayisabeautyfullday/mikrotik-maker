addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const servers = [
  {
    url: "http://server1.example.com",
    weight: 1
  },
  {
    url: "http://server2.example.com",
    weight: 2
  }
];

let currentServerIndex = 0;

async function handleRequest(request) {
  let response;

  for (let i = 0; i < servers.length; i++) {
    let url = servers[currentServerIndex].url + request.url;
    currentServerIndex = (currentServerIndex + 1) % servers.length;
    
    try {
      response = await fetch(url, request);
      if (response.ok) {
        break;
      }
    } catch (error) {
      console.error("Error during fetch: " + error);
    }
  }

  if (!response) {
    response = new Response("All servers are down", {
      status: 503,
      statusText: "Service Unavailable"
    });
  }

  return response;
}
