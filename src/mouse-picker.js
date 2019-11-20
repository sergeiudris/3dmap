
module.exports = {

    ray_triangle_Akenine_Moller: ray_triangle_Akenine_Moller,
    check_each_face_of_object: check_each_face_of_object,
    create_mat4: create_mat4,
    invert_mat4: invert_mat4,
    normalize_vec3: normalize_vec3,
    normalize_mouse: normalize_mouse,
    get_origin_eye_space: get_origin_eye_space,
    get_origin_model_space: get_origin_model_space,
    get_direction_eye_space: get_direction_eye_space,
    get_direction_model_space: get_direction_model_space,
    get_direction_and_origin: get_direction_and_origin,
    get_direction_and_origin_eyespace: get_direction_and_origin_eyespace,
    getObjectsUnderMouse: getObjectsUnderMouse,
    getIntersections: getIntersections,
    ray_plane: ray_plane
};

//TODO optimize vector creation  (create once and reset values instead of intitializeing new arrays each time)

function getObjectsUnderMouse(objectsToCheck, mouseX, mouseY, viewportWidth, viewportHeight, pMatrix, vMatrix, unifiedOffset, processObject, processVertex) {

    /*array of objects that have 'vertices' and 'indices' and 'offset' properties
    *if no offset - use unifiedOffset. if no unifiedOffset - use 3 (most basic, means every 3 values - next vertex)
    */
    var objects = objectsToCheck;

    /*get mouse coordinates to be normalized - between -1 and 1*/
    var mouseNormalized = normalize_mouse(mouseX, mouseY, viewportWidth, viewportHeight);
    /* invert perspective and view matrices */
    var pMatrixInv = create_mat4();
    var vMatrixInv = create_mat4();
    invert_mat4(pMatrixInv, pMatrix);
    invert_mat4(vMatrixInv, vMatrix);

    /*create matrix to store individual inverted matrices*/
    var mMatrixInv = create_mat4();

    /*get direction and origin vectors of our mouse click in eye space -  without taking model (one single object's) matrix into consideration yet*/
    var directionEyeSpace = get_direction_eye_space(mouseNormalized.x, mouseNormalized.y, pMatrixInv, vMatrixInv);
    /*same with the origin vector*/
    var originEyeSpace = get_origin_eye_space(vMatrixInv);

    /*iterate through objects, take into account each individual matrix and check itersection with each objects' face */
    var objectsUnderMouse = [];
    for (var i = 0, il = objects.length; i < il; i++) {

        var child = objects[i];
        var obj;
        /*if process function was passed, process each object*/
        if (processObject) {
            obj = processObject(child);
        } else {
            obj = child;
        }

        if (!obj) {
            continue;
        }

        /*check if object has getConcatenatedMatrix function*/
        var mMatrix;
        if (obj.getConcatenatedMatrix) {
            mMatrix = obj.getConcatenatedMatrix();
        } else {
            mMatrix = obj.matrix;
        }
        /*get inverse matrix*/
        invert_mat4(mMatrixInv, mMatrix);
        /*now get direction and origin in model space*/
        var direction = get_direction_model_space(directionEyeSpace, mMatrixInv);
        var origin = get_origin_model_space(originEyeSpace, mMatrixInv);
        /*check intersection*/
        var uvt = check_each_face_of_object(obj, origin, direction, obj.offset || unifiedOffset || 3, processVertex)
        if (uvt) {
            //object is under mouse
            /*TODO - use uvt*/
            objectsUnderMouse.push(child);
        };
    }
    return objectsUnderMouse;

}

