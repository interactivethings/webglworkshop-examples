function icosphere(subdivisions) {
  subdivisions = +subdivisions|0

  if (subdivisions > 5) {
    console.warn('An icosphere subdivided more than 5 times is a tough proposition. This could take a couple minutes...');
    console.warn('(at least until the lookups in the algorithm are optimized some more)');
  }

  var positions = []
  var faces = []
  var t = 0.5 + Math.sqrt(5) / 2

  positions.push(vec3.fromValues(-1, +t,  0))
  positions.push(vec3.fromValues(+1, +t,  0))
  positions.push(vec3.fromValues(-1, -t,  0))
  positions.push(vec3.fromValues(+1, -t,  0))

  positions.push(vec3.fromValues( 0, -1, +t))
  positions.push(vec3.fromValues( 0, +1, +t))
  positions.push(vec3.fromValues( 0, -1, -t))
  positions.push(vec3.fromValues( 0, +1, -t))

  positions.push(vec3.fromValues(+t,  0, -1))
  positions.push(vec3.fromValues(+t,  0, +1))
  positions.push(vec3.fromValues(-t,  0, -1))
  positions.push(vec3.fromValues(-t,  0, +1))

  faces.push([0, 11, 5])
  faces.push([0, 5, 1])
  faces.push([0, 1, 7])
  faces.push([0, 7, 10])
  faces.push([0, 10, 11])

  faces.push([1, 5, 9])
  faces.push([5, 11, 4])
  faces.push([11, 10, 2])
  faces.push([10, 7, 6])
  faces.push([7, 1, 8])

  faces.push([3, 9, 4])
  faces.push([3, 4, 2])
  faces.push([3, 2, 6])
  faces.push([3, 6, 8])
  faces.push([3, 8, 9])

  faces.push([4, 9, 5])
  faces.push([2, 4, 11])
  faces.push([6, 2, 10])
  faces.push([8, 6, 7])
  faces.push([9, 8, 1])

  var complex = {
      cells: faces
    , positions: positions
  }

  while (subdivisions-- > 0) {
    complex = subdivide(complex)
  }

  positions = complex.positions
  for (var i = 0; i < positions.length; i++) {
    positions[i] = vec3.normalize(vec3.create(), positions[i])
  }

  return complex;
}

// TODO: work out the second half of loop subdivision
// and extract this into its own module.
function subdivide(complex) {
  var positions = complex.positions
  var cells = complex.cells

  var newCells = []
  var newPositions = []
  var newPositionsLength = 0

  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i]
    var c0 = cell[0]
    var c1 = cell[1]
    var c2 = cell[2]
    var v0 = positions[c0]
    var v1 = positions[c1]
    var v2 = positions[c2]

    var a = getMidpoint(v0, v1)
    var b = getMidpoint(v1, v2)
    var c = getMidpoint(v2, v0)

    // Add the midpoints to the new positions, but don't add duplicates
    var ai = newPositions.indexOf(a)
    if (ai === -1) { ai = newPositionsLength++, newPositions.push(a) }
    var bi = newPositions.indexOf(b)
    if (bi === -1) { bi = newPositionsLength++, newPositions.push(b) }
    var ci = newPositions.indexOf(c)
    if (ci === -1) { ci = newPositionsLength++, newPositions.push(c) }

    // Add the original positions to the new positions, but don't add duplicates
    var v0i = newPositions.indexOf(v0)
    if (v0i === -1) { v0i = newPositionsLength++, newPositions.push(v0) }
    var v1i = newPositions.indexOf(v1)
    if (v1i === -1) { v1i = newPositionsLength++, newPositions.push(v1) }
    var v2i = newPositions.indexOf(v2)
    if (v2i === -1) { v2i = newPositionsLength++, newPositions.push(v2) }

    // Add the indexes to the cell surfaces
    newCells.push([v0i, ai, ci])
    newCells.push([v1i, bi, ai])
    newCells.push([v2i, ci, bi])
    newCells.push([ai, bi, ci])
  }

  return {
      cells: newCells
    , positions: newPositions
  }
}

// reuse midpoint vertices between iterations.
// Otherwise, there'll be duplicate vertices in the final
// mesh, resulting in sharp edges.
function getMidpoint(a, b) {
  var point = midpoint(a, b)
  // pointToKey uses toPrecision(6) to compare points
  // if the points are that close, use the same one
  var pointKey = pointToKey(point)
  var cache = getMidpoint._midpointsCache;
  var cachedPoint = cache[pointKey]
  if (cachedPoint) {
    return cachedPoint
  } else {
    return cache[pointKey] = point
  }
}

getMidpoint._midpointsCache = {};

function midpoint(a, b) {
  return vec3.fromValues(
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
    (a[2] + b[2]) / 2
  );
}

function pointToKey(position) {
  return position[0].toPrecision(6) + ','
       + position[1].toPrecision(6) + ','
       + position[2].toPrecision(6)
}
