import React, { Fragment } from 'react'
import { Header } from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

export const RootLayout = () => {
  return (
    <Fragment>
        <Header />
        <Outlet />
        <Footer />
    </Fragment>
  )
}

export default RootLayout;