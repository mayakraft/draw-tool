# draw tool

Basic template for a GUI app that includes tool selection and interacting with the tools on a canvas surface; think Adobe Illustrator or Blender.

Toolbar contains a set of tools, tools definitions includes management of all touch events (move press release scroll).

# dev

```bash
npm i
npm run dev
```

# notes

I built this to scaffold out [rabbit ear app](https://github.com/rabbit-ear/rabbit-ear-app); the data model for each are slighly different, so I didn't bother to complete many of the geometry related content in this app, including selection and the affine transform tools. Also, the WebGL renderer view can be rotated with the "hand" tool, otherwise rendering content in this viewport will be entirely untouched.

Follow [rabbit ear app](https://github.com/rabbit-ear/rabbit-ear-app) for further related development.
