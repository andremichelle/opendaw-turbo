# Installation

* `npm run cert` (only for the very first time)
* `npm run clean` (to revert to clean slate, removes all node- and cache-folders)
* `npm install`
* `npm run build`
* `npm run dev:studio` | `npm run dev:headless` (cannot run both)
* https://localhost:8080 (port is important > cors sample api)

# Challenges

## Share Studio-Core + Worklets

The current challenge is to share `studio-core` or even better an empty `studio-sdk` with all three compiled worklets
and dependencies with Riffle's repo.

The goal is not to have a massive number of custom scripts and work with on-board tools (npm), but so far no luck.

I tried:

* bundle(d)Dependencies (seems buggy, weirdly does not include any dependency)
* rollout (never understood what it really does and any AI failed to master it)

## Clean Deployment

* Fix turbo warnings
    * WARNING no output files found for task @opendaw/studio-adapters#build. Please check your `outputs` key in
      `turbo.json`
    * WARNING no output files found for task @opendaw/studio-core-processors#build. Please check your `outputs` key in
      `turbo.json`
    * WARNING no output files found for task @opendaw/studio-forge-boxes#build. Please check your `outputs` key in
      `turbo.json`
* Revive `github` action to deploy openDAW studio