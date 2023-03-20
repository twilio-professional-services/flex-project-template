// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  AGENT_ASSISTANCE = 'AgentAssistanceTriggered'
}

export const stringHook = () => ({
  [StringTemplates.AGENT_ASSISTANCE]: `{{agentFN}} is seeking assistance.`,
});