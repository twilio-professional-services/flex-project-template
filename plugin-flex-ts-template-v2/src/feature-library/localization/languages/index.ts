import { Language } from '../types/Language';
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
    name: 'Español',
    key: 'es-MX',
    strings: esMX,
  },
  {
    name: 'Português',
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
