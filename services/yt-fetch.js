const { YtClient } = require("./yt-client")

async function retrieve(url, params, token) {
  return YtClient({
    method: "GET",
    url,
    params,
    token,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

module.exports = {
  retrieve,
}
