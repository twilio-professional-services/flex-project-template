import { Language } from '../types/Language';
import esES from './es-es.json';
import esMX from './es-mx.json';
import ptBR from './pt-br.json';
import th from './th.json';
import zhHans from './zh-hans.json';

export default [
  {
    name: 'English',
    key: 'en-US',
    strings: {},
  },
  {
    name: 'Español (España)',
    key: 'es-ES',
    strings: esES,
  },
  {
    name: 'Español (México)',
    key: 'es-MX',
    strings: esMX,
  },
  {
    name: 'Português (Brasil)',
    key: 'pt-BR',
    strings: ptBR,
  },
  {
    name: 'แบบไทย',
    key: 'th',
    strings: th,
  },
  {
    name: '简体中文',
    key: 'zh-Hans',
    strings: zhHans,
  },
] as Language[];
