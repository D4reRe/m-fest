interface SponsorItemProps {
  icon: string;
  iconName: string;
  alt: string;
  height: number;
  invert?: boolean;
}

function SponsorItem({
  icon,
  iconName,
  alt,
  height,
  invert,
}: SponsorItemProps) {
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

export default SponsorItem;
