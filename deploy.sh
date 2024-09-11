#!/usr/bin/env sh

# abort on errors
set -e

# build
# 將專案打包
npm run build

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m '~~deploy~~'

# 如果你要部署在 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main
git push -f https://github.com/andy922200/component-library-demo.git master:gh-pages

cd -

rm -rf dist/.git