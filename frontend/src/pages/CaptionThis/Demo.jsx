import { Helmet } from 'react-helmet-async'
import DemoManager from '../../CaptionThis/components/Demo/DemoManager'

const Demo = () => {
  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Demo - Caption This!</title>
        <link
          rel="canonical"
          href="https://partygames.social/captionthis/demo"
        />
        <meta
          name="description"
          content="Caption This! is a party game where friends caption 
          popular meme templates and then vote for the funniest one. 
          With over 250+ memes, there's no limit on how dank one can make their meme!"
        />
        <meta property="og:title" content="Demo - Caption This!" />
        <meta property="og:site_name" content="Party Games" />
        <meta
          property="og:url"
          content="https://partygames.social/captionthis/demo"
        />
        <meta
          property="og:description"
          content="Demo of Caption This!, a party game where friends caption 
          popular meme templates and then vote for the funniest one. 
          With over 250+ memes, there's no limit on how dank one can make their meme!"
        />
        <meta property="og:type" content="website" />

        <link
          rel="apple-touch-icon-precomposed"
          sizes="57x57"
          href="/captionthis/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href="/captionthis/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href="/captionthis/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href="/captionthis/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="60x60"
          href="/captionthis/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="120x120"
          href="/captionthis/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="76x76"
          href="/captionthis/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="152x152"
          href="/captionthis/apple-touch-icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-196x196.png"
          sizes="196x196"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/captionthis/favicon-128.png"
          sizes="128x128"
        />
      </Helmet>
      <DemoManager />
    </>
  )
}

export default Demo
