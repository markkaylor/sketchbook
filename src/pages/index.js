import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { graphql, useStaticQuery } from "gatsby"

const IndexPage = () => {
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
  return (
    <Layout>
      <SEO title="Home" />
      {indexData.allYoutubePlaylist.edges.map(({ node }) => (
        <h1>
          <Link to="/page-2/">{node.playlist.playlistTitle}</Link>
        </h1>
      ))}
    </Layout>
  )
}

export default IndexPage
