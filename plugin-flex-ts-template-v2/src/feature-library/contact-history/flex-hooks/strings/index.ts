// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ContactHistory = 'PSContactHistory',
  ClearHistory = 'PSClearHistory',
  ClearHistoryDialog= 'PSClearHistoryDialog',
  ContactChannel = 'PSContactChannel',
  ContactPhoneNumber = 'PSContactPhoneNumber',
  ContactName = 'PSContactName',
  ContactDateTime = 'PSContactDateTime',
  ContactDuration = 'PSContactDuration',
  ContactQueue = 'PSContactQueue',
  ContactOutcome = 'PSContactOutcome',
  ContactNotes = 'PSContactNotes',
}

export const stringHook = () => ({
  'en-US': {
    [StringTemplates.ContactHistory]: 'Contact History',
    [StringTemplates.ClearHistory]: 'Clear History',
    [StringTemplates.ClearHistoryDialog]: 'Please confirm that you want to delete all your contact history.',
    [StringTemplates.ContactChannel]: 'Channel',
    [StringTemplates.ContactPhoneNumber]: 'Phone Number',
    [StringTemplates.ContactName]: 'Name',
    [StringTemplates.ContactDateTime]: 'Date & Time',
    [StringTemplates.ContactDuration]: 'Duration',
    [StringTemplates.ContactQueue]: 'Queue',
    [StringTemplates.ContactOutcome]: 'Outcome',
    [StringTemplates.ContactNotes]: 'Notes',
  },
  'es-MX': {
    [StringTemplates.ContactHistory]: 'Historial de contactos',
    [StringTemplates.ClearHistory]: 'Borrar la historia',
    [StringTemplates.ClearHistoryDialog]: 'Confirme que desea eliminar todo su historial de contactos.',
    [StringTemplates.ContactChannel]: 'Canal',
    [StringTemplates.ContactPhoneNumber]: 'Número de teléfono',
    [StringTemplates.ContactName]: 'Nombre',
    [StringTemplates.ContactDateTime]: 'Fecha y Hora',
    [StringTemplates.ContactDuration]: 'Duración',
    [StringTemplates.ContactQueue]: 'Cola',
    [StringTemplates.ContactOutcome]: 'Resultado',
    [StringTemplates.ContactNotes]: 'Notas',
  },
});
