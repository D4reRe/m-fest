interface TimelineItemProps {
  icon: string;
  iconName: string;
  alt: string;
  height: number;
  invert?: boolean;
}

function TimelineItem({
  icon,
  iconName,
  alt,
  height,
  invert,
}: TimelineItemProps) {
  return (
    <div className="flex">
      <img
        className={`mx-auto w-fit h-${height} mb-12 ${invert ? "invert" : ""}`}
        src={`https://api.iconify.design/${icon}/${iconName}.svg?color=%23fff`}
        alt={alt}
        width="auto"
      />
    </div>
  );
}

export default TimelineItem;
