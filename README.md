# NYC Address Decoder

A small static site for a Queens tour. It explains Manhattan and Queens address systems, includes interactive decoders, and finishes with an address quiz.

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

- NYC Planning Geosupport User Programming Guide
- NYPL on the Commissioners' Plan of 1811
- Manhattan address algorithm reference
- Wikimedia Commons image sources linked in the page
