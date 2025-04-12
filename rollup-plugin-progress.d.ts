// rollup-plugin-progress.d.ts
declare module "rollup-plugin-progress" {
  interface ProgressOptions {
    clearLine?: boolean;
    silent?: boolean;
  }

  function progress(options?: ProgressOptions): unknown;

  export default progress;
}
