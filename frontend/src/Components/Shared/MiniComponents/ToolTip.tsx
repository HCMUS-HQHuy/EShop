type prop = {
  content?: string,
  top?: string,
  right?: string,
  bottom?: string,
  left?: string
};

const ToolTip = ({ content, top, right, bottom, left }: prop) => {
  return (
    <span
      role="tooltip"
      aria-hidden="true"
      data-is-tooltip="true"
      className="toolTip"
      style={{ top: top, right: right, bottom: bottom, left: left }}
    >
      {content}
    </span>
  );
};
export default ToolTip;
