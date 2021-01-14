import React from "react"
import { Link } from "gatsby"
import { graphql, useStaticQuery } from "gatsby"
import _ from "lodash"
import styled from "styled-components"

const CategoryList = () => {
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

  const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;

    h4 {
      margin: 0;
    }
  `

  const FlexContainer = styled.div`
    display: flex;
    flex-wrap: wrap;

    a {
      font-size: 12px;
      margin: 5px 5px 0 0;
      border: 1px dashed gray;
      border-radius: 2px;
    }
  `

  return (
    <FlexWrapper>
      <h4>Collections: </h4>
      <FlexContainer>
        {playlists.map(({ node }) => (
          <Link to={`/projects/${_.kebabCase(node.playlist.playlistTitle)}`}>
            {node.playlist.playlistTitle}
          </Link>
        ))}
      </FlexContainer>
    </FlexWrapper>
  )
}

export default CategoryList
