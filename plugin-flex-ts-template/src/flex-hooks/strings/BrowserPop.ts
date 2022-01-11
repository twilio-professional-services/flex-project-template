// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
    ErrorLaunchingBrowserPop = 'PSBrowserPopErrorLaunchingBrowserPopNotification'
}

export default {
    [StringTemplates.ErrorLaunchingBrowserPop]: 'Failed to open a {{applicationName}} browser window.'
}