import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"
import _ from "lodash"

const Projects = () => {
  const indexData = useStaticQuery(graphql`
    query {
      allYoutubePlaylist {
        edges {
          node {
            playlist {
              playlistTitle
            }
          }
        }
      }
    }
  `)

  const {
    allYoutubePlaylist: { edges },
  } = indexData

  const playlists = [...edges]

  const myIndex = playlists.findIndex(
    ({ node }) => node.playlist.playlistTitle === "Sketchbook"
  )
  const front = playlists.splice(myIndex, myIndex)
  playlists.unshift(front[0])

  return (
    <Layout>
      <SEO title="Projects" />
      {playlists.map(({ node }) => (
        <h1>
          <Link to={_.kebabCase(node.playlist.playlistTitle)}>
            {node.playlist.playlistTitle}
          </Link>
        </h1>
      ))}
    </Layout>
  )
}

export default Projects
