import path from 'path'

/* Dependencies */
import chalk from 'chalk'
import execa from 'execa'
import project from '@lerna/project'
import rollup from 'rollup'

/* Bundles */
import * as bundles from './bundles'

/* Plugins */
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const DECLARATION_DIR = 'build/types'
const OUT_DIR = 'build'

const createDeclarations = async (
  packageLocation: string,
  packageName: string,
  tsconfigFilePath: string,
): Promise<void> => {
  try {
    console.log(chalk.bgCyan.black(` Building ${packageName} declarations `))
    await execa(
      'tsc',
      [
        '--project',
        tsconfigFilePath,
        '--emitDeclarationOnly',
        '--declaration',
        '--declarationDir',
        DECLARATION_DIR,
      ],
      {
        cwd: packageLocation,
      },
    )
    console.log(chalk.bgGreen.black(` ${packageName} declarations created! \n`))
  } catch (error) {
    console.log(chalk.bgRed.black(` ${packageName} \n`))
    throw error
  }
}

const createBundle = async (
  packageName: string,
  rollupOptions: rollup.RollupOptions,
  rollupOutputOptions: Array<rollup.OutputOptions>,
): Promise<void> => {
  try {
    if (rollupOutputOptions.length) {
      console.log(chalk.bgBlue.black(` Building ${packageName} `))
      const bundle = await rollup.rollup(rollupOptions)

      for (const rollupOutputOption of rollupOutputOptions) {
        console.log(
          `\t${chalk.blue.bold(
            `${rollupOutputOption.format} - ${path.basename(
              rollupOutputOption.file ?? '',
            )}`,
          )}`,
        )

        await bundle.write(rollupOutputOption)
      }

      console.log(chalk.bgGreen.black(` ${packageName} bundles created! \n`))
    }
  } catch (error) {
    console.log(chalk.bgRed.black(` ${packageName} \n`))
    throw error
  }
}

const main = async (): Promise<void> => {
  const packages = await project.getPackages(
    path.resolve(__dirname, '..', '..'),
  )
  for (const currentBundle of bundles.bundles) {
    const currentPackage = packages.find(
      ({ name }) => name === currentBundle.packageName,
    )
    if (currentPackage) {
      const tsconfigFilePath = path.resolve(
        currentPackage.location,
        'tsconfig.json',
      )
      const rollupOptions: rollup.RollupOptions = {
        external: currentBundle.external,
        input: path.resolve(currentPackage.location, 'src', 'index.ts'),
        plugins: [
          typescript({
            tsconfig: tsconfigFilePath,
          }),
          nodeResolve({
            extensions: ['.js', '.ts', '.tsx'],
          }),
          commonjs(),
        ],
      }

      const rollupOutputOptions: Array<rollup.OutputOptions> =
        currentBundle.bundleTypes.map(bundleType => {
          const format = bundles.getFormat(bundleType)
          const fileName = bundles.getFileName(bundleType, currentPackage.name)
          const file = path.resolve(
            currentPackage.location,
            OUT_DIR,
            format,
            fileName,
          )
          return {
            file,
            format,
            plugins: [
              bundles.isProductionBundleType(bundleType) &&
                terser({
                  module: bundles.BUNDLE_FORMAT.ESM === format,
                  toplevel: [
                    bundles.BUNDLE_FORMAT.CJS,
                    bundles.BUNDLE_FORMAT.ESM,
                  ].includes(format),
                }),
            ].filter(Boolean),
          }
        })

      if (currentBundle.typeDeclarations) {
        await createDeclarations(
          currentPackage.location,
          currentPackage.name,
          tsconfigFilePath,
        )
      }

      await createBundle(
        currentPackage.name,
        rollupOptions,
        rollupOutputOptions,
      )

      if (
        [bundles.BUNDLE_TYPE.CJS_DEV, bundles.BUNDLE_TYPE.CJS_PROD].every(
          bundleType => currentBundle.bundleTypes.includes(bundleType),
        )
      ) {
        await bundles.writeCJSEntryFile(
          currentPackage.name,
          path.resolve(
            currentPackage.location,
            OUT_DIR,
            bundles.BUNDLE_FORMAT.CJS,
          ),
        )
      }
    } else {
      console.log(
        `${chalk.bgYellow.black(
          ` ${currentBundle.packageName} `,
        )} bundle not found\n`,
      )
    }
  }
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
main()
