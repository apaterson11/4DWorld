import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";

const override = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 93vh;
`;

// defines a spinner loading icon for displaying during data loading process
function Spinner() {
    return <BeatLoader loading={true} css={override} size='10vh' color='#90caf9' />
}

export default Spinner