'use strict';

// Helper functions - Util
const $ = (id) => document.getElementById(id);
let start = Date.now();
const elapsedTime = () => Date.now() - start;
const getPixelRatio = () => 'devicePixelRatio' in window && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
const getWebGLContext = (canvas) => canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

// Helper functions - Math
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const TWO_PI = 2 * Math.PI;
const deg2Rad = (deg) => Math.PI * deg / 180;
const rad2Deg = (rad) => 180 * rad / Math.PI;
const randNum = (lo, hi) => {
  if (typeof hi === 'undefined') {
    if (typeof lo === 'undefined') {
      lo = 1;
    }
    hi = lo;
    lo = 0;
  }
  return lo + (hi - lo) * Math.random();
};

// Helper functions - color
// const pos2HSV = 
const randRGB = () => vec4.fromValues(Math.random(), Math.random(), Math.random(), 1);
const randRGBInt = () => [randNum(255), randNum(255), randNum(255), 255];

// Helper functions - Arrays / Buffers
const flatten2 = (nested2) => nested2.reduce((chain, item) => chain.concat(item));

const flatten2Buffer = (nestedArr, unitLength) => {
  let buffer = new Float32Array(nestedArr.length * unitLength);
  nestedArr.forEach((unit, idx) => {
    buffer.set(unit, idx * unitLength);
  });
  return buffer;
}

const flatten2UIntBuffer = (nestedArr, unitLength) => {
  let buffer = new Uint8Array(nestedArr.length * unitLength);
  nestedArr.forEach((unit, idx) => {
    buffer.set(unit, idx * unitLength);
  });
  return buffer;
};

// Helper functions - Shaders
function getShaderTypeName(shaderStage) {
  let type = gl.getShaderParameter(shaderStage, gl.SHADER_TYPE);

  if (type === gl.VERTEX_SHADER) {
    return 'VERTEX shader';
  } else if (type === gl.FRAGMENT_SHADER) {
    return 'FRAGMENT shader';
  } else {
    return 'unknown shader type';
  }
}

function validateShaderStage(shaderStage) {
  if (!gl.getShaderParameter(shaderStage, gl.COMPILE_STATUS)) {
    let errorText = 'shader compile error' + ' ' + getShaderTypeName(shaderStage) + ' ' + gl.getShaderInfoLog(shaderStage);
    console.error(errorText);
    // This is a critical problem and will fill your console with warnings if you use this shader stage
    throw new Error(errorText);
  }

  return shaderStage;
}

function validateShaderProgram(shaderProgram) {
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    let errorText = 'program link error' + ' ' + gl.getProgramInfoLog(shaderProgram);
    console.error(errorText);
    // This is a critical problem and will fill your console with warnings if you use this shader stage
    throw new Error(errorText);
  }

  if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS) && gl.getProgramInfoLog(shaderProgram)) {
    // This is not a critical problem.
    // Seems like getProgramParameter always returns false for VALIDATE_STATUS, so check the info log for useful info
    console.warn('program validation warning: ', gl.getProgramInfoLog(shaderProgram));
  }

  return shaderProgram;
}

function compileShaderProgram(vertId, fragId) {
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, $(vertId).text);
  gl.compileShader(vertexShader);

  validateShaderStage(vertexShader);

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, $(fragId).text);
  gl.compileShader(fragmentShader);

  validateShaderStage(fragmentShader);

  let shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  validateShaderProgram(shaderProgram);

  return shaderProgram;
}
