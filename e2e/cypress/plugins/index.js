/// <reference types="cypress" />

const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  addMatchImageSnapshotPlugin(on, config);
} 
