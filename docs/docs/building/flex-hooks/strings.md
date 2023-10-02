Use a string hook to register your own string definitions for use in your feature.

```ts
// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  MyString = 'MyString',
  MyString2 = 'MyString2',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.MyString]: 'Your string here',
    [StringTemplates.MyString2]: 'Your {{customString}} here',
  },
});
```

Note that this string hook specifies `en-US` for the string locale. All string hooks must include this locale, as it is the default. However, you may include additional locales to support multiple languages. For example, to support both `en-US` and `es-MX`:

```ts
export const stringHook = () => ({
  'en-US': {
    [StringTemplates.MyString]: 'Your string here',
    [StringTemplates.MyString2]: 'Your {{customString}} here',
  },
  'es-MX': {
    [StringTemplates.MyString]: 'Tu cadena aquí',
    [StringTemplates.MyString2]: 'Tu {{customString}} aquí',
  },
});
```

When working with string hooks, you may include template variables which can be substituted from within your code, such as in `MyString2` above. The variable may be substituted in one of two ways:

JS:
```js
import { templates } from '@twilio/flex-ui';

const myString = templates[StringTemplates.MyString2]({
  customString: 'apples',
})
```

JSX:
```js
import { Template, templates } from '@twilio/flex-ui';

<Template source={templates[StringTemplates.MyString2]} customString="apples" />
```

## System strings

If you wish to replace built-in Flex UI strings, rather than defining new strings for use within your feature, you may use a system string hook. This will override Flex UI strings that use the provided name.

```ts
export const systemStringHook = () => ({
  'es-MX': {
    "SetYourStatus": "Establece tu estado",
    "LogOut": "Cerrar sesión",
  },
});
```

Note that features using a system strings hook may interfere with each other if they are changing the same string. If your string is being overridden by another feature, use the flex-hooks console logging to identify the feature and remediate accordingly.