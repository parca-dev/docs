const fetch = require("node-fetch");

module.exports = function () {
    return {
        name: 'docusaurus-github-releases-plugin',
        async loadContent() {
            var response = await fetch("https://api.github.com/repos/parca-dev/parca/releases?per_page=1");
            var releases = await response.json();
            const parca = releases[0] ? releases[0].tag_name : 'v0.0.3-alpha.1';

            response = await fetch("https://api.github.com/repos/parca-dev/parca-agent/releases?per_page=1");
            releases = await response.json();
            const agent = releases[0] ? releases[0].tag_name : 'v0.0.1-alpha.3';

            return {parca: parca, agent: agent};
        },
        async contentLoaded({content, actions}) {
            const {setGlobalData} = actions;
            setGlobalData({versions: content});
        },
    };
};
