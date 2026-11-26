import { styled } from '@twilio/flex-ui';

/**
 * Top-level flex column that fills the Flex view. Purposefully NOT
 * `overflow-y: auto` on the wrapper — the two Sections manage their own
 * scroll regions so we don't stack scrollbars. If the viewport is too small
 * for both sections' minimum content, the wrapper falls back to page-level
 * scroll.
 */
export const MassWorkerUpdateWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;
  height: 100%;
  padding: 1.5em;
  gap: 1.5em;
  box-sizing: border-box;
`;

export const SectionHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * One of the two main sections (Identify + Mutate). Takes an equal share of
 * the wrapper's remaining vertical space via `flex: 1 1 0` + `min-height: 0`.
 * Header/controls inside stay at their natural size; the child SectionContent
 * grows to fill the rest.
 */
export const Section = styled('div')<{ dimmed?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  gap: 0.5em;
  opacity: ${(props) => (props.dimmed ? 0.5 : 1)};
`;

/**
 * Scrollable content region inside a Section — hosts the worker preview
 * table or the skill mutation picker. Grows to fill whatever height the
 * section has after the fixed controls above and below it are laid out.
 * Horizontal overflow is also allowed so wide tables stay readable on
 * narrow viewports without forcing horizontal scroll on the whole page.
 */
export const SectionContent = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: auto;
`;
