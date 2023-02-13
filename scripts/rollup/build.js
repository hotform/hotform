const bundles = require('./bundles');
const path = require('path');

/* Dependencies */
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const execa = require('execa');
const { filterPackages } = require('@lerna/filter-packages');
const project = require('@lerna/project');
const rollup = require('rollup');

/* Plugins */
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');

const DECLARATION_DIR = 'build/types';
const OUT_DIR = 'build';

const createDeclarations = async ({
  packageLocation,
  packageName,
  tsconfigFilePath
}) => {
  try{
    console.log(chalk.bgCyan.black(` Building ${packageName} declarations `));
    await execa(
      'tsc',
      [
        '--project',
        tsconfigFilePath,
        '--emitDeclarationOnly',
        '--declaration',
        '--declarationDir',
        DECLARATION_DIR
      ],
      {
        cwd: packageLocation
      }
    );
    console.log(chalk.bgGreen.black(` ${packageName} declarations created! \n`));
  }catch(error){
    console.log(chalk.bgRed.black(` ${packageName} \n`));
    throw error;
  }
}

const createBundle = async ({
  packageName,
  rollupOptions,
  rollupOutputOptions
}) => {
  try{
    if(rollupOutputOptions.length){
      console.log(chalk.bgBlue.black(` Building ${packageName} `));
      const bundle = await rollup.rollup(rollupOptions);
      await Promise.all(rollupOutputOptions.map(rollupOutputOption => {
        console.log(`\t${chalk.blue.bold(`${rollupOutputOption.format} - ${path.basename(rollupOutputOption.file)}`)}`);
        return bundle.write(rollupOutputOption);
      }));
      console.log(chalk.bgGreen.black(` Complete ${packageName} \n`));
    }
  }catch(error){
    console.log(chalk.bgRed.black(` ${packageName} \n`));
    throw error;
  }
}

const getPackages = async () => {
  const packages = await project.getPackages(path.resolve(__dirname, '..', '..'));
  const exclude = argv.ignore;
  const include = argv.scope;
  return filterPackages(packages, include, exclude, true, true);
}

const main = async () => {
  const packages = await getPackages();
  for(const package of packages){
    const packageJSON = package.toJSON();
    const currentBundle = bundles.bundles.find(bundle => bundle.packageName === packageJSON.name);
    if(currentBundle){
      const tsconfigFilePath = path.resolve(package.location, 'tsconfig.json');
      const rollupOptions = {
        external: currentBundle.external,
        input: path.resolve(package.location, 'src', 'index.ts'),
        plugins: [
          typescript({
            tsconfig: tsconfigFilePath
          }),
          nodeResolve({
            extensions: [
              '.js',
              '.tsx',
              '.ts'
            ]
          }),
          commonjs()
        ]
      };
      
      const rollupOutputOptions = currentBundle.bundleTypes.map(bundleType => {
        const format = bundles.getFormat(bundleType);
        const fileName = bundles.getFileName(bundleType, packageJSON.name);
        const file = path.resolve(package.location, OUT_DIR, format, fileName);
        return {
          file,
          format,
          plugins: [
            bundles.isProductionBundleType(bundleType) && terser()
          ].filter(Boolean)
        };
      });
      
      if(currentBundle.typeDeclarations){
        await createDeclarations({
          packageLocation: package.location,
          packageName: packageJSON.name,
          tsconfigFilePath
        });
      }
      
      await createBundle({
        packageName: packageJSON.name,
        rollupOptions,
        rollupOutputOptions
      });
      
      if([ bundles.BUNDLE_TYPE.CJS_DEV, bundles.BUNDLE_TYPE.CJS_PROD ].every(bundleType => currentBundle.bundleTypes.includes(bundleType))){
        await bundles.writeCJSEntryFile(
          packageJSON.name,
          path.resolve(package.location, OUT_DIR, bundles.BUNDLE_FORMAT.CJS)
        );
      }
      
      if(currentBundle.bundleTypes.includes(bundles.BUNDLE_TYPE.ESM)){
        await bundles.writeESMEntryFile(
          packageJSON.name,
          path.resolve(package.location, OUT_DIR, bundles.BUNDLE_FORMAT.ESM)
        );
      }
    }else{
      console.log(`${chalk.bgYellow.black(` ${packageJSON.name} `)} bundle not found\n`);
    }
  }
}

main();