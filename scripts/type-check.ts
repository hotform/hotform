import path from 'path'

/* Dependencies */
import chalk from 'chalk'
import execa from 'execa'
import project from '@lerna/project'

const topLevel = path.resolve(__dirname, '..')

const typeCheck = async (
  location: string,
  tsconfigFilePath: string,
  packageName?: string,
): Promise<void> => {
  const logKey = packageName ?? tsconfigFilePath.replace(topLevel, '')
  try {
    console.log(chalk.bgCyan.black(` Checking ${logKey} `))

    await execa('tsc', ['--project', tsconfigFilePath, '--noEmit'], {
      cwd: location,
    })

    console.log(chalk.bgGreen.black(` ${logKey} type check successful! \n`))
  } catch (error) {
    console.log(chalk.bgRed.black(` ${logKey} \n`))
    throw error
  }
}

const main = async (): Promise<void> => {
  const packages = await project.getPackages(topLevel)

  for (const currentPackage of packages) {
    const tsconfigFilePath = path.resolve(
      currentPackage.location,
      'tsconfig.json',
    )
    await typeCheck(
      currentPackage.location,
      tsconfigFilePath,
      currentPackage.name,
    )
  }

  await typeCheck(topLevel, path.resolve(topLevel, 'tsconfig.cjs.json'))
  await typeCheck(topLevel, path.resolve(topLevel, 'tsconfig.test.json'))
}

/* eslint-disable-next-line @typescript-eslint/no-floating-promises */
main()
