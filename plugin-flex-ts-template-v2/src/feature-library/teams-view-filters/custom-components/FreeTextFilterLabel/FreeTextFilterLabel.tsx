export type OwnProps = {
  currentValue?: string;
}

export const FreeTextFilterLabel = (props: OwnProps) => (
  <>{props.currentValue && props.currentValue.length ? `Containing "${props.currentValue}"` : 'Any'}</>
);

export default FreeTextFilterLabel;