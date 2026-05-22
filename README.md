# Gurb Lander

A self-hosted replica of the [vickyladyy.com](https://vickyladyy.com/) Bouncy.ai Pro Card link page.

## Customize your links

Edit `config.js`:

```js
links: [
  {
    id: "link-1",
    title: "Press & Hold Here",
    subtitle: "",
    url: "https://your-link.com"
  }
]
```

Also update `profile.name` and `profile.avatar` for your branding.

Optional Google Analytics: set `tracking.googleAnalyticsId` to your GA4 ID.

## Local preview

Open `index.html` in a browser, or run:

```bash
npx serve .
```

## Deploy

Push to GitHub Pages or any static host. No build step required.
