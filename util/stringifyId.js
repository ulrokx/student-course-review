/**
 * Takes object and if _id field is present, replaces it with id field as a string
 * @param {Object} obj
 * @returns {Object} object with id
 */
export default function stringifyId(obj) {
  const { _id, ...rest } = obj;
  return {
    id: _id.toString(),
    ...rest,
  };
}
