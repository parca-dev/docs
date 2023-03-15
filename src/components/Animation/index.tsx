import React from "react";
import Rive, { Layout, Fit, Alignment } from '@rive-app/react-canvas';

import styles from "./styles.module.css";

interface Props {
  src: string;
}


function Animation({ src, ...props }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Rive
          src={src}
          // https://help.rive.app/runtimes/layout
          layout={new Layout({ fit: Fit.Fill, alignment: Alignment.Center })}
          {...props}
        />
      </div>
    </div>
  );
}

export default Animation;
