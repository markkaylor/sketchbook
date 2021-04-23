const axios = require("axios")

const YtClient = axios.create({
  baseURL: `https://www.googleapis.com/youtube/v3`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

module.exports = {
  YtClient,
}
