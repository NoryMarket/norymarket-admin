import { boot } from 'quasar/wrappers';
import { createGettext } from 'vue3-gettext';
import translations from '../language/translations.json';

const availableLanguages = {
  en: 'English',
  es: 'Español',
};

export const gettext = createGettext({
  availableLanguages,
  translations,
  defaultLanguage: 'en',
  sourceCodeLanguage: 'en',
});

export default boot(({ app }) => {
  app.use(gettext);

  const browserLang = navigator.language;

  for (const lang in availableLanguages) {
    if (browserLang.startsWith(lang)) {
      gettext.current = lang;
      break;
    }
  }
});
