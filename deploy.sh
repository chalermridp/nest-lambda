#!/bin/bash

mkdir -p deploy
npm install
npm run build
npm prune --production
zip -r deploy/nest-lambda.zip dist/ node_modules

aws cloudformation package --template-file nest-lambda.yaml --s3-bucket oh-nest-lambda --output-template-file deploy/nest-lambda.out.yaml

aws cloudformation deploy --template-file deploy/nest-lambda.out.yaml --stack-name oh-nest-lambda --capabilities CAPABILITY_IAM