function getIntersections(objects, originEyeSpace, directionEyeSpace, unifiedOffset, processObject, processVertex) {


    /*iterate through objects, take into account each individual matrix and check itersection with each objects' face */
    var objectsUnderMouse = [];
    for (var i = 0, il = objects.length; i < il; i++) {

        var child = objects[i];
        var obj;
        /*if process function was passed, process each object*/
        if (processObject) {
            obj = processObject(child);
        } else {
            obj = child;
        }

        if (!obj) {
            continue;
        }

        /*check if object has getConcatenatedMatrix function*/
        var mMatrix;
        var mMatrixInv = create_mat4(); 
        if (obj.getConcatenatedMatrix) {
            mMatrix = obj.getConcatenatedMatrix();
        } else {
            mMatrix = obj.matrix;
        }
        /*get inverse matrix*/
        invert_mat4(mMatrixInv, mMatrix);
        /*now get direction and origin in model space*/
        var direction = get_direction_model_space(directionEyeSpace, mMatrixInv);
        var origin = get_origin_model_space(originEyeSpace, mMatrixInv);
        /*check intersection*/
        var uvt = check_each_face_of_object(obj, origin, direction, obj.offset || unifiedOffset || 3, processVertex)
        if (uvt) {
            //object is under mouse
            /*TODO - use uvt*/
            objectsUnderMouse.push(child);
        };
    }
    return objectsUnderMouse;
}

function get_direction_and_origin(mouseX, mouseY, viewportWidth, viewportHeight, pMatrix, vMatrix, mMatrix) {

    var mouseNormalized = normalize_mouse(mouseX, mouseY, viewportWidth, viewportHeight);
    /* invert perspective and view matrices */
    var pMatrixInv = create_mat4();
    var vMatrixInv = create_mat4();
    var mMatrixInv = create_mat4();
    invert_mat4(pMatrixInv, pMatrix);
    invert_mat4(vMatrixInv, vMatrix);
    invert_mat4(mMatrixInv, mMatrix);

    /*create matrix to store individual inverted matrices*/
    /*get direction and origin vectors of our mouse click in eye space -  without taking model (one single object's) matrix into consideration yet*/
    var directionEyeSpace = get_direction_eye_space(mouseNormalized.x, mouseNormalized.y, pMatrixInv, vMatrixInv);
    /*same with the origin vector*/
    var originEyeSpace = get_origin_eye_space(vMatrixInv);
    var direction = get_direction_model_space(directionEyeSpace, mMatrixInv);
    var origin = get_origin_model_space(originEyeSpace, mMatrixInv);
    //console.log(direction, origin);
    return {
        origin: origin,
        direction: direction

    }
}

function get_direction_and_origin_eyespace(mouseX, mouseY, viewportWidth, viewportHeight, pMatrix, vMatrix) {
    var mouseNormalized = normalize_mouse(mouseX, mouseY, viewportWidth, viewportHeight);
    /* invert perspective and view matrices */
    var pMatrixInv = create_mat4();
    var vMatrixInv = create_mat4();
    var mMatrixInv = create_mat4();
    invert_mat4(pMatrixInv, pMatrix);
    invert_mat4(vMatrixInv, vMatrix);

    /*create matrix to store individual inverted matrices*/
    /*get direction and origin vectors of our mouse click in eye space -  without taking model (one single object's) matrix into consideration yet*/
    var directionEyeSpace = get_direction_eye_space(mouseNormalized.x, mouseNormalized.y, pMatrixInv, vMatrixInv);
    /*same with the origin vector*/
    var originEyeSpace = get_origin_eye_space(vMatrixInv);
    //console.log(direction, origin);
    return {
        origin: originEyeSpace,
        direction: directionEyeSpace

    }
}

