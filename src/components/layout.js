import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

import "./Layout.css"

const GridContainer = styled.div`
  grid-template-rows: repeat(12, 1fr);
  grid-template-columns: repeat(12, 1fr);
  display: grid;
  height: 100vh;
  margin: 0 4rem;
  @media screen and (max-width: 900px) {
    margin: 0;
  }
`

const GridContent = styled.div`
  overflow: scroll;
  grid-row: 2 / span 11;
  grid-column: 1 / span 9;
  padding: 1rem 2rem;

  @media screen and (max-width: 900px) {
    grid-row: 2 / 12;
    grid-column: 1 / span 12;
    width: 90vw;
    margin: 0 auto;
    padding: 0;
  }
`

const GridTitle = styled.div`
  @media screen and (max-width: 900px) {
    justify-content: flex-end;
    grid-row: 12;
    grid-column: 1 / span 12;
  }
  @media screen and (max-width: 1215px) {
    h1 {
      font-size: 20px;
    }
  }
  height: 100%;
  grid-row: 2 / span 11;
  grid-column: 10 / span 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;

  a {
    color: #424242f7;
  }
`

const GridHeader = styled.div`
  grid-column: 1 / span 12;
  grid-row: 1 / 1;
  padding: 2rem 2rem 0rem 2rem;

  a {
    border-bottom: 1px dashed gray;
    padding: 0;
    margin-right: 1rem;
  }

  @media screen and (max-width: 900px) {
    padding: 1rem 2rem;
  }
`

const Layout = ({ children }) => {
  return (
    <GridContainer>
      <GridHeader>
        <Link to="/projects/sketchbook">Sketchbook</Link>
        <Link to="/about">About</Link>
      </GridHeader>
      <GridContent>{children}</GridContent>
      <GridTitle>
        <Link to="/">
          <h1>Mark KAYLOR</h1>
        </Link>
      </GridTitle>
    </GridContainer>
  )
}

export default Layout
