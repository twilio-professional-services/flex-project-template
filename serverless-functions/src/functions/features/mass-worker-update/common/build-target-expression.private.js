/**
 * Escapes characters that would break out of a double-quoted string inside a
 * TaskRouter targetWorkersExpression. Strips both `"` and `\`. Callers should
 * treat this as a defense-in-depth measure — even though the mass-worker-update
 * screen is admin-only, we never trust client-supplied expression fragments.
 * @param {string} value
 * @returns {string}
 */
const escapeQuotes = (value) => {
  return String(value).replace(/[\\"]/g, '');
};

/**
 * Builds a TaskRouter targetWorkersExpression from the mass-worker-update
 * filter selection. Single-select per category; combined with AND. At least
 * one of team/department/skill is required.
 * @param {object} selection
 * @param {string} [selection.team]
 * @param {string} [selection.department]
 * @param {string} [selection.skill]
 * @returns {string}
 */
exports.buildTargetExpression = ({ team, department, skill } = {}) => {
  const clauses = [];
  if (team) clauses.push(`team_name == "${escapeQuotes(team)}"`);
  if (department) clauses.push(`department_name == "${escapeQuotes(department)}"`);
  if (skill) clauses.push(`routing.skills HAS "${escapeQuotes(skill)}"`);
  if (clauses.length === 0) {
    throw new Error('At least one filter (team, department, or skill) is required.');
  }
  return clauses.join(' AND ');
};

exports.escapeQuotes = escapeQuotes;
