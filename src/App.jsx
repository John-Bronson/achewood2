import React from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
import styled from 'styled-components'

import ComicStrip from './ComicStrip.jsx'
import BlogPost from './BlogPost.jsx'

//TODO: Material UI for calendar and date picker?

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: '2004-07-01T12:00:00.000Z',
      currentBlogPosts: [],
      currentStrip: 'http://achewood.com/comic.php?date=07012004'
    }
    //this.getTodayPostsRay = this.getTodayPostsRay.bind(this)
  }

  componentDidMount() {
    let initialCurrentDate = new Date('2004-07-01T12:00:00.000Z')
    this.setState({
      currentDate: initialCurrentDate
    })

    this.getTodaysContents()
    console.log('current date at end of componentDidMount:', this.state.currentDate)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.currentDate !== prevState.currentDate) {
      this.getTodaysContents()
    }
  }

  handleNextDayClick() {
    let tempDate = new Date(this.state.currentDate)
    console.log(tempDate)
    tempDate.setDate(tempDate.getDate() + 1)
    // console.log(JSON.stringify(tempDate))
    // let stringifiedNewDate = JSON.stringify(tempDate)
    // console.log(stringifiedNewDate)

    this.setState({
      currentDate: tempDate
    })


  }

  handlePrevDayClick() {
    let tempDate = new Date(this.state.currentDate)
    console.log(tempDate)
    tempDate.setDate(tempDate.getDate() - 1)
    // console.log(JSON.stringify(tempDate))
    // let stringifiedNewDate = JSON.stringify(tempDate)
    // console.log(stringifiedNewDate)

    this.setState({
      currentDate: tempDate
    })
  }

  getTodayStrip() {
    console.log('getting blog posts')
    axios({
      method: 'get',
      url: 'http://localhost:3000/strip/',
      headers: {
        'Content-Type': 'application/json',
        'referencedate': this.state.currentDate
      }
    }).then((response) => {
      console.log('requesting new strip with date', this.state.currentDate)
      console.log('response received for new strip. it is', response.data)
      this.setState({
        currentStrip: response.data
      })
    })
      .catch((error) => {
        console.log(error);
      });
  }

  getTodayBlogPosts() {
    console.log('getting blog posts')
    axios({
      method: 'get',
      url: 'http://localhost:3000/blogs/',
      headers: {
        'Content-Type': 'application/json',
        'referencedate': this.state.currentDate
      }
    }).then((response) => {
      console.log('response received. it is', response.data)
      //todo: Convert date string to date object for pretty display in blog posts
      //from server side: characters[i].data.items[j].publishedObject = new Date(characters[i].data.items[j].published)

      this.setState({
        currentBlogPosts: response.data
      })
    })
      .catch((error) => {
        console.log(error);
      });
  }

  getTodaysContents() {
    this.getTodayStrip()
    this.getTodayBlogPosts()
  }

  render() {
    return (
      <div className="App">
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
        <hr className="section-divider" />
        <div id="body">
          <div id="comicSection">
            <div className="dateControls">
              <div onClick={() => this.handlePrevDayClick()}>&laquo;</div>
              <div>{JSON.stringify(this.state.currentDate)}</div>
              <div onClick={() => this.handleNextDayClick()} >&raquo;</div>
            </div>

            <ComicStrip stripURL={this.state.currentStrip} />
            {this.state.currentBlogPosts.map((currentPost) => (
              <BlogPost currentPost={currentPost} key={currentPost.id} />
            ))}
            <img src="https://achewood.com/img/achewood_buy_print_button_v2.png" width="350"></img>
          </div>
        </div>
        <div id="footer">
          <div id="home_footer" className="small-links">

            <div className="column left">
              New items coming to this exciting column soon! E-zines, subscriber archives, e-books, news, more. I just have to re-learn Gopher or whatever that is.
            </div>

            <div className="column center">

              <div id="blog_index" className="white-box">
                <h3>Achewood Blog Index</h3>
                <ul>
                  <li><a href="http://raysmuckles.blogspot.com" onclick="return openLinkNewWindow(this);">Ray</a> | <a href="http://raysmuckles.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://rbeef.blogspot.com" onclick="return openLinkNewWindow(this);">Roast Beef</a> | <a href="http://rbeef.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://journeyintoreason.blogspot.com" onclick="return openLinkNewWindow(this);">Pat</a> | <a href="http://journeyintoreason.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://orezscu.blogspot.com" onclick="return openLinkNewWindow(this);">T&#233;odor</a> | <a href="http://orezscu.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://philippesblog.blogspot.com" onclick="return openLinkNewWindow(this);">Philippe</a> | <a href="http://philippesblog.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://corneliusbear.blogspot.com" onclick="return openLinkNewWindow(this);">Mr. Bear</a> | <a href="http://corneliusbear.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://lyle151.blogspot.com" onclick="return openLinkNewWindow(this);">Lyle</a> | <a href="http://lyle151.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://mollysanders.blogspot.com" onclick="return openLinkNewWindow(this);">Molly</a> | <a href="http://mollysanders.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://chrisonstad.blogspot.com" onclick="return openLinkNewWindow(this);">Chris</a> | <a href="http://chrisonstad.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://peterhcropes.blogspot.com" onclick="return openLinkNewWindow(this);">Nice Pete</a> | <a href="http://peterhcropes.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://charleysmuckles.blogspot.com" onclick="return openLinkNewWindow(this);">Little Nephew</a> | <a href="http://charleysmuckles.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                  <li><a href="http://emerillg.blogspot.com" onclick="return openLinkNewWindow(this);">Emeril</a> |  <a href="http://emerillg.blogspot.com/atom.xml" onclick="return openLinkNewWindow(this);"><em>feed</em></a></li>
                </ul>
              </div>

              <div className="white-box">
                <form action="http://www.ohnorobot.com/index.php">
                  <p>
                    <input type="hidden" name="comic" value="636" />

                    <strong>Search For Strip Dialogue!</strong><br />
                    <input type="text" name="s" value="" size="14" />
                    <input type="submit" name="search" value="Find" />
                    Searching 100% of our comics. Powered by <a href="http://www.ohnorobot.com/">ohnorobot</a> and you.
                  </p>
                </form>
              </div>

              <div className="white-box">
                <h3>Achewood for Subscribers Only:</h3>
                <p><a href="archived_edition.php">Huge archive of rare, multi-format Achewood content</a>!</p>
              </div>

              <p>
                <a href="raysplace.php"><img src="http://achewood.com/rsrc/img/raysplace_button.gif" alt="Ray's Place" /></a><br />
              </p>


              <h3>Get Out of Here</h3>
              <p>Achewood is not for readers under 18 years of age.</p>

            </div>

            <div className="column right">
              <form action="index.php">

                <h3 className="hidden">Quick Links</h3>

                <p>
                  <select name="date">
                    <option value="10012001">Jump to a Story Arc</option>
                    <option value="03122002">The Party</option>
                    <option value="05082002">Ray's Startup #1</option>
                    <option value="06202002">Beef on Moon</option>
                    <option value="09302002">Ray's Startup #2</option>
                    <option value="10022002">Philippe's Wedding</option>
                    <option value="11042002">Ray Sells His Soul</option>
                    <option value="11252002">Ray+Beef Road Trip</option>
                    <option value="02072003">Subway Wars</option>
                    <option value="03042003">Beef in Heaven 1</option>
                    <option value="03242003">Guest Week 1</option>
                    <option value="04032003">Meeting Nice Pete</option>
                    <option value="05132003">Oregon Trail</option>
                    <option value="05232003">Prank Calling</option>
                    <option value="06202003">Nightlife Mingus</option>
                    <option value="06302003">Beef in Heaven 2</option>
                    <option value="07142003">Lyle Wins Oasis</option>
                    <option value="07282003">Beef, Metrosexual</option>
                    <option value="08202003">Mark Twain</option>
                    <option value="08272003">Locked in at Ray's</option>
                    <option value="09162003">Anarchist's Cookbook</option>
                    <option value="10222003">Nice Pete's Bio</option>
                    <option value="11032003">Philippe Kidnapped?</option>
                    <option value="12012003">Ray goes to Hell</option>
                    <option value="12252003">Guest Week 2</option>
                    <option value="01082004">Hacking Yahoo</option>
                    <option value="01212004">Barry Bass</option>
                    <option value="01292004">Philippe for America</option>
                    <option value="03032004">Lazarus Loafer</option>
                    <option value="03182004">Trip to Germany</option>
                    <option value="05262004">Uncle Culpepper</option>
                    <option value="06042004">Beef in Heaven 3</option>
                    <option value="06282004">Goth</option>
                    <option value="07202004">SaniTaco</option>
                    <option value="07292004">Waterbury</option>
                    <option value="01112005">Ray's Toilet Party</option>
                    <option value="02282005">The Banjo</option>
                    <option value="05102005">Volvo of Despair</option>
                    <option value="09132005">Cartilage Head</option>
                    <option value="01112006">The Great Outdoor Fight</option>
                    <option value="04052006">Philippe/Transfer Station</option>
                    <option value="05182006">Beef's Magic Underpants</option>
                    <option value="06082006">The Badass Games</option>
                    <option value="07212006">Pat's Dad</option>
                    <option value="09212006">Magical Realism</option>
                    <option value="12112006">Mister Band</option>
                    <option value="03052007">Leon Sumbitches</option>
                    <option value="03212007">Misadventures in Gay Pornography</option>
                    <option value="04232007">Slow Pitch Softball (Stoned)</option>
                    <option value="05222007">The Proposal</option>
                    <option value="07092007">Lolcats</option>
                    <option value="08082007">Ray Insults Beef</option>
                    <option value="09242007">The Todd Show</option>
                    <option value="11132007">Dornheim Smuckles</option>
                    <option value="11292007">The Perky Pervert</option>
                    <option value="12192007">Cornelius' Tattoo</option>
                    <option value="01112008">In Color!</option>
                    <option value="01272008">Ray Gets Into Politics</option>
                    <option value="02222008">Teodor's Sandwiches</option>
                    <option value="04012008">The 2008 Shrovis-Bishopthorpe</option>
                    <option value="04242008">Roast Beef: Entrepreneur</option>
                    <option value="05152008">Nice Pete, Amanuensis</option>
                    <option value="05232008">Wedding Prep and Wedding Day</option>
                    <option value="08272008">Tina and Ray - Reunited</option>
                    <option value="10132008">Cornelius and Polly</option>
                    <option value="03102009">The Ballad of Lyle and Darlene</option>
                    <option value="04282009">Little Nephew in Wales, 1676</option>
                    <option value="07022009">The New Kings of Sapphic Erotica</option>
                    <option value="07272009">The Lash of Thanatos</option>
                    <option value="09212009">Sensitive Todd</option>
                    <option value="10142009">North Korean Magical Realism</option>
                    <option value="01312010">Philippe: Entrepreneur</option>
                    <option value="03262010">Philippe's Journey Home</option>
                    <option value="05092010">Fast Times at Achewood High</option>

                  </select>
                </p>

              </form>



              <h3>Explained, sort of:</h3>
              <p>
                Achewood's <a href="http://en.wikipedia.org/wiki/Achewood">Wikipedia</a> article.
              </p>

              <h3>Achewood Desktops</h3>

              <div id="desktop_images">
                <h4>Philippe</h4>
                <ul>
                  <li><a href="rsrc/img/phs_640x480.gif" onclick="return openLinkNewWindow(this);">640 x 480</a></li>
                  <li><a href="rsrc/img/phs_800x600.gif" onclick="return openLinkNewWindow(this);">800 x 600</a></li>
                  <li><a href="rsrc/img/phs_1024x768.gif" onclick="return openLinkNewWindow(this);">1024 x 768</a></li>
                  <li><a href="rsrc/img/phs_1152x864.gif" onclick="return openLinkNewWindow(this);">1152 x 864</a></li>
                  <li><a href="rsrc/img/phs_1280x1024.gif" onclick="return openLinkNewWindow(this);">1280 x 1024</a></li>
                  <li><a href="rsrc/img/phs_1600x1200.gif" onclick="return openLinkNewWindow(this);">1600 x 1200</a></li>
                </ul>

                <h4>Trouble Man and No-No</h4>
                <ul>
                  <li><a href="rsrc/img/nono_640x480.gif" onclick="return openLinkNewWindow(this);">640 x 480</a></li>
                  <li><a href="rsrc/img/nono_800x600.gif" onclick="return openLinkNewWindow(this);">800 x 600</a></li>
                  <li><a href="rsrc/img/nono_1024x768.gif" onclick="return openLinkNewWindow(this);">1024 x 768</a></li>
                  <li><a href="rsrc/img/nono_1152x864.gif" onclick="return openLinkNewWindow(this);">1152 x 864</a></li>
                  <li><a href="rsrc/img/nono_1280x1024.gif" onclick="return openLinkNewWindow(this);">1280 x 1024</a></li>
                  <li><a href="rsrc/img/nono_1600x1200.gif" onclick="return openLinkNewWindow(this);">1600 x 1200</a></li>
                </ul>
              </div>

              <h3>Achewood Music</h3>
              <p>
                <a href="http://frontalot.com/index.php/">MC Frontalot</a> wrote our
                current <a
                  href="http://www.songfight.org/music/livin_at_the_corner_of_dude_and_catastrophe/mcfrontalot+bradsucks_latcodac.mp3">theme
                  song</a>. (mp3 From the '06 <a
                    href="http://www.songfight.org/songpage.php?key=livin_at_the_corner_of_dude_and_catastrophe">Songfight</a>)
              </p>


              <div id="dork_resources">
                <h3>Dork Resources</h3>
                <ul>
                  <li>How to <a href="http://www.antigravitypress.com/gothic.htm">Gothic Dance</a> (requires <a
                    href="http://www.quicktime.com">QuickTime</a>) (sound)</li>
                  <li><a href="eggsmilk.php">Eggs and Milk Minder 1.0b</a></li>
                  <li><a href="rsrc/img/ache_banner.gif">Link Button</a></li>
                  <li><a href="rss.php">RSS</a> feed</li>

                </ul>


                <p>Achewood hosting services provided by <a href="http://www.serverbeach.com/"><strong>Server Beach</strong></a>
                </p>
              </div>


            </div>

          </div>
        </div>
      </div >
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));