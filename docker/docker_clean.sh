#!/usr/bin/env bash

docker images | grep '<none>' | sed -e 's/<none>[ ]*<none>[ ]*//g' | cut -d' ' -f1 | paste -s -d' ' | xargs docker rmi