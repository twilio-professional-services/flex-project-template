// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  MultiCallBroken = 'PSMultiCallBroken',
}

export default {
  [StringTemplates.MultiCallBroken]: 'The multi-call feature will not work because it has not been configured correctly.',
};