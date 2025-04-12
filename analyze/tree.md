```
.
├── README.md
├── analyze
│   ├── stats.html
│   └── tree.md
├── dist
│   ├── cjs
│   │   ├── stepflow.js
│   │   ├── stepflow.js.map
│   │   ├── stepflow.min.js
│   │   └── stepflow.min.js.map
│   ├── esm
│   │   ├── stepflow.esm.js
│   │   ├── stepflow.esm.js.map
│   │   ├── stepflow.esm.min.js
│   │   └── stepflow.esm.min.js.map
│   ├── iife
│   │   ├── stepflow.iife.js
│   │   ├── stepflow.iife.js.map
│   │   ├── stepflow.iife.min.js
│   │   └── stepflow.iife.min.js.map
│   ├── styles
│   │   ├── stepflow.css
│   │   ├── stepflow.css.map
│   │   ├── stepflow.min.css
│   │   └── stepflow.min.css.map
│   ├── types
│   │   ├── components
│   │   │   ├── app.d.ts
│   │   │   ├── buttons
│   │   │   │   ├── cancel.d.ts
│   │   │   │   ├── nextWithComplete.d.ts
│   │   │   │   └── prev.d.ts
│   │   │   ├── contentUI.d.ts
│   │   │   ├── highlightUI.d.ts
│   │   │   ├── overlayUI.d.ts
│   │   │   ├── stepControlsUI.d.ts
│   │   │   ├── stepProgressControls.d.ts
│   │   │   ├── stepProgressUI.d.ts
│   │   │   └── tooltipUI.d.ts
│   │   ├── config
│   │   │   └── index.d.ts
│   │   ├── effects
│   │   │   ├── cleanupUI.d.ts
│   │   │   ├── index.d.ts
│   │   │   ├── initializeUI.d.ts
│   │   │   ├── scrollToTarget.d.ts
│   │   │   ├── setHighlightStyle.d.ts
│   │   │   ├── syncHighlightToTarget.d.ts
│   │   │   ├── syncTooltipToTarget.d.ts
│   │   │   └── syncUI.d.ts
│   │   ├── events
│   │   │   ├── index.d.ts
│   │   │   ├── keyboardControls.d.ts
│   │   │   └── resize.d.ts
│   │   ├── guard
│   │   │   └── types
│   │   │       └── index.d.ts
│   │   ├── helpers
│   │   │   ├── getUIHandler.d.ts
│   │   │   └── index.d.ts
│   │   ├── index.d.ts
│   │   ├── lib
│   │   │   └── core.d.ts
│   │   ├── store
│   │   │   ├── getters.d.ts
│   │   │   ├── index.d.ts
│   │   │   ├── state.d.ts
│   │   │   ├── useErrorHandler.d.ts
│   │   │   ├── useHooks.d.ts
│   │   │   ├── useNavigation.d.ts
│   │   │   └── useWatch.d.ts
│   │   ├── utils
│   │   │   ├── classes.d.ts
│   │   │   ├── getElement.d.ts
│   │   │   ├── index.d.ts
│   │   │   ├── merge.d.ts
│   │   │   └── useScrollTo.d.ts
│   │   ├── validation
│   │   │   └── index.d.ts
│   │   └── view
│   │       ├── card.d.ts
│   │       ├── conditionals.d.ts
│   │       ├── progressTemplates.d.ts
│   │       └── tooltipTemplates.d.ts
│   └── umd
│       ├── stepflow.umd.js
│       ├── stepflow.umd.js.map
│       ├── stepflow.umd.min.js
│       └── stepflow.umd.min.js.map
├── doc
├── eslint.config.mjs
├── jest.config.js
├── licence
├── package-lock.json
├── package.json
├── public
│   ├── asset
│   │   └── favicon.svg
│   ├── index.html
│   └── style
│       └── style.css
├── rollup-plugin-progress.d.ts
├── rollup.config.ts
├── src
│   ├── components
│   │   ├── app.ts
│   │   ├── buttons
│   │   │   ├── cancel.ts
│   │   │   ├── nextWithComplete.ts
│   │   │   └── prev.ts
│   │   ├── contentUI.ts
│   │   ├── highlightUI.ts
│   │   ├── overlayUI.ts
│   │   ├── stepControlsUI.ts
│   │   ├── stepProgressControls.ts
│   │   ├── stepProgressUI.ts
│   │   └── tooltipUI.ts
│   ├── config
│   │   └── index.ts
│   ├── effects
│   │   ├── cleanupUI.ts
│   │   ├── index.ts
│   │   ├── initializeUI.ts
│   │   ├── scrollToTarget.ts
│   │   ├── setHighlightStyle.ts
│   │   ├── syncHighlightToTarget.ts
│   │   ├── syncTooltipToTarget.ts
│   │   └── syncUI.ts
│   ├── events
│   │   ├── index.ts
│   │   ├── keyboardControls.ts
│   │   └── resize.ts
│   ├── guard
│   │   └── types
│   │       └── index.ts
│   ├── helpers
│   │   ├── getUIHandler.ts
│   │   └── index.ts
│   ├── index.ts
│   ├── lib
│   │   └── core.ts
│   ├── store
│   │   ├── getters.ts
│   │   ├── index.ts
│   │   ├── state.ts
│   │   ├── useErrorHandler.ts
│   │   ├── useHooks.ts
│   │   ├── useNavigation.ts
│   │   └── useWatch.ts
│   ├── styles
│   │   └── style.scss
│   ├── types
│   │   └── index.d.ts
│   ├── utils
│   │   ├── classes.ts
│   │   ├── getElement.ts
│   │   ├── index.ts
│   │   ├── merge.ts
│   │   └── useScrollTo.ts
│   ├── validation
│   │   └── index.ts
│   └── view
│       ├── card.ts
│       ├── conditionals.ts
│       ├── progressTemplates.ts
│       └── tooltipTemplates.ts
├── tests
│   ├── __mocks__
│   │   └── styleMock.ts
│   ├── index.test.ts
│   ├── setup.ts
│   ├── store
│   │   ├── getters.test.ts
│   │   ├── state.test.ts
│   │   └── store.test.ts
│   └── validation
│       └── index.test.ts
└── tsconfig.json

46 directories, 133 files
```
