"use client";

import { useEffect } from "react";
import { unstableSetRender } from "antd";
import { createRoot, type Root } from "react-dom/client";

interface ContainerWithRoot extends Element {
  _reactRoot?: Root;
}

export function AntdReact19Setup() {
  useEffect(() => {
    unstableSetRender((node, container) => {
      const extendedContainer = container as ContainerWithRoot;
      if (!extendedContainer._reactRoot) {
        extendedContainer._reactRoot = createRoot(container);
      }
      const root = extendedContainer._reactRoot;
      root.render(node);
      return async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        root.unmount();
      };
    });
  }, []);

  return null;
}
