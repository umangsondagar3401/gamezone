import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
};

const SEO: React.FC<SEOProps> = ({
  title = "GameZone - Play Free Online Games",
  description = "Play a variety of free online games including 2048, Sudoku, Tic Tac Toe, Memory Match, Word Search, and more!",
  keywords = [
    "online games",
    "free games",
    "puzzle games",
    "2048",
    "Sudoku",
    "Tic Tac Toe",
    "Memory Match",
    "Word Search",
    "Sliding Puzzle",
    "Rock Paper Scissors",
    "Dots and Boxes",
    "GameZone",
    "casual games",
    "multiplayer games",
    "browser games",
    "fun games",
    "best free games",
    "top online games",
  ],
  author = "GameZone",
  canonicalUrl = window.location.href,
  ogType = "website",
  ogImage = "/gamezone-og.png",
  twitterCard = "summary_large_image",
}) => {
  useEffect(() => {
    // Update the document title
    document.title = title;
  }, [title]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    </Helmet>
  );
};

export default SEO;
