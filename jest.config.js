module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // Ajoute tous les modules D3 et dépendances ES ici
  transformIgnorePatterns: [
    "/node_modules/(?!d3.*|internmap|delaunator|robust-predicates|@d3/.*)"
  ]
}