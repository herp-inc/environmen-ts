all: sdist

format: install
	yarn prettier --write .

lint: install
	yarn eslint ./src

install:
	yarn install

sdist:
	nix-build

test: install
	yarn jest ./src --watch

typecheck: install
	yarn tsc --noEmit --watch
