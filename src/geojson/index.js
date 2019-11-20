var earcut = require("./earcut.js");



var geoJSONParser = {


    getFeature: function(name) {
        try {
            var result = [];
            for (var i = 0, l = geojson.features.length; i < l; i++) {

                var feature = geojson.features[i];
                if (feature.properties.name.indexOf(name) > -1
                    || feature.properties.name_long.indexOf(name) > -1
                    || feature.properties.admin.indexOf(name) > -1
                    || feature.properties.abbrev.indexOf(name) > -1) {

                    result.push(feature);
                }

            }
            if (result.length === 1) {
                return result[0];
            }
            return result;

        } catch (e) {
            console.log(e);
        }

    },
    getPointsArrayMultiPoligon: function(name) {

        var feature = this.getFeature(name);
        if (Array.isArray(feature)) {
            console.log("Getfeature return array: ");
            console.log(feature);
            return;
        }


        return this.getCoordinates(feature);

    },
    getCoordinates: function(feature) {

        var vertices = [];
        if (feature.geometry.type === "MultiPolygon") {
            var multiPolygon = feature.geometry.coordinates;
            for (var i = 0, l = multiPolygon.length; i < l; i++) {

                var separatePolygon = multiPolygon[i];
                for (var j = 0, ll = separatePolygon.length; j < ll; j++) {
                    var poligon = separatePolygon[j];
                    for (var k = 0, lll = polygon.length; k < lll; k++) {
                        var x = polygon[k][0] / 180;
                        var y = polygon[k][1] / 90;
                        var z = 0;
                        vertices.push(x, y, z);
                    }
                }
            }
            return vertices;

        } else if (feature.geometry.type === "Polygon") {

            var multiPolygon = feature.geometry.coordinates;
            for (var j = 0, ll = multiPolygon.length; j < ll; j++) {
                var polygon = multiPolygon[j];
                for (var k = 0, lll = polygon.length; k < lll; k++) {
                    var x = polygon[k][0] / 180;
                    var y = polygon[k][1] / 90;
                    var z = 0;
                    vertices.push(x, y, z);
                }
            }
            return vertices;

        }
    },

    getCoordinatesWithOffsets: function(feature) {

        var vertices = [];
        var offsetMap = [];
        var countVertices = -3;
        if (feature.geometry.type === "MultiPolygon") {
            var multiPoligon = feature.geometry.coordinates;
            for (var i = 0, l = multiPoligon.length; i < l; i++) {
                var separatePoligon = multiPoligon[i];
                for (var j = 0, ll = separatePoligon.length; j < ll; j++) {
                    var poligon = separatePoligon[j];
                    offsetMap.push({
                        offset: countVertices + 3,
                        length: poligon.length - 1
                    });
                    for (var k = 0, lll = poligon.length - 1; k < lll; k++) {
                        var x = poligon[k][0] / 180;
                        var y = poligon[k][1] / 90;
                        var z = 0;
                        vertices.push(x, y, z);
                        countVertices += 3;
                    }

                }
            }
        } else if (feature.geometry.type === "Polygon") {

            var multiPoligon = feature.geometry.coordinates;
            var offsetMap = [];
            var countVertices = -3;
            for (var j = 0, ll = multiPoligon.length; j < ll; j++) {
                var poligon = multiPoligon[j];
                offsetMap.push({
                    offset: countVertices + 3,
                    length: poligon.length - 1
                });
                for (var k = 0, lll = poligon.length - 1; k < lll; k++) {
                    var x = poligon[k][0] / 180;
                    var y = poligon[k][1] / 90;
                    var z = 0;
                    vertices.push(x, y, z);
                    countVertices += 3;
                }

            }
        }
        return {
            vertices: vertices,
            offsetMap: offsetMap
        };
    },
    getTriangulatedPolygon: function(feature) {
        if (feature.geometry.type === "MultiPolygon") {
            return this.flattenMultiPolygonUsingPoligon(feature.geometry.coordinates);
        } else if (feature.geometry.type === "Polygon") {
            return this.flattenPolygon(feature.geometry.coordinates);
        }
    },

    flattenPolygon: function(data) {

        var holes = [];
        var vertices = [];
        var indices = null;
        var holeIndex = 0;

        for (var i = 0, l = data.length; i < l; i++) {
            var poligon = data[i];
            for (var j = 0, ll = data[i].length; j < ll; j++) {
                var x = poligon[j][0] / 180;
                var y = poligon[j][1] / 90;
                var z = 0;
                vertices.push(x, y, z);
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                holes.push(holeIndex);
            }
        }
        indices = earcut(vertices, holes, 3);

        return {
            vertices: vertices,
            indices: indices
        };


    },
    flattenMultiPolygon: function(multiData) {

        var holes = [];
        var vertices = [];
        var indices = null;
        var holeIndex = 0;
        for (var g = 0, lll = multiData.length; g < lll; g++) {
            var data = multiData[g];
            for (var i = 0, l = data.length; i < l; i++) {
                var poligon = data[i];
                for (var j = 0, ll = data[i].length; j < ll; j++) {
                    var x = poligon[j][0] / 180;
                    var y = poligon[j][1] / 90;
                    var z = 0;
                    vertices.push(x, y, z);
                }
                if (i > 0) {
                    holeIndex += data[i - 1].length;
                    holes.push(holeIndex);
                }
            }
        }
        indices = earcut(vertices, holes, 3);

        return {
            vertices: vertices,
            indices: indices
        };
    },

    flattenMultiPolygonUsingPoligon: function(multiData) {

        var vertices = [];
        var indices = [];
        for (var i = 0, l = multiData.length; i < l; i++) {
            var data = multiData[i];
            var polygon = this.flattenPolygon(data);

            var verts = polygon.vertices;
            for (var v = 0, ll = verts.length; v < ll; v++) {
                vertices.push(verts[v]);
            }
            var inds = polygon.indices;
            var offset = indices.length / 3 + i * 3; //why +i*3 ? id ont know just looked at indices and figured that out
            for (var n = 0, ll = inds.length; n < ll; n++) {
                indices.push(inds[n] + offset);
            }
        }

        return {
            vertices: vertices,
            indices: indices
        };
    }
}
module.exports = geoJSONParser;