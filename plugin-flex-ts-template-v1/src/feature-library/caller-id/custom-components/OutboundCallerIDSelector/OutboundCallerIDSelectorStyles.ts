import { default as styled } from "react-emotion";
import Select from "@material-ui/core/Select";

export const StyledSelect = styled(Select)`
  width: 252px;
`;

export const Caption = styled("label")`
  display: block;
  text-transform: uppercase;
  font-size: 10px;
  line-height: 1.6;
  letter-spacing: 2px;
  margin-top: 16px;
  margin-bottom: 8px;
  width: 100%;
`;