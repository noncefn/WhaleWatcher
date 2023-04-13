import '/styles/globals.css'
import Header from '/components/Header.js'
import localFont from 'next/font/local'

const font = localFont({
  src: [
    {
      path: './NanumGothic-Regular.woff2',
      weight: '400',
      style: 'normal'
    },
    {
      path: './NanumGothic-Bold.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: './NanumGothic-ExtraBold.woff2',
      weight: '600',
      style: 'normal'
    }
  ]
})

export default ({ Component, pageProps }) => {
  return (
    <main className={font.className}>
      <Header />
      <Component {...pageProps} />
    </main>
  )
}
