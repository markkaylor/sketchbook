const axios = require("axios")
const path = require(`path`)
const _ = require("lodash")
const { retrieve } = require("./services/yt-fetch")

require("dotenv").config({
  path: `.env`,
})

exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  // Get fresh access token
  const response = await axios.post(
    `https://oauth2.googleapis.com/token?client_id=${process.env.YOUTUBE_CLIENT_ID}&client_secret=${process.env.YOUTUBE_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${process.env.YOUTUBE_REFRESH_TOKEN}`
  )

  const token = response.data.access_token

  const ytPlaylists = await retrieve(
    `/playlists`,
    {
      access_token: token,
      part: "status, snippet",
      channelId: process.env.YOUTUBE_CHANNEL_ID,
    },
    token
  )

  // Loop through each playlist
  const playlistInfo = ytPlaylists.data.items.map(async playlist => {
    // Get all the videos from the playlist
    let playlistVideos = await retrieve(
      `/playlistItems`,
      {
        access_token: token,
        maxResults: "50",
        part: "snippet",

        playlistId: playlist.id,
      },
      token
    )
    // Get the id's for each video in the playlist
    const videos = playlistVideos.data.items.map(
      video => video.snippet.resourceId.videoId
    )

    // Get the tags for each video
    const allTags = videos.map(async id => {
      // Call youtube again for more data on the video
      const ytVideo = await retrieve(
        `/videos`,
        {
          access_token: token,
          part: "snippet",
          id: id,
        },
        token
      )

      // Save the tags
      const ytVideoTags = ytVideo.data.items[0].snippet.tags

      // Put the tags on their video object
      playlistVideos.data.items.filter(video => {
        if (ytVideoTags && video.snippet.resourceId.videoId === id) {
          video.tags = ytVideoTags
        }
      })

      // Combine all video tags into one big array for the playlist
      return ytVideoTags
    })

    const playlistTags = await Promise.all(allTags)
    const cleanPlaylistTags = playlistTags
      .flat()
      .filter(tag => tag !== undefined)

    const result = {
      playlistTitle: playlist.snippet.title,
      playlistPublishedAt: playlist.snippet.publishedAt,
      playlistDescription: playlist.snippet.description,
      playlistTags: cleanPlaylistTags,
      videos: playlistVideos,
    }

    return result
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
    // Temporarily only create a page for sketchbook
    if (node.playlist.playlistTitle === "Sketchbook") {
      createPage({
        path: `/projects/${_.kebabCase(node.playlist.playlistTitle)}`,
        component: path.resolve(`./src/templates/project-playlist.js`),
        context: {
          title: node.playlist.playlistTitle,
        },
      })
    }
  })
}
