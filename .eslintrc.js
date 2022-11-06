module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    // ESLint ( No rules are enabled by default )
    // Configuring Rules - https://eslint.org/docs/user-guide/configuring#configuring-rules
    // Rules - https://eslint.org/docs/rules/
    'no-mixed-spaces-and-tabs': 'off', // Enabled by eslint:recommended
    'no-unused-vars': 'off', // Enabled by eslint:recommended
    'no-console': 'off', // Enabled by eslint:recommended
    'space-before-function-paren': ['error', 'always'],
    'quote-props': 'off',
    curly: 'off',
    'spaced-comment': 'off',
    indent: 'off',
    'array-bracket-spacing': 'off',
    'import/no-named-as-default': 'off',
    'no-trailing-spaces': 'off',
    'eol-last': 'off',
    'no-mixed-operators': 'off',
    'arrow-parens': 'off',
    'comma-dangle': 'off',

    // Vue
    // Rules - https://vuejs.github.io/eslint-plugin-vue/rules/
    'vue/require-valid-default-prop': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    'vue/no-unused-components': 'error',
    'vue/no-side-effects-in-computed-properties': 'error',
    'vue/no-async-in-computed-properties': 'error',
    'vue/max-attributes-per-line': 'off',
    'vue/no-parsing-error': 'off',
    'vue/no-mutating-props': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/first-attribute-linebreak': 'off',
    'vue/html-indent': 'off',
    'vue/html-closing-bracket-newline': 'off',
    'vue/no-v-html': 'off',
    'vue/custom-event-name-casing': 'off'
  }
}
