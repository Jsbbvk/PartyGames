import { Helmet } from 'react-helmet-async'
import { GameManager } from '../../CardsForUs/components/Managers'

const CardsForUs = () => {
  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>Cards For Us</title>
        <link rel="canonical" href="https://partygames.social/cardsforus" />
        <meta
          name="description"
          content="Cards For Us is a party game that is (not) just like Cards Against Humanity. Cards For Us is a fill-in-the-blank part game where 
          one player is the czar and chooses a question that everyone answers with their funniest response."
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/cardsforus/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/cardsforus/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/cardsforus/favicon-16x16.png"
        />
        <link rel="manifest" href="/cardsforus/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/cardsforus/safari-pinned-tab.svg"
          color="#5bbad5"
        />
      </Helmet>
      <GameManager />
    </>
  )
}

export default CardsForUs
