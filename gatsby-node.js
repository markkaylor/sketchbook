const axios = require("axios")
const ypi = require("youtube-playlist-info")

require("dotenv").config({
  path: `.env`,
})

exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  // Get all playlist id's form youtube
  const result = await axios.get(
    `https://www.googleapis.com/youtube/v3/playlists?part=id%2C%20snippet&channelId=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_KEY}`
  )

  const playlistInfo = result.data.items.map(async playlist => {
    let info = await ypi(process.env.YOUTUBE_KEY, playlist.id)
    return Object.assign({
      playlistTitle: playlist.snippet.title,
      videos: info,
    })
  })

  const allYoutubePlaylist = await Promise.all(playlistInfo)

  // For each playlist id get playlist info
  allYoutubePlaylist.forEach(playlist => {
    createNode({
      playlist,
      id: playlist.playlistTitle,
      parent: null,
      children: [],
      internal: {
        type: `youtubePlaylist`,
        contentDigest: createContentDigest(playlist),
      },
    })
  })
}

// Create a page for each playlist
