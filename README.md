# Demo-tutorial
This repo shows the code used in the
[Comparing Obelisk with DBOS](http://obeli.sk/blog/comparing-dbos-part-1) blog post.

## Setting up
If using nix and direnv:
```sh
cp .envrc-example .envrc
direnv allow
```
Otherwise install dependencies as described in [dev-deps.txt](dev-deps.txt). Following is
needed to build and run the project:
* Rust and Cargo
* Obelisk
* Just (not strictly necessary)

Build and run:
```sh
just build serve
```
When the server is running,
http://localhost:9000/serial and http://localhost:9000/parallel endpoints
can be used to start the workflows.
