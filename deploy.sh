#!/usr/bin/env sh

# abort on errors
set -e

# build the project
npm run build

# check if the dist directory exists
if [ -d "dist" ]; then
  cd dist
else
  echo "Build directory 'dist' does not exist, aborting."
  exit 1
fi

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# remove previous .git folder and initialize git again
rm -rf .git
git init

git add -A
git commit -m 'deploy'

# push to gh-pages branch
git push -f https://github.com/andy922200/component-library-demo.git main:gh-pages

cd -

# clean up
rm -rf dist/.git