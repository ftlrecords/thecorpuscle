# The Corpuscle

Personal notes and projects built with Quartz.

## Run locally

```bash
npm install
npx quartz dev
```

## Build and serve

```bash
npx quartz clean
npx quartz build --serve
```

## Build only

```bash
npx quartz build
```

## Write content

All notes go in:

```
content/
```

Markdown example:

```markdown
# Title

Text here.
```

## Images

Put images in:

```
static/
```

Use them like:

```markdown
![Alt text](/image.png)
```

## Edit site components

Components live in:

```
quartz/components/
```

Example:

```
quartz/components/PageTitle.tsx
```

Restart the dev server after editing components.

## Folders

```
content/   notes
static/    images
quartz/    theme and components
public/    generated site
```
