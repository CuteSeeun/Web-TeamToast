declare module '*.svg' {
    import React from 'react';
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export { ReactComponent };
    const src: string;
    export default src;
  }

  declare module '*.gif' {
    const value: string;
    export default value;
  }

  declare module '@emoji-mart/react' {
    const Picker: any;
    export {Picker};
  }
  