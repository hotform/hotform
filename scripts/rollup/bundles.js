const fs = require('fs/promises');
const path = require('path');

const BUNDLE_FORMAT = {
  CJS: 'cjs',
  ESM: 'esm'
};

const BUNDLE_TYPE = {
  CJS_DEV: 'CJS_DEV',
  CJS_PROD: 'CJS_PROD',
  ESM: 'ESM'
};

const bundles = [
  {
    bundleTypes: [],
    external: [],
    packageName: '@hotform/types',
    typeDeclarations: true
  },
  {
    bundleTypes: [
      BUNDLE_TYPE.CJS_DEV,
      BUNDLE_TYPE.CJS_PROD,
      BUNDLE_TYPE.ESM
    ],
    external: [ 'react' ],
    packageName: '@hotform/utils',
    typeDeclarations: true
  }
];

const getSafePackageName = packageName => packageName.replace('@', '').replace('/', '-');

const getFileName = (bundleType, packageName) => {
  const safePackageName = getSafePackageName(packageName);
  switch(bundleType){
    case BUNDLE_TYPE.CJS_DEV:
      return `${safePackageName}.development.js`;
    case BUNDLE_TYPE.CJS_PROD:
    case BUNDLE_TYPE.ESM:
      return `${safePackageName}.production.min.js`;
    default:
      throw new Error(`Unknown file name: ${bundleType}`);
  }
}

const getFormat = bundleType => {
  switch(bundleType){
    case BUNDLE_TYPE.CJS_DEV:
    case BUNDLE_TYPE.CJS_PROD:
      return BUNDLE_FORMAT.CJS;
    case BUNDLE_TYPE.ESM:
      return BUNDLE_FORMAT.ESM;
    default:
      throw new Error(`Unknown format: ${bundleType}`);
  }
}

const isProductionBundleType = bundleType => {
  switch(bundleType){
    case BUNDLE_TYPE.CJS_DEV:
      return false;
    case BUNDLE_TYPE.CJS_PROD:
    case BUNDLE_TYPE.ESM:
      return true;
    default:
      throw new Error(`Unknown type: ${bundleType}`);
  }
}

const writeCJSEntryFile = async (packageName, dir) => {
  const lines = [
    `'use strict';`,
    `if(process.env.NODE_ENV === 'production'){`,
    `\tmodule.exports = require('./${getFileName(BUNDLE_TYPE.CJS_PROD, packageName)}');`,
    `}else{`,
    `\tmodule.exports = require('./${getFileName(BUNDLE_TYPE.CJS_DEV, packageName)}');`,
    `}\n`
  ];
  const content = lines.join('\n');
  await fs.writeFile(path.resolve(dir, 'index.js'), content);
}

const writeESMEntryFile = async (packageName, dir) => {
  const moduleName = getFileName(BUNDLE_TYPE.ESM, packageName);
  const lines = [
    `export { default } from './${moduleName}';`,
    `export * from './${moduleName}';\n`
  ];
  const content = lines.join('\n');
  await fs.writeFile(path.resolve(dir, 'index.js'), content);
}

module.exports = {
  BUNDLE_FORMAT,
  BUNDLE_TYPE,
  bundles,
  getFileName,
  getFormat,
  getSafePackageName,
  isProductionBundleType,
  writeCJSEntryFile,
  writeESMEntryFile
};