
## Having trouble with `docker-compose up`?
Try `docker-compose down && docker-compose build`. Good chance that will clear it up.

## Adding a dependency from npm
Say you have a dependency called `fantasy-land`

The procedure is:

``` sh
docker-compose run web "pnpm install && pnpm install fantasy-land"
docker-compose down
docker-compose up --build
```

Make sure that you have the dependency in the new version, and then 
commit `package.json` and `pnpm-lock.yaml`.
