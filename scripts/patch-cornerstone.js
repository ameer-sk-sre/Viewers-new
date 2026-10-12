const fs = require('fs');
const path = require('path');

const srcFile = path.resolve(__dirname, '../extensions/cornerstone/src/utils/getCalibratedUnits.js');
const targetFile = path.resolve(__dirname, '../node_modules/@cornerstonejs/tools/dist/esm/utilities/getCalibratedUnits.js');

try {
  if (fs.existsSync(srcFile) && fs.existsSync(path.dirname(targetFile))) {
    fs.copyFileSync(srcFile, targetFile);
    console.log('[patch-cornerstone] Successfully applied getCalibratedUnits patch to node_modules/@cornerstonejs/tools');
  }
} catch (e) {
  console.warn('[patch-cornerstone] Could not apply patch:', e.message);
}
