import Image from "next/image";
import { TextEffect } from "../ui/text-effect";

export default function AboutSection() {
    return (
        <section className="py-24 px-6 md:py-40 md:px-12 lg:px-24">
            {/* Title: Scaled down text for mobile (text-5xl), large for desktop (md:text-7xl) */}
            <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-left text-5xl md:text-7xl lg:mt-16 [font-family:var(--font-next-montserrat)] font-bold mb-10 md:mb-20 leading-tight"
            >
                What About It?
            </TextEffect>

            {/* Glass Card: Adjusted width and padding */}
            <div className="mx-auto w-full md:w-[90%] h-auto flex flex-col justify-center items-center overflow-hidden bg-slate-900/30 backdrop-blur-md border border-white/20 text-white rounded-xl px-6 py-8 md:py-10 text-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                <img
                    src="/logo.svg"
                    alt="Mfest Logo"
                    /* Adjusted logo height for responsiveness */
                    className="h-32 w-auto md:h-60 object-contain mb-6"
                />
                <span className="text-xl md:text-3xl font-bold italic tracking-wider text-center">
                    Transforming Visions. Into Motions
                </span>
            </div>

            {/* Main Content: Stacks vertically on mobile, horizontal on desktop */}
            <div className="flex flex-col md:flex-row w-full justify-between items-start md:pt-10 gap-10 md:gap-8">
                
                {/* Text Content */}
                <div className="w-full md:max-w-4xl flex-1 text-left order-2 md:order-1">
                    <h2 className="text-white text-3xl md:text-4xl font-bold mt-4 md:mt-10 [font-family:var(--font-next-montserrat)]">
                        Mechanical Festival
                    </h2>
                    <p className="mt-6 md:mt-10 text-base md:text-lg w-full md:w-4/5 leading-relaxed text-white [font-family:var(--font-next-montserrat)]">
                        Festival held by ITB's undergraduate mechanical
                        engineering students. M-Fest contains events and
                        competitions around engineering innovation by discussing
                        current problems and how to find the right solutions.
                    </p>
                </div>

                {/* HMM Logo Image */}
                {/* Centered on mobile, aligned right/top on desktop */}
                <div className="order-1 md:order-2 self-center md:self-start mt-10 md:mt-0">
                    <Image
                        src="/hmm.png"
                        alt="About Mechanical Festival"
                        width={150}
                        height={150}
                        className="rounded-lg object-contain w-32 md:w-[150px] h-auto md:pt-20"
                    />
                </div>
            </div>
        </section>
    );
}