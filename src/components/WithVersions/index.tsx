import React, {ReactNode} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';

interface Props {
  children: ReactNode;
}

const VersionContext = React.createContext()

export const WithVersions = ({children, language}) => {
  const {versions} = usePluginData('docusaurus-github-releases-plugin');

  return (
    <VersionContext.Provider value={versions}>
      <VersionContext.Consumer>
        {children}
      </VersionContext.Consumer>
    </VersionContext.Provider>
  );
}

export default WithVersions;
