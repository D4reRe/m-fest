import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar({
  src,
  alt,
  className,
  classNameGoogleImage,
}: {
  src: string;
  alt: string;
  className?: string;
  classNameGoogleImage?: string;
}) {
  const isGoogleImage = src?.startsWith("https://lh3.googleusercontent.com/");
  return (
    <Avatar className={className}>
        <AvatarImage
          src={
            src ??   "https://api.iconify.design/healthicons/ui-user-profile-outline.svg?color=%23fff"
         
          alt={alt ?? "User's Image"}
          className="object-center"
        />
      <AvatarFallback className="bg-gradient-accent text-foreground font-bold">
        {(alt as string)
          ? (alt as string)
              .split(" ")
              .map((n) => n[0])
              .join("")
          : ""}
      </AvatarFallback>
    </Avatar>
  );
}
