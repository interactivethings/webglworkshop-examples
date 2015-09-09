'use strict';

// Helper functions - DOM
const $ = (id) => document.getElementById(id);

// Helper functions - Math
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const TWO_PI = 2 * Math.PI;

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
