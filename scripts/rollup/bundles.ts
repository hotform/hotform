import fs from 'fs/promises'
import path from 'path'

export enum BUNDLE_FORMAT {
  CJS = 'cjs',
  ESM = 'esm',
}

export enum BUNDLE_TYPE {
  CJS_DEV,
  CJS_PROD,
  ESM,
}

export const bundles = [
  {
    bundleTypes: [],
    external: [],
    packageName: '@hotform/types',
    typeDeclarations: true,
  },
  {
    bundleTypes: [BUNDLE_TYPE.CJS_DEV, BUNDLE_TYPE.CJS_PROD, BUNDLE_TYPE.ESM],
    external: ['react', 'tslib'],
    packageName: '@hotform/utils',
    typeDeclarations: true,
  },
  {
    bundleTypes: [BUNDLE_TYPE.CJS_DEV, BUNDLE_TYPE.CJS_PROD, BUNDLE_TYPE.ESM],
    external: ['@hotform/utils', 'react', 'tslib'],
    packageName: '@hotform/react',
    typeDeclarations: true,
  },
]

export const getSafePackageName = (packageName: string): string =>
  packageName.replace('@', '').replace('/', '-')

export const getFileName = (
  bundleType: BUNDLE_TYPE,
  packageName: string,
): string => {
  const safePackageName = getSafePackageName(packageName)
  switch (bundleType) {
    case BUNDLE_TYPE.CJS_DEV:
      return `${safePackageName}.development.js`
    case BUNDLE_TYPE.CJS_PROD:
    case BUNDLE_TYPE.ESM:
      return `${safePackageName}.production.min.js`
    default:
      throw new Error(`Unknown file name: ${bundleType}`)
  }
}

export const getFormat = (bundleType: BUNDLE_TYPE): BUNDLE_FORMAT => {
  switch (bundleType) {
    case BUNDLE_TYPE.CJS_DEV:
    case BUNDLE_TYPE.CJS_PROD:
      return BUNDLE_FORMAT.CJS
    case BUNDLE_TYPE.ESM:
      return BUNDLE_FORMAT.ESM
    default:
      throw new Error(`Unknown format: ${bundleType}`)
  }
}

export const isProductionBundleType = (bundleType: BUNDLE_TYPE): boolean => {
  switch (bundleType) {
    case BUNDLE_TYPE.CJS_DEV:
      return false
    case BUNDLE_TYPE.CJS_PROD:
    case BUNDLE_TYPE.ESM:
      return true
    default:
      throw new Error(`Unknown type: ${bundleType}`)
  }
}

export const writeCJSEntryFile = async (
  packageName: string,
  dir: string,
): Promise<void> => {
  const lines = [
    `'use strict';`,
    `if(process.env.NODE_ENV === 'production'){`,
    `\tmodule.exports = require('./${getFileName(
      BUNDLE_TYPE.CJS_PROD,
      packageName,
    )}');`,
    `}else{`,
    `\tmodule.exports = require('./${getFileName(
      BUNDLE_TYPE.CJS_DEV,
      packageName,
    )}');`,
    `}\n`,
  ]
  const content = lines.join('\n')
  await fs.writeFile(path.resolve(dir, 'index.js'), content)
}
