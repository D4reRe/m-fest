import { FaMapMarked, FaMapMarkerAlt } from "react-icons/fa";
import { BlurFade } from "../ui/blur-fade";
import { FaRegEnvelope } from "react-icons/fa6";
import { IconPhone } from "@tabler/icons-react";

const ContactSection = () => {
    return (
        <section className=" py-16 sm:py-20" id="contact">
            <div className="pl-16 pb-14 pt-20">
                <h1 className="text-7xl font-extrabold ">
                    {`That's all we're afraid.`}
                </h1>
                <p className="text-3xl font-bold">
                    Wish to know more about us per chance?
                </p>
            </div>
            <BlurFade inView delay={0.5}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center pb-6">
                        <h2 className="text-9xl font-extrabold text-white sm:text-4xl">
                            Contact Us!
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className=" p-8 text-white">
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 bg-transparent p-3 rounded-full">
                                        <FaMapMarkerAlt className="w-20 h-20" />
                                    </div>
                                    <div className="max-w-72">
                                        <h4 className="text-lg font-semibold ">
                                            Our Address
                                        </h4>
                                        <p className="text-purple-100">
                                            Jl. Ganesa No.10, Lb. Siliwangi,
                                            Kecamatan Coblong, Kota Bandung,
                                            Jawa Barat 40132
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 bg-transparent p-3 rounded-full">
                                        <IconPhone className="w-20 h-20" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold pt-6">
                                            Phone
                                        </h4>
                                        <p className="text-purple-100">
                                            +62 85775132602 (Handaru)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 bg-transparent p-3 rounded-full">
                                        <FaRegEnvelope className="w-20 h-20" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold pt-6">
                                            Email
                                        </h4>
                                        <p className="text-purple-100">
                                            rahmathandaru.p@gmail.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <FaMapMarked className="w-20 h-20 inline" />
                            <div className="inline-flex max-w-3xs">
                                <h3 className="text-2xl font-medium text-primary mb-5 pb-3 px-5 max-w-xs ">
                                    Our Location on Google Maps
                                </h3>
                            </div>
                            <div className="rounded-lg shadow-lg overflow-hidden h-92 w-112">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0020064428986!2d107.60761627474339!3d-6.890361693108697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e65767c9b183%3A0x2478e3dcdce37961!2sInstitut%20Teknologi%20Bandung!5e0!3m2!1sen!2sid!4v1762297011770!5m2!1sen!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Our Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </BlurFade>
        </section>
    );
};

export default ContactSection;