function ray_plane(mouseX, mouseY, viewportWidth, viewportHeight, pMatrix, vMatrix, mMatrix, A, B, C/*unused*/, D) {

    /*get mouse coordinates to be normalized - between -1 and 1*/
    var mouseNormalized = normalize_mouse(mouseX, mouseY, viewportWidth, viewportHeight);
    /* invert perspective and view matrices */
    var pMatrixInv = create_mat4();
    var vMatrixInv = create_mat4();
    var mMatrixInv = create_mat4();
    invert_mat4(pMatrixInv, pMatrix);
    invert_mat4(vMatrixInv, vMatrix);
    invert_mat4(mMatrixInv, mMatrix);

    /*get direction and origin vectors of our mouse click in eye space -  without taking model (one single object's) matrix into consideration yet*/
    var directionEyeSpace = get_direction_eye_space(mouseNormalized.x, mouseNormalized.y, pMatrixInv, vMatrixInv);
    /*same with the origin vector*/
    var originEyeSpace = get_origin_eye_space(vMatrixInv);

    /*now get direction and origin in model space*/
    var direction = get_direction_model_space(directionEyeSpace, mMatrixInv);
    var origin = get_origin_model_space(originEyeSpace, mMatrixInv);


    var n = [0, 0, 0],
        edgeAB = [0, 0, 0],
        edgeAD = [0, 0, 0],
        originToOrigin = [0, 0, 0],
        dotNDirection = null,
        dotNOriginToOrigin = null,
        t = null,
        point = [0, 0, 0]
        ;

    // (p - p0 ) [dot] n = 0;  // any point p on a plane
    // origin + direction* t = p // ray - point equation

    //t = (p0 - origin)[dot] n / direction[dot]n 

    sub(edgeAB, B, A);
    sub(edgeAD, D, A);

    cross(n, edgeAB, edgeAD);
    normalize_vec3(n);

    dotNDirection = dot(direction, n);
    if (dotNDirection < EPSILON) {
        console.log("parallel");
        return 0;
    }
    sub(originToOrigin, A, origin);
    // normalize_vec3(originToOrigin);
    dotNOriginToOrigin = dot(originToOrigin, n);

    t = dotNOriginToOrigin / dotNDirection;


    return [origin[0] + direction[0] * t, origin[1] + direction[1] * t, origin[2] + direction[2] * t, 1];


}


function ray_triangle_Akenine_Moller(origin, direction, A, B, C, test_cull) {

    var t,//distance to the intersection
        u, v // bycentric coordinates of the intersection u,v >= 0, u+v<=1
        ;

    var edge1 = [0, 0, 0],
        edge2 = [0, 0, 0],
        tvec = [0, 0, 0],
        pvec = [0, 0, 0],
        qvec = [0, 0, 0],
        det = 0.0,
        inv_det = 0.0
        ;
    /*find vector for two enges sharing A*/
    sub(edge1, B, A);
    sub(edge2, C, A);
    /*begin calcualtin determinant  - also used to calculate U parameter*/
    cross(pvec, direction, edge2);
    /*if deteerminat is near zero, ray lies in plane of triangle*/
    det = dot(edge1, pvec);

    if (test_cull) {/*define test cull is culling is desired*/
        if (det < EPSILON) {
            return 0;
        }
        /*calculate distance from A to origin*/
        sub(tvec, origin, A);
        /*calculate U parameter and test bounds*/
        u = DOT(tvec, pvec);
        if (u < 0.0 || u > det) {
            return 0;
        }
        /*prepare to test V parameter*/
        cross(qvec, tvec, edge1);
        /*calculate V parameter and test bounds*/
        v = dot(direction, qvec);
        if (v < 0.0 || u + v > det) {
            return 0;
        }
        /*calculate t, scale parameters, ray intersects triangle*/
        t = dot(edge2, qvec);
        inv_det = 1.0 / det;
        t *= inv_det;
        u *= inv_det;
        v *= inv_det;
    } else {/*the non-culling branch*/
        if (det > -EPSILON && det < EPSILON) {
            return 0;
        }
        inv_det = 1.0 / det;
        /*calculate the distance from A to origin*/
        sub(tvec, origin, A);
        /*calcualte U parameter to test bounds*/
        u = dot(tvec, pvec) * inv_det;
        if (u < 0.0 || u > 1.0) {
            return 0;
        }
        /*prepare to test v parameter*/
        cross(qvec, tvec, edge1);
        /*calculate V parameter and test bounds*/
        v = dot(direction, qvec) * inv_det;
        if (v < 0.0 || u + v > 1.0) {
            return 0;
        }
        /*calculate t,ray intersects triangle*/
        t = dot(edge2, qvec) * inv_det;
    }
    return {
        u: u,
        v: v,
        t: t
    };

};




