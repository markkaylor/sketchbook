// Gatsby supports TypeScript natively!
import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import styled from "styled-components"

const ProjectPlaylist = ({ data }) => {
  const tags = data.youtubePlaylist.playlist.playlistTags
  let noDuplicates = [...new Set(tags)]
  return (
    <Layout>
      <h1>{data.youtubePlaylist.playlist.playlistTitle}</h1>
      <DescriptionContainer>
        {data.youtubePlaylist.playlist.playlistDescription}
      </DescriptionContainer>
      Filter by tag:
      {noDuplicates.map((tag, index) => (
        <span key={tag + index}> {tag} </span>
      ))}
      <hr />
      <div>
        {data.youtubePlaylist.playlist.videos.data.items.map(video => {
          return (
            <div key={video.snippet.resourceId.videoId}>
              <h4>{video.snippet.title}</h4>
              <DescriptionContainer>
                {video.snippet.description}
              </DescriptionContainer>
              <div>
                {video.tags &&
                  video.tags.map((tag, index) => (
                    <span key={tag + index}> {tag} </span>
                  ))}
              </div>
              <iframe
                width="560"
                height="315"
                title={video.title}
                src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}?rel=0`}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

export default ProjectPlaylist

export const projectPlaylistQuery = graphql`
  query($title: String!) {
    youtubePlaylist(playlist: { playlistTitle: { eq: $title } }) {
      playlist {
        playlistTitle
        playlistDescription
        playlistPublishedAt
        playlistTags
        videos {
          data {
            items {
              snippet {
                title
                description
                resourceId {
                  videoId
                }
              }
              tags
            }
          }
        }
      }
    }
  }
`

const DescriptionContainer = styled.div`
  white-space: pre-wrap;
  margin-bottom: 1rem;
`
