.PHONY: download build upload-assets deploy clean

slug = manhattanville-businesses

download:
	node process/download-doc.js

PAGE_NUMBERS = 0 1 2 3
create-pages:
	$(foreach pageNum, $(PAGE_NUMBERS),touch src/index${pageNum}.html; (echo '<pageConfig>{{ pageNum = $(pageNum) }}</pageConfig>'; cat src/index.html) > src/index${pageNum}.html;)

destroy-pages:
	$(foreach index,$(INDICES),rm -f src/index${index}.html;)

build:
	rm -rf dist/*
	npm run build

# upload-assets:
# 	aws s3 rm s3://spectator-static-assets/$(slug)/ --recursive --exclude "*" --include "*" --profile=spec
# 	aws s3 cp dist/ s3://spectator-static-assets/$(slug)/ --recursive --exclude "*" --include "*" --acl=public-read --profile=spec

deploy-gh: build
	cd dist && git add . && git commit -m 'Deploy to gh-pages' && git push origin gh-pages

# deploy-arc: build upload-assets

# I messed up the syncing/--no-content-hash so now we have to do this after pub:
# rename a dist file from the --no-content-hash hash to the hash from the build without --no-content-hash
sync-js-no-build:
	aws s3 cp dist/script.75da7f30.js s3://spectator-static-assets/$(slug)/script.27bc1f26.js  --acl=public-read --profile=spec
	aws s3 cp dist/script.75da7f30.js.map s3://spectator-static-assets/$(slug)/  --acl=public-read --profile=spec
sync-js: build sync-js-no-build

sync-css-no-build:
	aws s3 cp dist/styles.164d45a1.css s3://spectator-static-assets/$(slug)/styles.d5e507b6.css  --acl=public-read --profile=spec
	aws s3 cp dist/styles.164d45a1.css.map s3://spectator-static-assets/$(slug)/  --acl=public-read --profile=spec
sync-css: build sync-css-no-build

deploy-arc: build sync-js-no-build sync-css-no-build
deploy-arc-no-build: sync-js-no-build sync-css-no-build

clean:
	rm -rf dist
	git worktree prune
	mkdir dist
	git worktree add dist gh-pages
