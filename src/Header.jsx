import React from 'react';

const Header = (props) => (

  <div id="header">
    <div id="site_navigation">
      <h1><a href="/">Achewood</a></h1>
      <ul className="navigation">
        <li><a href="https://achewood-holiday-pop-up.myshopify.com" title="Shop for apparel, posters, and more">Shop</a></li><li><a
          href="/list.php" title="View the archive of past comics">Archive</a></li><li><a
            href="/news.php" title="View Achewood news">News</a></li><li><a
              href="/contact.php" title="Contact Achewood">Contact</a></li><li><a
                href="/about.php" title="Learn more about Achewood">About</a></li><li><a
                  href="/gallery.php" title="View the gallery of original artwork">Gallery</a></li><li><a
                    href="http://www.ohnorobot.com/random.php?comic=636" title="Jump to random comic">Random comic</a></li>
      </ul>
    </div>
    <p id="banner"><a href="https://achewood-holiday-pop-up.myshopify.com/collections/original-artwork"><img src="https://achewood.com/banner.php?banner=lie_bot_original.png" alt="Banner Ad" /></a></p>

  </div>
)

export default Header