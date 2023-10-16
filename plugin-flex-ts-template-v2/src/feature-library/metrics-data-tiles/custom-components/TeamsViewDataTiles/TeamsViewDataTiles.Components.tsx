import { styled } from '@twilio/flex-ui';

export interface ThemeOnlyProps {
  theme?: any;
}

export const TeamsViewTilesContainer = styled('div')<ThemeOnlyProps>`
  max-height: 220px;
  display: flex;
  width: 100%;
  margin-top: ${({ theme }) => theme.tokens.spacings.space40};
  margin-left: auto;
  margin-right: auto;
  margin-bottom: ${({ theme }) => theme.tokens.spacings.space0};
  height: auto;
  box-sizing: border-box;
  flex: 0 0 auto;
  > * {
    flex: 1 1 25%;
  }
  > * + * {
    margin-left: ${({ theme }) => theme.tokens.spacings.space50};
  }
  ${(props) => props.theme.QueuesStats.TilesGrid}
`;
