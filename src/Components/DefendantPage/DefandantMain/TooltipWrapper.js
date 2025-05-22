import React, { useState, useRef, useEffect } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';

const TooltipWrapper = ({ children, text }) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    if (targetRef.current) {
      const isOverflowing = targetRef.current.offsetWidth < targetRef.current.scrollWidth;
      setIsOverflowed(isOverflowing);
    }
  }, [text]);

  return (
    <>
      <div
        ref={targetRef}
        className="inline-row-h-21"
        onMouseEnter={() => isOverflowed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </div>
      <Overlay target={targetRef.current} show={showTooltip} placement="top">
        {(props) => (
          <Tooltip id="overlay-example" {...props}>
            {text}
          </Tooltip>
        )}
      </Overlay>
    </>
  );
};

export default TooltipWrapper;
