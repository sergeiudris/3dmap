module.exports = function (rows, columns) {

    var vertices = [];
    var indices = [];

    var x, y, z, i;
    y = 0;
    for (var i = 0; i <= columns; i++) {
        x = (2 / columns) * i - 1;
        vertices.push(x, y, -1);
        vertices.push(x, y, 1);
    }
    for (var i = 0; i <= rows; i++) {
        z = (2 / rows) * i - 1;
        vertices.push(-1, y, z);
        vertices.push(1, y, z);
    }
    for (var i = 0, l = vertices.length / 3; i < l; i++) {
        indices.push(i);
    }

    return {
        rows: rows || 8,
        columns: columns || 8,
        aPosition: 3,
        aColor: 0,
        aUV: 0,
        vertices: new Float32Array(vertices),
        indices: new Uint16Array(indices)
    };

};

