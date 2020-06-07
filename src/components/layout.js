import React from "react"
import styled from "styled-components"

import "./Layout.css"

const GridContainer = styled.div`
  grid-template-rows: repeat(12, 1fr);
  grid-template-columns: repeat(12, 1fr);
  display: grid;
  height: 100vh;
`

const GridContent = styled.div`
  overflow: scroll;
  grid-row: 2 / span 11;
  grid-column: 1 / span 9;
  padding: 1rem 0;
  @media screen and (max-width: 900px) {
    grid-row: 2 / 12;
    grid-column: 1 / span 12;
    width: 90vw;
    margin: 0 auto;
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
`

const GridHeader = styled.div`
  grid-column: 1 / span 12;
  grid-row: 1 / 1;
  padding: 2rem 0rem;
  @media screen and (max-width: 900px) {
    padding: 0;
  }
`

const Wrapper = styled.div``

const Layout = ({ children, page }) => {
  return (
    <>
      <Wrapper>
        <GridContainer>
          <GridHeader></GridHeader>
          <GridContent>{children}</GridContent>
          <GridTitle>
            <h1>Mark KAYLOR</h1>
          </GridTitle>
        </GridContainer>
      </Wrapper>
    </>
  )
}

export default Layout
