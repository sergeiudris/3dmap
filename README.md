## World map

Interactive 3d world map, `flat` or `sphere`.

[* live demo**](https://seeris.github.io/archive.webgl/)

![Alt text](/snapshot.png?raw=true "snapshot.png")

###Features

 * [GeoJson](http://geojson.org/) earth map → triangulated with [earcut.js](https://github.com/mapbox/earcut) → vertices
 * pure [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
 * custom tree to control components: sceneobject → container → mesh
 * [Möller–Trumbore](https://en.wikipedia.org/wiki/M%C3%B6ller%E2%80%93Trumbore_intersection_algorithm) intersection algorithm
 * country info fetching using [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page) and [JSONP](https://en.wikipedia.org/wiki/JSONP)
