![](https://i.imgur.com/zEe0A9t.png)

# Achewood v2.0

A new website for the classic momentary diversion on the road to the grave

# [Provisional deployment! Click here to check it out.](http://ec2-23-22-249-229.compute-1.amazonaws.com:3000/)

### Table of Contents 

1. [Introuction](#Introduction)
2. [Roadmap](#Roadmap)
3. [Technologies](#Technologies)
4. [Installation](#Installation)
5. [Contributors](#Contributors)

### Introduction 👋

Identified the need for a more user-friendly way to browse blog posts generated by characters of a popular webcomic. Developed a backend that fetches the posts using the Blogger API and integrated them into the comic’s webpage on the front end, retaining the visual styling of the individual blogs within their posts

Improved the user experience for the comic itself, adding a modern full screen interface and alternate text display for the visual media

### Roadmap 🗺

#### Step 1

- create a database of all comic strips along with their alt text. Get them all displaying in the app. Use firebase.
- get the blog posts in that database (TBD whether/when these should check for new content). Display blog posts in app from the database.
- Deploy using firebase. (Actual MVP status!)

#### Step 2

- style individual blogs to match their Blogger styles
- implement "next/prev date with content" functionality.
- get all links in header/footer working.

#### Step 3

- Modern site theme + toggle to switch between classic/modern mode
- Modern theme: date picker with colored indicators for content (blog/strip)
- Scrape transcriptions from ohnorobot when available and make them available on the page

#### Step 4

- Pie in the sky features requiring authentication: 
- User can bookmark individual comics/blog posts and open a list of their bookmarked faves
- Discussion forums? Maybe pegged to each piece of content? This is scary

### Installation and Setup🚀

```
$ git clone https://github.com/John-Bronson/achewood2.git
$ npm install
$ npm run server-dev
$ npm run watch
```

Set up a config.ts with the following:

- Google Blogger API key: [Instructions here](https://developers.google.com/blogger/docs/3.0/using#APIKey)

### Contributors🤝

- [John Bronson](https://www.linkedin.com/in/john-bronson/)
  - <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="60"/> [Github](https://github.com/victorsmonster)

### Technologies🧪\

<img src="https://www.bypeople.com/wp-content/uploads/2018/10/date-fns-js-featured-4.png" width="200"/>
<img src="https://mui.com/static/logo.png" width="200"/>
<img src="https://www.vectorlogo.zone/logos/reactjs/reactjs-ar21.svg" width="200"/>
<img src="https://www.vectorlogo.zone/logos/typescriptlang/typescriptlang-ar21.svg" width="200"/>
<img src="https://www.vectorlogo.zone/logos/js_webpack/js_webpack-ar21.svg" width="200"/>
