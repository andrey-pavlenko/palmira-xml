/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' }
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    [
      '@snowpack/plugin-run-script',
      {
        name: 'Svelte check',
        cmd: 'svelte-check --output human',
        watch: '$1 --watch',
        output: 'stream'
      }
    ]
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
    target: 'es2017'
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    open: 'none',
    port: 8080
  },
  buildOptions: {
    /* ... */
  }
};
