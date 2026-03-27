# Open Identity Platform Site Repository

## How-to

Run server locally

```bash
bundle exec jekyll serve
```

Build CSS with Tailwind:

```bash
npm install tailwindcss@3 #if not installed

npx tailwindcss -i ./assets/css/input.css -o ./assets/css/main.css --watch --minify
```