.PHONY: docs/parca-agent
docs/parca-agent:
	rm -rf tmp docs/parca-agent
	mkdir -p tmp
	git clone \
		--depth 1  \
		--filter=blob:none  \
		--sparse \
		git@github.com:parca-dev/parca-agent \
		tmp/parca-agent
	cd tmp/parca-agent && git sparse-checkout set docs
	cp -r tmp/parca-agent/docs docs/parca-agent
	for f in tmp/parca-agent/docs/*.md; do cp -- "$$f" "docs/parca-agent-$$f"; done
