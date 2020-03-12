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

upload-assets:
	aws s3 rm s3://spectator-static-assets/$(slug)/ --recursive --exclude "*" --include "*" --profile=spec
	aws s3 cp dist/ s3://spectator-static-assets/$(slug)/ --recursive --exclude "*" --include "*" --acl=public-read --profile=spec

deploy-gh: build
	cd dist && git add . && git commit -m 'Deploy to gh-pages' && git push origin gh-pages

deploy-arc: build upload-assets

clean:
	rm -rf dist
	git worktree prune
	mkdir dist
	git worktree add dist gh-pages
