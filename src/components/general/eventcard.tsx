import Link from "next/link";

// Define the "props" so TypeScript knows what data to expect
interface EventCardProps {
    title: string;
    imageSrc: string;
    Icon: string; // Allows both Lucide icons and standard SVG components
    href: string;
}

export default function EventCard({ title, imageSrc, Icon, href }: EventCardProps) {
  return (
   <Link 
      href={href}
      className="group block w-40 md:w-48 rounded-2xl overflow-hidden shadow-lg bg-white transition-transform md:grayscale hover:grayscale-0 hover:-translate-y-1"
    >
      <div className="flex flex-col h-full"> {/* Inner wrapper to maintain flex layout */}
        
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
            <h3 className="font-bold text-md leading-tight [font-family:var(--font-next-montserrat)]">
            {title}
            </h3>
            <div className="absolute bottom-3 right-3">
                <img src={Icon} alt={`${title} icon`} className="w-6 h-6 md:w-8 md:h-8"/>
            </div>
        </div>

      </div>
    </Link>
  );
}