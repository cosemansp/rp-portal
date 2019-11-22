/**
 * Wait for a number of ms
 */
module.exports.wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  })
}

/**
 * Checks if the input is set
 */
module.exports.isInput = (data, number) => {
  var mask = 1 << number - 1;
  return (data & mask) != 0;
}