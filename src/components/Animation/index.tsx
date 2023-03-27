import React from "react";
import {useRive, Layout, Fit, Alignment} from '@rive-app/react-canvas';

import styles from "./styles.module.css";

interface Props {
  src: string;
}

function Animation({ src, ...props }: Props) {
  const {rive, RiveComponent} = useRive({
    src: src,
    autoplay: false,
    // https://help.rive.app/runtimes/layout
    layout: new Layout({fit: Fit.Fill, alignment: Alignment.Center}),
  });


  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <RiveComponent
          onMouseEnter={() => rive?.play()}
          onMouseLeave={() => rive?.pause()}
          {...props}
        />
      </div>
    </div>
  );
}

export default Animation;
