module.exports = {
  types: [
    {
      value: 'build',
      name: 'build:     Project building & change dependencies',
    },
    { value: 'ci', name: 'ci:        CI & scripts set up' },
    { value: 'docs', name: 'docs:      Updating the docs' },
    { value: 'feat', name: 'feat:      Adding features' },
    { value: 'fix', name: 'fix:       Fixing bugs' },
    {
      value: 'perf',
      name: 'perf:      Changes that improve the performance',
    },
    {
      value: 'refactor',
      name:
        // eslint-disable-next-line max-len
        'refactor:  Refactoring & cleaning up the code without fixing the code or adding new dependencies',
    },
    { value: 'revert', name: 'revert:    Revert to previous commits' },
    {
      value: 'style',
      name: 'style:     Code style improving (tabs, spaces, commas, colons etc.)',
    },
    { value: 'test', name: 'test:      Adding new tests' },
  ],

  // Area that code has affected
  scopes: [
    { name: 'models' },
    { name: 'views' },
    { name: 'controllers' },
    { name: 'components' },
    { name: 'assets' },
    { name: 'routes' },
    { name: 'resourses' },
  ],

  messages: {
    type: 'Which changes are you making?',
    scope: '\nChose the area that you changed (optional):',
    customScope: 'Select your own area:',
    subject: 'Add SHORT description in IMPERATIVE:\n',
    body: 'Add DETAILED description (optional). Use "|" for the new line:\n',
    breaking: 'BREAKING CHANGES list (optional):\n',
    footer: 'Footer metadata (tickets, links etc) e.g. SECRETMRKT-700, SECRETMRKT-800:\n',
    confirmCommit: 'Does your commit look good to you?',
  },

  allowCustomScopes: true,

  allowBreakingChanges: false,

  footerPrefix: 'METADATA:',

  // limit subject length
  subjectLimit: 72,
};
