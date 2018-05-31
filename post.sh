#!/bin/sh

groupId=com.uas.platform
artifactId=mall-ssr
packaging=tgz
version=1.0.0
repo_uri='http://10.10.100.23:23004/v1/artifact'

basepath=$(cd `dirname $0`; pwd)
buildfile=$basepath/dist.tgz

cnpm install
#npm run build
tar -czf $buildfile .
curl -H "Expect:" -F "groupId=$groupId" -F "artifactId=$artifactId" -F "packaging=$packaging"  -F "version=$version" -F "file=@$buildfile" $repo_uri
rm -rf $buildfile
