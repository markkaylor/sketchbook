// Gatsby supports TypeScript natively!
import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import styled from "styled-components"

const ProjectPlaylist = ({ data }) => {
  // const tags = data.youtubePlaylist.playlist.playlistTags
  // TODO: Make tags work...
  // let noDuplicates = [...new Set(tags)]
  return (
    <Layout>
      <PlaylistTitleContainer>
        <h1>{data.youtubePlaylist.playlist.playlistTitle}</h1>
        <DescriptionContainer>
          {data.youtubePlaylist.playlist.playlistDescription}
        </DescriptionContainer>
        {/* Filter by tag:
        {noDuplicates.map((tag, index) => (
          <a key={tag + index}> {tag} </a>
        ))} */}
      </PlaylistTitleContainer>
      <div>
        {data.youtubePlaylist.playlist.videos.data.items.map(video => {
          return (
            <PlaylistItemContainer key={video.snippet.resourceId.videoId}>
              <h2>{video.snippet.title}</h2>
              {/* <div>
                {video.tags &&
                  video.tags.map((tag, index) => (
                    <a key={tag + index}> {tag} </a>
                  ))}
              </div> */}
              <VideoContainer>
                <iframe
                  height="315"
                  title={video.title}
                  src={`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}?rel=0`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoContainer>
              <DescriptionContainer>
                {video.snippet.description}
              </DescriptionContainer>
            </PlaylistItemContainer>
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

const PlaylistTitleContainer = styled.div`
  border-bottom: 1px dashed #424242f7;
  padding-bottom: 1rem;
`

const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 ratio */
  margin-bottom: 1rem;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

const PlaylistItemContainer = styled.div`
  border-bottom: 1px dashed #424242f7;
`
