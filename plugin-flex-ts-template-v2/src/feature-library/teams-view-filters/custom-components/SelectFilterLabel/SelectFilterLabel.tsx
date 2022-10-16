export type OwnProps = {
  currentValue?: string[];
}

export const MultiSelectFilterLabel = (props: OwnProps) => {
  let label = 'Any';
  if (props.currentValue && props.currentValue.length === 1) {
    label = `${props.currentValue[0]} only`;
  }
  if (props.currentValue && props.currentValue.length > 1) {
    label = `${props.currentValue.length} selected`;
  }
  return (<>{label}</>);
};

export default MultiSelectFilterLabel;