
[![Build Status](https://magnum.travis-ci.com/mhoc/meadle-backend.svg?token=noEZqHCNie4E6CC2GGKT&branch=master)](https://magnum.travis-ci.com/mhoc/meadle-backend)

Pre-Reqs
========

1. `brew install node`

2. `brew install mongo`


Setting It Up
=============

1. `git clone` repository

2. `npm install`

3. In a separate terminal, run `mongod`


Running
=======

1. `node server.js`

2. Visit `localhost:3000` to confirm it works


Testing
=======

`run.sh` automates all of the following steps

1. Run an instance of the mongodb server with `mongod`

2. Run an instance of the meadle-backend server with `node server.js`

3. Run the tests with `mocha`

Deploying Changes
=================

Commits to the master branch of this github repository will initiate our build process on codeship.io then automatically deploy to heroku on completion.

Note that we have 100 builds per month on codeship. If you are just pushing to a development branch, please add `--skip-ci` to the commit message.
deploy