function get_direction_eye_space(mouseXNormalized, mouseYNormalized, pMatrixInv, vMatrixInv) {
    var direction = [mouseXNormalized, mouseYNormalized, -1.0, 0.0];
    /*we can multiply by invese of pMatrix OR dir[0] /= pMatirx[0], dir[1] /= pMatrix[5]*/
    mat4_multiply_vec4(direction, pMatrixInv, direction);
    direction[2] = -1.0;
    direction[3] = 0.0;
    /*now we have unprojected mouse point. next we get vector in camera space (take into account view matrix) */
    mat4_multiply_vec4(direction, vMatrixInv, direction);
    return direction;

}

function get_direction_model_space(directionEyeSpace, mMatrixInv) {
    /*here we apply any individual( model)matrix of a scene object  
    */
    var direction = directionEyeSpace.slice(0);
    mat4_multiply_vec4(direction, mMatrixInv, direction);
    return direction;
}
function get_origin_eye_space(vMatrixInv) {
    var origin = [0, 0, 0, 1];
    mat4_multiply_vec4(origin, vMatrixInv, origin);
    return origin;

}
function get_origin_model_space(originEyeSpace, mMatrixInv) {
    var origin = originEyeSpace.slice(0);
    mat4_multiply_vec4(origin, mMatrixInv, origin);
    return origin;

}

function normalize_mouse(mouseX, mouseY, viewportWidth, viewportHeight) {
    var worldX = mouseX / (viewportWidth / 2) - 1;
    var worldY = 1 - mouseY / (viewportHeight / 2);
    return {
        x: worldX,
        y: worldY
    };
}

function check_each_face_of_object(obj, origin, direction, offset, processVertex) {
    var vertices = obj.vertices || obj.mesh.vertices;
    var indices = obj.indices || obj.mesh.indices;
    var A, B, C, iA, iB, iC;
    for (var j = 0, ll = indices.length; j < ll; j += 3) {
        iA = indices[j];
        iB = indices[j + 1];
        iC = indices[j + 2];
        if (processVertex) {
            A = processVertex(vertices[iA * offset], vertices[iA * offset + 1], vertices[iA * offset + 2]);
            B = processVertex(vertices[iB * offset], vertices[iB * offset + 1], vertices[iB * offset + 2]);
            C = processVertex(vertices[iC * offset], vertices[iC * offset + 1], vertices[iC * offset + 2]);
        } else {
            A = [vertices[iA * offset], vertices[iA * offset + 1], vertices[iA * offset + 2]];
            B = [vertices[iB * offset], vertices[iB * offset + 1], vertices[iB * offset + 2]];
            C = [vertices[iC * offset], vertices[iC * offset + 1], vertices[iC * offset + 2]];
        }
        if (ray_triangle_Akenine_Moller(origin, direction, A, B, C, false)) {
            return true;
        }
    }

}


var EPSILON = 0.000001;

function cross(out, v1, v2) {
    out[0] = v1[1] * v2[2] - v1[2] * v2[1];
    out[1] = v1[2] * v2[0] - v1[0] * v2[2];
    out[2] = v1[0] * v2[1] - v1[1] * v2[0];
};

function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}
function sub(out, v1, v2) {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    out[2] = v1[2] - v2[2];
}

function normalize_vec3(u) {
    var size = Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]);
    u[0] /= size, u[1] /= size, u[2] /= size;
};


function invert_mat4(out, m) {

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
};



function create_mat4() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
};
function mat4_multiply_vec4(out, m, v) {

    var x, y, z, w;
    x = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3];
    y = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3];
    z = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3];
    w = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3];

    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
};

function mat4_multiply_mat4(out, a, b) {

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

};
