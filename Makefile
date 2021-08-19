.PHONY: sync-parca-agent
sync-parca-agent:
	rm -rf tmp/
	mkdir -p tmp
	rm docs/parca-agent-*
	git clone \
		--depth 1  \
		--filter=blob:none  \
		--sparse \
		git@github.com:parca-dev/parca-agent \
		tmp/parca-agent
	cd tmp/parca-agent && git sparse-checkout set docs
	cp -r tmp/parca-agent/docs docs/parca-agent
	for f in tmp/parca-agent/docs/*.md; do cp -- "$$f" "docs/parca-agent-$$(basename $$f)"; done
