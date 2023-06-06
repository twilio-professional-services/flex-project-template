import { Language } from '../types/Language';
import csCZ from './cs-CZ.json';
import deDE from './de-DE.json';
import esMX from './es-MX.json';
import frCA from './fr-CA.json';
import itIT from './it-IT.json';
import jaJP from './ja-JP.json';
import koKR from './ko-KR.json';
import nlNL from './nl-NL.json';
import ptBR from './pt-BR.json';
import viVN from './vi-VN.json';
import zhCN from './zh-CN.json';
import zhTW from './zh-TW.json';

export default [
  {
    name: 'English',
    key: 'en-US',
  },
  {
    name: 'Spanish',
    key: 'es-MX',
    strings: esMX,
  },
  {
    name: 'Portuguese',
    key: 'pt-BR',
    strings: ptBR,
  },
  {
    name: 'French',
    key: 'fr-CA',
    strings: frCA,
  },
  {
    name: 'Italian',
    key: 'it-IT',
    strings: itIT,
  },
  {
    name: 'German',
    key: 'de-DE',
    strings: deDE,
  },
  {
    name: 'Dutch',
    key: 'nl-NL',
    strings: nlNL,
  },
  {
    name: 'Czech',
    key: 'cs-CZ',
    strings: csCZ,
  },
  {
    name: 'Japanese',
    key: 'ja-JP',
    strings: jaJP,
  },
  {
    name: 'Korean',
    key: 'ko-KR',
    strings: koKR,
  },
  {
    name: 'Chinese (Simplified)',
    key: 'zh-CN',
    strings: zhCN,
  },
  {
    name: 'Chinese (Traditional)',
    key: 'zh-TW',
    strings: zhTW,
  },
  {
    name: 'Vietnamese',
    key: 'vi-VN',
    strings: viVN,
  },
] as Language[];
