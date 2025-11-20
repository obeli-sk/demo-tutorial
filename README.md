# Demo-tutorial
This repo shows code used in the
[Comparing Obelisk with DBOS](http://obeli.sk/blog/comparing-dbos-part-1) blog post.

## Setting up
If using nix and direnv:
```sh
cp .envrc-example .envrc
direnv allow
```
Otherwise install dependencies as described in [dev-deps.txt](dev-deps.txt)


Build and run:
```sh
just build serve
```
When the server is running,
http://localhost:9000/serial and http://localhost:9000/parallel endpoints
can be used to start workflows.