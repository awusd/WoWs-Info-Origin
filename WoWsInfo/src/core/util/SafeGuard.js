/**
 * Get to path of obj and return its value or return default value
 * @param {*} obj 
 * @param {string} path 
 * @param {*} dval 
 */
export const Guard = (obj, path, dval) => {
  // check if object is valid and path does not start with or end with '.'
  if (!path.startsWith('.') && !path.endsWith('.')) {
    // get path as an array and it must have at least 2 elements
    let p = path.split('.');
    if (p && p.length > 0) {
      // o is the object (accumulator), and n is from path (current value)
      // o && o[n] -> to go further or just return default value
      // only asking for the object
      return p.reduce((o, n) => (o && o[n]) ? o[n] : dval, obj);
    }
  }   
  return dval;
}