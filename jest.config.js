module.exports = {
  setupFiles: [
    './jest.setup.js',
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'clover',
    'html',
  ],
};
