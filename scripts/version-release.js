const fs = require('fs/promises');
const path = require('path');

/* Dependencies */
const argv = require('minimist')(process.argv.slice(2));
const detectIndent = require('detect-indent');
const execa = require('execa');
const { filterPackages } = require('@lerna/filter-packages');
const project = require('@lerna/project');
const semver = require('semver');

const getPackage = async () => {
  const packages = await project.getPackages(path.resolve(__dirname, '..'));
  if(!argv.scope){
    throw new Error('Invalid scope');
  }
  const include = argv.scope;
  const package = filterPackages(packages, include, [], true, false).shift();
  return package;
}

const main = async () => {
  const package = await getPackage();
  const { stdout: topLevel } = await execa(
    'git',
    [
      'rev-parse',
      '--show-toplevel'
    ],
    {
      cwd: package.location
    }
  );
  
  const oldVersion = package.version;
  const release = argv.release;
  let newVersion = argv['new-version'];
  
  if(newVersion && !semver.valid(newVersion)){
    throw new Error(`Version ${newVersion} is invalid`);
  }else if(!newVersion){
    if([ 'major', 'minor', 'patch' ].includes(release)){
      newVersion = semver.inc(oldVersion, release);
    }else{
      throw new Error('Invalid new version or release');
    }
  }
  
  const content = await fs.readFile(package.manifestLocation, 'utf-8');

  await fs.writeFile(
    package.manifestLocation,
    JSON.stringify(
      {
        ...package.toJSON(),
        version: newVersion
      },
      null,
      detectIndent(content).indent
    ) + '\n'
  );

  await execa(
    'git',
    [
      'add',
      path.relative(topLevel, package.manifestLocation)
    ],
    {
      cwd: topLevel
    }
  );

  const tagName = `${package.name}@${newVersion}`;
  const message = `publish ${tagName}`;
  
  await execa(
    'git',
    [
      'commit',
      '-nm',
      message
    ],
    {
      cwd: topLevel
    }
  );
  
  await execa(
    'git',
    [
      'tag',
      tagName,
      '-m',
      message
    ],
    {
      cwd: topLevel
    }
  );
}

main();