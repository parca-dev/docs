const fetch = require("node-fetch");

module.exports = function () {
    return {
        name: 'docusaurus-github-releases-plugin',
        async loadContent() {
            var response = await fetch("https://api.github.com/repos/parca-dev/parca/releases?per_page=1");
            var releases = await response.json();
            const server = releases[0] ? releases[0].tag_name : 'v0.0.3-alpha.3';

            response = await fetch("https://api.github.com/repos/parca-dev/parca-agent/releases?per_page=1");
            releases = await response.json();
            const agent = releases[0] ? releases[0].tag_name : 'v0.0.1-alpha.5';

            response = await fetch("https://api.github.com/repos/parca-dev/parca-debuginfo/releases?per_page=1");
            releases = await response.json();
            const debuginfo_cli = releases[0] ? releases[0].tag_name : 'v0.1.0';

            return {server: server, agent: agent, debuginfo_cli: debuginfo_cli};
        },
        async contentLoaded({content, actions}) {
            const {setGlobalData} = actions;
            setGlobalData({versions: content});
        },
    };
};
