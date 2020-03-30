[**Upscaled: The cost of Columbia construction for struggling 12th Avenue businesses**](https://www.columbiaspectator.com/news/2020/03/13/upscaled-the-cost-of-columbia-construction-for-struggling-12th-avenue-businesses/)

# Manhattanvillle Businesses

This story was created with [Spectate](https://github.com/spec-journalism/spectate).

## Usage

Make sure you have completed the setup and creation instructions for Spectate. To start the development server, run:
```
npm run dev
```

After changing `config.yml` values, or to download the Google Doc, run:
```
make download
```

To update the Makefile, run:
```
spectate update
```

## Deploying to the web

### GitHub Pages

1. Create a `gh-pages` branch, return to `master`, and set up the worktree.
```
git checkout -b gh-pages
git checkout master
make clean
```

2. Run `make deploy-gh`.

### Arc

1. Set the value of `slug` in the Makefile. In `package.json`, set `--public-url` to the S3 link:
```
https://spectator-static-assets.s3.amazonaws.com/SLUG
```

2. Uncomment the appropriate override stylesheet in `styles.scss`.

3. Run `make sync-js` to sync JS, `make sync-css`, or `make deploy-arc` to do both.

4. Copy the contents of `dist/index.html` into Ellipsis.
