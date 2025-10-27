module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'et'],
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}