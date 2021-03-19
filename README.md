# v-resizable

[![Vue 2.x](https://img.shields.io/badge/Vue-2.x-brightgreen.svg)](https://vuejs.org/v2/guide/)
[![Vue 3.x](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://v3.vuejs.org/guide/)
[![npm](https://img.shields.io/npm/v/v-resizable.svg)](https://www.npmjs.com/package/v-resizable)
![minified size](https://img.shields.io/bundlephobia/min/v-resizable?label=minified%20size&style=flat)
[![license](https://img.shields.io/apm/l/v-resizable)](https://github.com/kevinleedrum/v-resizable/blob/main/LICENSE)

This Vue (2.x / 3.x) plugin adds a `v-resizable` directive to make an element resizable. Unlike the CSS `resize` property, the element may be resized from any side or corner, and a `resize` event is emitted.

## Installation & Usage

Install the package using npm/yarn.

```bash
npm i v-resizable --save
```

Add the plugin to your app.

```ts
// main.js / main.ts

import VResizable from 'v-resizable'

Vue.use(VResizable)
```

Add the directive to an element.

```html
<!-- Component.vue -->

<div v-resizable></div>
```

## Including as a Script

Alternatively, you can include `v-resizable` alongside `vue` using `script` tags.

```html
<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="https://cdn.jsdelivr.net/npm/v-resizable"></script>
```

## Options

### Handles

You can set which handles are available for resizing by adding modifiers to the directive.

```html
<!-- only allow resizing the width via the left and right edges -->
<div v-resizable.l.r></div>

<!-- only allow resizing from the bottom-right corner -->
<div v-resizable.br></div>

<!-- enable all handles; this is the same as providing no modifiers -->
<div v-resizable.t.r.b.l.tr.br.bl.tl></div>
```

### Constrain the width and height

You can specify a `minWidth`, `maxWidth`, `minHeight`, and `maxHeight` in pixels.

```html
<div
  v-resizable="{ minWidth: 300, minHeight: 300, maxWidth: 1000, maxHeight: 1000 }"
></div>
```

### Modify the handle areas

If necessary, you can change the pixel width/height of the invisible handles (_default: 12_), as well as their `z-index` (_default: 100_).

```html
<div v-resizable="{ handleWidth: 16, handleZIndex: 1000 }"></div>
```

## Overriding Defaults

To avoid having to repeat the same option values in your app, you can override the default values.

When using `Vue.use`, pass the default values as the second argument.

```ts
// main.js / main.ts

Vue.use(VResizable, {
  handles: ['l', 'r'],
  minWidth: 300,
  minHeight: 300,
  maxWidth: 1000,
  maxHeight: 1000,
  handleWidth: 16,
  handleZIndex: 1000,
})
```

When including `v-resizable` as a global script, you can instead call `VResizable.setDefaults`.

```js
VResizable.setDefaults({
  handles: ['l', 'r'],
  minWidth: 300,
  minHeight: 300,
  maxWidth: 1000,
  maxHeight: 1000,
  handleWidth: 16,
  handleZIndex: 1000,
})
```

## Listening for `resize` Events

The `v-resizable` directive also implements emitting `resize` events.

```html
<div v-resizable @resize="myResizeHandlerMethod"></div>
```
