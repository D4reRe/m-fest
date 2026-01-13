// Define the "props" so TypeScript knows what data to expect
interface EventCardProps {
    title: string;
    imageSrc: string;
    Icon: string; // Allows both Lucide icons and standard SVG components
}

export default function EventCard({ title, imageSrc, Icon }: EventCardProps) {
  return (
    <div className="group grayscale w-40 md:w-48 rounded-2xl overflow-hidden shadow-xl/30 flex flex-col transition-transform hover:-translate-y-1 hover:grayscale-0">
      
      {/* Top Half: Image */}
      <div className="h-28 md:h-32 w-full overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500" 
        />
      </div>

      {/* Bottom Half: Dark Content Area */}
      <div className="h-24 bg-[#1E1B2E] p-4 relative text-white">
        
        {/* Title */}
        <h3 className="font-bold text-md leading-tight [font-family:var(--font-next-montserrat)]">
          {title}
        </h3>

        {/* Icon */}
        <div className="absolute bottom-3 right-3">
            <img
            src={Icon}
            alt="Event Icon"
            className="w-6 h-6 text-white"
            />
        </div>
      </div>
    </div>
  );
}