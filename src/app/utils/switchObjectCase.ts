function snakeToCamel(string) {
  return string.replace(/_[a-z]/g, (substr) => substr.charAt(1).toUpperCase());
}

function camelToSnake(string) {
  return string.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function capitalizeFirstLetter(string) {
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}
export function mapObjectFromSnakeToCamel(object, data) {
  const keys = Object.keys(object);
  let finalObject = {};
  keys.forEach((key) => {
    if (key === 'start_date' || key === 'end_date') {
      const newKey = snakeToCamel(key);
      const date = object[key];
      // finalObject[newKey] = date;
      // finalObject[newKey + 'Pretty'] = prettyPrintDate(date);
      return;
    }
    finalObject[snakeToCamel(key)] = object[key];
  });

  return { ...finalObject, ...data };
}

export function mapArrayFromSnakeToCamel(array, data = {}) {
  return array.map((object) => ({
    ...mapObjectFromSnakeToCamel(object, ''),
    ...data,
  }));
}

export function mapObjectFromCamelToSnake(object) {
  const keys = Object.keys(object);
  let finalObject = {};
  keys.forEach((key) => {
    finalObject[camelToSnake(key)] = object[key];
  });
  return finalObject;
}
