const fetch = require("node-fetch");

module.exports = function () {
    return {
        name: 'docusaurus-github-releases-plugin',
        async loadContent() {
            const response = await fetch("https://api.github.com/repos/prometheus/prometheus/releases?per_page=1");
            const releases = await response.json();
            return releases[0].tag_name;
        },
        async contentLoaded({content, actions}) {
            const {setGlobalData} = actions;
            setGlobalData({versions: { parca: content }});
        },
    };
};
