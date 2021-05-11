import constantsMixin from 'src/mixins/constants'
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ app }) => {
  app.mixin(constantsMixin)
}
