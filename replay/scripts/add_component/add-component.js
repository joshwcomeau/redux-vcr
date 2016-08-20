/* eslint-disable no-console, no-use-before-define */
import path from 'path';
import fs from 'fs';
import changeCase from 'change-case';


function run(componentName) {
  if (!componentName) {
    throw new Error(`
      Please supply a component name!
      'npm run add-component -- YourComponentName'
    `);
  } else if (!changeCase.upperCaseFirst(componentName)) {
    throw new Error(`
      Custom React components need to be in PascalCase.
      You provided ${componentName}.
      Please capitalize the first letter!
    `);
  }

  const componentDirectory = path.join(
    __dirname,
    '../../src/components',
    componentName
  );
  createDirectory(componentDirectory);

  const className = changeCase.paramCase(componentName);

  // Create and write JS to file
  const componentPath = path.join(componentDirectory, 'index.js');
  const componentTemplate = buildJSTemplate(componentName, className);
  fs.writeFileSync(componentPath, componentTemplate);

  // Create and write SCSS to file
  const scssPath = path.join(componentDirectory, 'index.scss');
  const scssTemplate = buildCSSTemplate(componentName, className);
  fs.writeFileSync(scssPath, scssTemplate);

  // Create and write a Story to file
  const storyDirectory = path.join(
    __dirname,
    '../../src/stories',
    className
  );
  createDirectory(storyDirectory);

  const storyPath = path.join(storyDirectory, 'index.js');
  const storyTemplate = buildStoryTemplate(componentName);
  fs.writeFileSync(storyPath, storyTemplate);

  console.info(`Component ${componentName} successfully created!`);
  return true;
}


// Helper Methods
function createDirectory(componentDirectory) {
  try {
    fs.mkdirSync(componentDirectory);
  } catch (err) {
    throw new Error(`Sorry, it appears the component ${componentName} already exists!`);
  }

  return componentDirectory;
}

function buildJSTemplate(componentName, className) {
  // Not digging the break in indentation here,
  // but it's needed for the file to render correctly :(
  return `\
// eslint-disable-next-line no-unused-vars
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import './index.scss';


const ${componentName} = () => {
  const classes = classNames('${className}');

  return (
    <div className={classes}>
      Your Component Here :)
    </div>
  );
};

${componentName}.propTypes = {

};

${componentName}.defaultProps = {

};

export default ${componentName};\n`;
}

function buildCSSTemplate(componentName, className) {
  return `\
@import '../variables';

.${className} {

}\n`;
}

function buildStoryTemplate(componentName) {
  return `\
/* eslint-disable semi, no-unused-vars */
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import ${componentName} from '../src/components/${componentName}';

storiesOf('${componentName}', module)
  .add('default', () => (
    <${componentName} />
  ))
`;
}

const componentName = process.argv[2];
run(componentName);
