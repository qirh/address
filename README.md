# Address Quest

A small static site for a Queens tour. It has three sections:

- Manhattan address system
- Queens address system
- Quiz

## Live site

```text
https://qirh.github.io/address/
```

## Run locally

```sh
python3 -m http.server 8777
```

Then open:

```text
http://127.0.0.1:8777/
```

## Deploy

This repo includes a GitHub Pages workflow in `.github/workflows/pages.yml`. Pushing to `main` deploys the static files from the repository root.

## Sources

- Ephemeral New York on decoding Manhattan addresses
- Steve Morse on the format of Queens streets
- Manhattan address algorithm reference
