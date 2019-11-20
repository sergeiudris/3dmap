
var math = {

    //multiply 4 coordinates vector v by the inver of matrix m
    //for 4x4 movement matrix only
    //return only the first 3 co. (the last coordinate is useless)
    // _multiByMatrixInv: function(v, m) {
    //     return new Float32Array(
    //         [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] - (m[12] * m[0] + m[13] * m[1] + m[14] * m[2]) * v[3],
    //         m[4] * v[0] + m[5] * v[1] + m[6] * v[2] - (m[12] * m[4] + m[13] * m[5] + m[14] * m[6]) * v[3],
    //         m[8] * v[0] + m[9] * v[1] + m[10] * v[2] - (m[12] * m[8] + m[13] * m[9] + m[14] * m[10]) * v[3]]);
    // },
    _multiByMatrixInv: function(v, m) {
        return new Float32Array(
            [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] - (m[12] * m[0] + m[13] * m[1] + m[14] * m[2]) * v[3],
                m[4] * v[0] + m[5] * v[1] + m[6] * v[2] - (m[12] * m[4] + m[13] * m[5] + m[14] * m[6]) * v[3],
                m[8] * v[0] + m[9] * v[1] + m[10] * v[2] - (m[12] * m[8] + m[13] * m[9] + m[14] * m[10]) * v[3]]);
    },

    //multiply point. P by the inv. of m. For 4x4 mov. matrix only
    multPoint3ByMat4Inv: function(P, m) {
        P.push(1); //apply translation part of m
        return this._multiByMatrixInv(P, m);
    },

    //multiply vect. u by the inv. of m. For 4x4 mov. matrix only
    multVec3ByMat4Inv: function(u, m) {
        u.push(0); //do not apply translation part of m
        return this._multiByMatrixInv(u, m);
    },


    degToRad: function(angle) {
        return angle * Math.PI / 180;
    },

    m4_x_v4: function(m, v) {

        // return [
        //     m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3],
        //     m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3],
        //     m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3],
        //     m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3]
        // ];

        return [
            m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
            m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
            m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
            m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3]
        ];
    },

    mat4GetProjection: function(angle, ratio, zMin, zMax) {

        var tan = Math.tan(this.degToRad(0.5 * angle)),
            A = -(zMax + zMin) / (zMax - zMin),
            B = (-2 * zMax * zMin) / (zMax - zMin);

        return new Float32Array([
            0.5 / tan, 0, 0, 0,
            0, 0.5 * ratio / tan, 0, 0,
            0, 0, A, -1,
            0, 0, B, 0
        ]);
    },

    mat4GetVec4: function(out,m) {
        out[0] = m[12];
        out[1] = m[13];
        out[2] = m[14];
        out[3] = m[15];
        
    },
    mat4TranslateRaw: function(m, v) {
        m[12] += v[0];
        m[13] += v[1];
        m[14] += v[2];
    },


    mat4Create: function() {
        return new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    },
    mat4SetIdentity: function(m) {
        m[0] = 1, m[1] = 0, m[2] = 0, m[3] = 0,
            m[4] = 0, m[5] = 1, m[6] = 0, m[7] = 0,
            m[8] = 0, m[9] = 0, m[10] = 1, m[11] = 0,
            m[12] = 0, m[13] = 0, m[14] = 0, m[15] = 1;
    },
    mat3Create: function() {
        return new Float32Array([1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    },
    mat4RotateX: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv1 = m[1], mv5 = m[5], mv9 = m[9];
        m[1] = m[1] * c - m[2] * s;
        m[5] = m[5] * c - m[6] * s;
        m[9] = m[9] * c - m[10] * s;

        m[2] = m[2] * c + mv1 * s;
        m[6] = m[6] * c + mv5 * s;
        m[10] = m[10] * c + mv9 * s;
    },

    mat4RotateY: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];
        m[0] = c * m[0] + s * m[2];
        m[4] = c * m[4] + s * m[6];
        m[8] = c * m[8] + s * m[10];

        m[2] = c * m[2] - s * mv0;
        m[6] = c * m[6] - s * mv4;
        m[10] = c * m[10] - s * mv8;
    },

    mat4RotateZ: function(m, angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var mv0 = m[0], mv4 = m[4], mv8 = m[8];
        m[0] = c * m[0] - s * m[1];
        m[4] = c * m[4] - s * m[5];
        m[8] = c * m[8] - s * m[9];

        m[1] = c * m[1] + s * mv0;
        m[5] = c * m[5] + s * mv4;
        m[9] = c * m[9] + s * mv8;
    },
    mat4TranslateZ: function(m, t) {
        m[14] += t;
    },
    mat4TranslateY: function(m, t) {
        m[13] += t;
    },
    mat4TranslateX: function(m, t) {
        m[12] += t;
    },
    mat4SetPosition: function(m, x, y, z) {
        m[12] = x, m[13] = y, m[14] = z;
    },

    vec3Square: function(v) {
        return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    },

    vec3GetUnit: function(v) {
        var size = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return (size === 0) ? [0, 0, 0] : [v[0] / size, v[1] / size, v[2] / size];
    },
    mat4Transpose43: function(src, dst) {
        dst[0] = src[0], dst[1] = src[4], dst[2] = src[8],
            dst[3] = src[1], dst[4] = src[5], dst[5] = src[9],
            dst[6] = src[2], dst[7] = src[6], dst[8] = src[10];
    },

    vec3Normalize: function(u) {
        var size = Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]);
        u[0] /= size, u[1] /= size, u[2] /= size;
    },

    mat4GetTranslationVec3: function(m) {
        return new Float32Array([m[12], m[13], m[14]]);
    },

    vec3MultiplyByMat4: function(m, v) {
        return [
            m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12],
            m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13],
            m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14]
        ];
    },

    vec3Sub: function(A, B) {
        return new Float32Array([B[0] - A[0], B[1] - A[1], B[2] - A[2]]);
    },
    vec3SubNew: function(B, A) { // return the vector AB
        return ([A[0] - B[0], A[1] - B[1], A[2] - B[2]]);
    },

    vec3Dot: function(u, v) { // scalar product between two vectors
        return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    },

    vec3Size: function(v) { // get size of a vector
        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    },

    vec3Cross: function(u, v) {
        return new Float32Array([
            u[1] * v[2] - u[2] * v[1],
            -u[0] * v[2] + u[2] * v[0],
            u[0] * v[1] - u[1] * v[0]
        ]);
    },

    vec3SquareNorm: function(u) {
        return u[0] * u[0] + u[1] * u[1] + u[2] * u[2];
    },
    mat4Multiply: function(out, a, b) {

        var ae = a;
        var be = b;
        var te = out;

        var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

        var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    },
    mat4Scale: function(m, v) {

        var te = m;
        var x = v[0], y = v[1], z = v[2];

        // te[0] *= x; te[4] *= y; te[8] *= z;
        // te[1] *= x; te[5] *= y; te[9] *= z;
        // te[2] *= x; te[6] *= y; te[10] *= z;
        // te[3] *= x; te[7] *= y; te[11] *= z;

        te[0] *= x;
        te[5] *= y;
        te[10] *= z;

    },
    mat4Inverse: function(m, out) {

        var inv = new Float32Array(16),
            i,
            det
            ;

        inv[0] = m[5] * m[10] * m[15] -
            m[5] * m[11] * m[14] -
            m[9] * m[6] * m[15] +
            m[9] * m[7] * m[14] +
            m[13] * m[6] * m[11] -
            m[13] * m[7] * m[10];

        inv[4] = -m[4] * m[10] * m[15] +
            m[4] * m[11] * m[14] +
            m[8] * m[6] * m[15] -
            m[8] * m[7] * m[14] -
            m[12] * m[6] * m[11] +
            m[12] * m[7] * m[10];

        inv[8] = m[4] * m[9] * m[15] -
            m[4] * m[11] * m[13] -
            m[8] * m[5] * m[15] +
            m[8] * m[7] * m[13] +
            m[12] * m[5] * m[11] -
            m[12] * m[7] * m[9];

        inv[12] = -m[4] * m[9] * m[14] +
            m[4] * m[10] * m[13] +
            m[8] * m[5] * m[14] -
            m[8] * m[6] * m[13] -
            m[12] * m[5] * m[10] +
            m[12] * m[6] * m[9];

        inv[1] = -m[1] * m[10] * m[15] +
            m[1] * m[11] * m[14] +
            m[9] * m[2] * m[15] -
            m[9] * m[3] * m[14] -
            m[13] * m[2] * m[11] +
            m[13] * m[3] * m[10];

        inv[5] = m[0] * m[10] * m[15] -
            m[0] * m[11] * m[14] -
            m[8] * m[2] * m[15] +
            m[8] * m[3] * m[14] +
            m[12] * m[2] * m[11] -
            m[12] * m[3] * m[10];

        inv[9] = -m[0] * m[9] * m[15] +
            m[0] * m[11] * m[13] +
            m[8] * m[1] * m[15] -
            m[8] * m[3] * m[13] -
            m[12] * m[1] * m[11] +
            m[12] * m[3] * m[9];

        inv[13] = m[0] * m[9] * m[14] -
            m[0] * m[10] * m[13] -
            m[8] * m[1] * m[14] +
            m[8] * m[2] * m[13] +
            m[12] * m[1] * m[10] -
            m[12] * m[2] * m[9];

        inv[2] = m[1] * m[6] * m[15] -
            m[1] * m[7] * m[14] -
            m[5] * m[2] * m[15] +
            m[5] * m[3] * m[14] +
            m[13] * m[2] * m[7] -
            m[13] * m[3] * m[6];

        inv[6] = -m[0] * m[6] * m[15] +
            m[0] * m[7] * m[14] +
            m[4] * m[2] * m[15] -
            m[4] * m[3] * m[14] -
            m[12] * m[2] * m[7] +
            m[12] * m[3] * m[6];

        inv[10] = m[0] * m[5] * m[15] -
            m[0] * m[7] * m[13] -
            m[4] * m[1] * m[15] +
            m[4] * m[3] * m[13] +
            m[12] * m[1] * m[7] -
            m[12] * m[3] * m[5];

        inv[14] = -m[0] * m[5] * m[14] +
            m[0] * m[6] * m[13] +
            m[4] * m[1] * m[14] -
            m[4] * m[2] * m[13] -
            m[12] * m[1] * m[6] +
            m[12] * m[2] * m[5];

        inv[3] = -m[1] * m[6] * m[11] +
            m[1] * m[7] * m[10] +
            m[5] * m[2] * m[11] -
            m[5] * m[3] * m[10] -
            m[9] * m[2] * m[7] +
            m[9] * m[3] * m[6];

        inv[7] = m[0] * m[6] * m[11] -
            m[0] * m[7] * m[10] -
            m[4] * m[2] * m[11] +
            m[4] * m[3] * m[10] +
            m[8] * m[2] * m[7] -
            m[8] * m[3] * m[6];

        inv[11] = -m[0] * m[5] * m[11] +
            m[0] * m[7] * m[9] +
            m[4] * m[1] * m[11] -
            m[4] * m[3] * m[9] -
            m[8] * m[1] * m[7] +
            m[8] * m[3] * m[5];

        inv[15] = m[0] * m[5] * m[10] -
            m[0] * m[6] * m[9] -
            m[4] * m[1] * m[10] +
            m[4] * m[2] * m[9] +
            m[8] * m[1] * m[6] -
            m[8] * m[2] * m[5];

        det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

        if (det == 0)
            return false;

        det = 1.0 / det;

        for (i = 0; i < 16; i++)
            out[i] = inv[i] * det;

        return true;
    }


};



if (typeof module !== "undefined") {

    module.exports = math;

};