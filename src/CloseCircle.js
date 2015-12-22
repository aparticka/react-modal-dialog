import React, {PropTypes} from 'react';

// Done in SVG so we can avoid importing any CSS
const RECT_WIDTH = 1.5;
const MARGIN = 8;

const CloseCircle = (props) => {
  const {
    backgroundFill,
    diameter,
    xFill
  } = props;

  const radius = diameter / 2;

  return <svg width={diameter} height={diameter}>
    <circle cx={radius} cy={radius} r={radius} fill={backgroundFill}/>
    <g transform={`rotate(45 ${diameter / 2} ${diameter / 2})`}>
      <rect
        x={MARGIN}
        y={(diameter - RECT_WIDTH) / 2}
        width={diameter - (2 * MARGIN)}
        height={RECT_WIDTH}
        fill={xFill}
      />
      <rect
        y={MARGIN}
        x={(diameter - RECT_WIDTH) / 2}
        height={diameter - (2 * MARGIN)}
        width={RECT_WIDTH}
        fill={xFill}
      />
    </g>
  </svg>;
};

CloseCircle.propTypes = {
  backgroundFill: PropTypes.string.isRequired,
  diameter: PropTypes.number.isRequired,
  xFill: PropTypes.string.isRequired
};

export default CloseCircle;
