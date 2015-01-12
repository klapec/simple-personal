# Simple personal website

Created as a Sass practice.
Feel free to use/modify/whatever you want.

If you wish to run this on a local enviromnent, few changes to be made. This is due to how Github Pages work with project repositories.

1. Set `baseurl` to `""` in `_config.yml`
2. Change `"/simple-personal/"` to `"/"` in `assets/src/scripts/main.js`

In order to develop locally, use `gulp`. You're going to need to do a `npm install` before, obviously.

## Gulp tasks
There are few gulp tasks present in the gulpfile.

- ``gulp build`` – downloads dependencies (Normalize.css, Bourbon and Neat) using Bower, moves them to ``assets/src/stylesheets/vendors/``, renames Normalize so that it can be imported by Sass and then builds Jekyll,
- ``gulp`` (default task) – builds all the assets (stylesheets, scripts, images and SVGs) and begins to watch all the files for changes. It will automatically re-run compilation of changed asset and reload the browser,
- ``gulp styles`` – handles stylesheets compilation. Uses **sass** (ruby-sass) to compile Sass into CSS, **autoprefixes** all the needed vendor prefixes in your CSS files, **minifies** them and outputs the compiled ``main.min.css`` to ``assets/dist/stylesheets/``,
- ``gulp scripts`` – handles JavaScript scripts. It first uses **jshint** to lint your scripts and check if there are any errors in them, it then **concatenates** all your scripts into a single file (decreasing HTTP request for performance reasons) and **minifies** it using ``uglify``,
- ``gulp vendorScripts`` – does pretty much the same as the task above. It handles vendor scripts (from ``assets/src/scripts/vendors/``) but it doesn't run them through linting – we are *assuming* that those 3rd party scripts were written properly,
- ``gulp images`` – optimizes your images. Uses **imagemin** to shrink them in size while not losing too much of quality,
- ``gulp svg`` – does pretty much the same except for your SVG files. The difference is that it automatically compiles them into a single ``sprite.svg`` file (again, performance reasons). Each of your SVG files can be accessed then in your website easily by an ID of their original name, prefixed by ``icon-``. Read more about this technique on [CSS-Tricks](http://css-tricks.com/svg-use-external-source/),
- there's also a series of tasks that automatically inject paths to relevant assets into the ``default.html`` layout file. This is necessary because we are changing compiled assets' filenames each time they're rebuilt by appending a new revision hash. And because of this, we can use better browser caching (if the server is correctly set up).

## Directory tree
```
├── _includes
│   ├── footer.html
│   └── header.html
├── _layouts
│   ├── default.html
│   ├── page.html
│   └── post.html
├── _posts
│   ├── 2014-11-20-iovem-ad-non.md
│   ├── 2014-11-20-munusque-aurea-duobus-negarunt-primos.md
│   └── 2015-01-04-test.md
├── assets
│   ├── dist
│   │   ├── images
│   │   │   ├── 1.jpg
│   │   │   ├── 2.jpg
│   │   │   └── 3.jpg
│   │   ├── scripts
│   │   │   ├── main-85c6ea43.min.js
│   │   │   └── vendors-7d9578f2.min.js
│   │   ├── stylesheets
│   │   │   └── main-8990041e.min.css
│   │   └── svg
│   │   │   └── sprite.svg
│   └── src
│   │   ├── images
│   │   │   ├── 1.jpg
│   │   │   ├── 2.jpg
│   │   │   └── 3.jpg
│   │   ├── scripts
│   │   │   ├── vendors
│   │   │   │   ├── highlight.pack.js
│   │   │   │   └── svg4everybody.js
│   │   │   └── main.js
│   │   ├── stylesheets
│   │   │   ├── base
│   │   │   │   ├── _animations.scss
│   │   │   │   ├── _base.scss
│   │   │   │   └── _settings.scss
│   │   │   ├── components
│   │   │   │   ├── _buttons.scss
│   │   │   │   ├── _forms.scss
│   │   │   │   └── _icons.scss
│   │   │   ├── pages
│   │   │   │   ├── _page.scss
│   │   │   │   └── _single-post.scss
│   │   │   ├── partials
│   │   │   │   ├── _footer.scss
│   │   │   │   ├── _header.scss
│   │   │   │   ├── _sections.scss
│   │   │   │   └── _wrappers.scss
│   │   │   ├── themes
│   │   │   ├── utils
│   │   │   ├── vendors
│   │   │   │   ├── _code-highlight.scss
│   │   │   │   ├── _include-media.scss
│   │   │   │   └── _normalize.scss
│   │   │   └── main.scss
│   │   └── svg
│   │       ├── code.svg
│   │       ├── design.svg
│   │       └── opensource.svg
├── LICENSE
├── README.md
├── _config.yml
├── about.md
├── blog.html
├── favicon-192x192.png
├── favicon.ico
├── feed.xml
├── gulpfile.js
├── index.html
└── package.json
```
