import { TextEffect } from "../ui/text-effect";

export default function AboutSection() {
    return (
    <section className="py-80 px-6 md:px-12 lg:px-24"> 
        <TextEffect
            preset="fade-in-blur"
            speedSegment={0.3}
            as="h1"
            className="text-left text-7xl lg:mt-16[font-family:var(--font-next-montserrat)] font-bold mb-20"
            >
            What About It?
        </TextEffect>

       <div className="mx-auto h-90 w-160 flex flex-col justify-center items-center overflow-hidden bg-slate-900/30 backdrop-blur-md border border-white/20 text-white rounded-xl px-6 py-6 text-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
            <img 
                src="/logo.svg" 
                alt="Mfest Logo" 
                className="size-100 object-contain" 
            />
            <span className="text-3xl font-bold italic tracking-wider text-center pb-10 pr-7">
                Transforming Visions. Into Motions
            </span>
        </div>

       <div className="flex w-full justify-center pt-10 gap-8">
    
    <div className="max-w-4xl flex-1 text-left">
        <h2 className="text-white text-4xl font-bold mt-10 [font-family:var(--font-next-montserrat)]">
            About Mechanical Festival
        </h2>
        <p className="mt-10 text-lg leading-relaxed text-white [font-family:var(--font-next-montserrat)]">
            Mechanical Festival is a celebration of innovation, creativity, and engineering excellence. 
            Our mission is to inspire and empower individuals to explore the fascinating world of mechanics through engaging events, competitions, and workshops. 
            Join us as we transform visions into motions and push the boundaries of what is possible!
        </p>
    </div>
    <img
        src="/hmm.png"
        alt="About Mechanical Festival"
        width={150} 
        height={150}
        className="mt-6 rounded-lg shadow-lg object-contain h-auto pt-20" 
    />
</div>
    </section>
    );
}