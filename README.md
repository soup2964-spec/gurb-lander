# Gurb Lander

A self-hosted press-and-hold link page.

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

## Local preview

Open `index.html` in a browser, or run:

```bash
npx serve .
```

## Deploy

Push to GitHub Pages or any static host. No build step required.
