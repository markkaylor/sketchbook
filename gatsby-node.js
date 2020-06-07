const axios = require("axios")
const path = require(`path`)
const _ = require("lodash")

require("dotenv").config({
  path: `.env`,
})

exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  const response = await axios.post(
    `https://oauth2.googleapis.com/token?client_id=${process.env.YOUTUBE_CLIENT_ID}&client_secret=${process.env.YOUTUBE_CLIENT_SECRET}&refresh_token=${process.env.YOUTUBE_REFRESH_TOKEN}&grant_type=refresh_token`
  )

  const token = response.data.access_token
  // Get all playlists from youtube channel
  const ytPlaylists = await axios.get(
    `https://www.googleapis.com/youtube/v3/playlists?&access_token=${token}&part=id%2C%20status%2C%20snippet&channelId=${process.env.YOUTUBE_CHANNEL_ID}&key=${process.env.YOUTUBE_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  // Loop through each playlist
  const playlistInfo = ytPlaylists.data.items.map(async playlist => {
    // Get all the videos from the playlist
    let playlistVideos = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?&access_token=${token}&part=snippet&playlistId=${playlist.id}&key=${process.env.YOUTUBE_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    // Get the id's for each video in the playlist
    const videos = playlistVideos.data.items.map(
      video => video.snippet.resourceId.videoId
    )

    // Get the tags for each video
    const allTags = videos.map(async id => {
      // Call youtube again for more data on the

      const ytVideo = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?&access_token=${token}&part=snippet&id=${id}&key=${process.env.YOUTUBE_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Save the tags
      const ytVideoTags = ytVideo.data.items[0].snippet.tags
      // Put the tags on their video object
      playlistVideos.data.items.filter(video => {
        if (ytVideoTags && video.snippet.resourceId.videoId === id) {
          video.tags = ytVideoTags
        }
      })

      // Return on big array with all the tags from each video in the playlist
      return ytVideoTags
    })

    const playlistTags = await Promise.all(allTags)
    const cleanPlaylistTags = playlistTags
      .flat()
      .filter(tag => tag !== undefined)

    return Object.assign({
      playlistTitle: playlist.snippet.title,
      playlistPublishedAt: playlist.snippet.publishedAt,
      playlistDescription: playlist.snippet.description,
      playlistTags: cleanPlaylistTags,
      videos: playlistVideos,
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
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query allPlaylistQuery {
      allYoutubePlaylist {
        edges {
          node {
            playlist {
              videos {
                data {
                  items {
                    snippet {
                      channelId
                      channelTitle
                      description
                      playlistId
                      position
                      publishedAt
                      resourceId {
                        kind
                        videoId
                      }
                    }
                    tags
                  }
                }
              }
              playlistTitle
              playlistTags
            }
          }
        }
      }
    }
  `)
  result.data.allYoutubePlaylist.edges.forEach(({ node }) => {
    createPage({
      path: _.kebabCase(node.playlist.playlistTitle),
      component: path.resolve(`./src/templates/project-playlist.js`),
      context: {
        title: node.playlist.playlistTitle,
      },
    })
  })
}
