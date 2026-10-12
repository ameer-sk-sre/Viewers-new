const getDisplayUnit = unit => {
  if (unit == null) {
    return '';
  }
  return unit.replace(/\s*US Region/gi, '').trim();
};

export default getDisplayUnit;

