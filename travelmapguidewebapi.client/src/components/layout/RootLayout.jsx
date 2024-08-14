import React, { Fragment } from 'react'
import { Header } from './Header'
import Footer from './Footer'

export const RootLayout = () => {
  return (
    <Fragment>
        <Header />
        <Footer />
    </Fragment>
  )
}

export default RootLayout;