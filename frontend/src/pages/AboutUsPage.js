import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-agri-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-agri-dark to-agri-primary opacity-90 z-0"></div>
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://th.bing.com/th/id/OIP.Ky8B3KmpYAlBMJQ4B-pzQgHaFD?rs=1&pid=ImgDetMain)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('About AgriConnect')}
            </h1>
            <p className="text-xl mb-8">
              {t('Enhancing agricultural supply chains through digital platforms for real-time market integration and fair pricing')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-agri-dark">
                {t('Our Mission')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t("AgriConnect's mission is to revolutionize the agricultural supply chain by creating a transparent, efficient, and fair digital marketplace that connects farmers directly with buyers and logistics partners.")}
              </p>
              <p className="text-gray-700 mb-6">
                {t("We aim to eliminate exploitative middlemen, reduce waste, and ensure farmers receive fair compensation for their produce while providing consumers with access to fresh, high-quality agricultural products.")}
              </p>
              <div className="flex items-center text-agri-primary font-medium">
                <span>{t('Learn about our impact')}</span>
                <ArrowRight size={16} className="ml-2" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-80 rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80"
                alt="Farmer in field"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-agri-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-agri-dark">
              {t('Our Core Values')}
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t('These principles guide every aspect of our platform and business decisions')}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {['Transparency', 'Fairness', 'Sustainability'].map((value, idx) => (
              <motion.div
                key={value}
                variants={fadeIn}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold mb-3 text-agri-primary">
                  {t(value)}
                </h3>
                <p className="text-gray-700">
                  {t(`${value} Desc`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-agri-dark">
                {t('Our Story')}
              </h2>
            </motion.div>

            <div className="space-y-12">
              {[
                {
                  year: "2021",
                  title: t("Identifying the Problem"),
                  desc: t("AgriConnect was born out of a deep concern for the challenges faced by farmers in Tamil Nadu..."),
                },
                {
                  year: "2022",
                  title: t("Technology Meets Agriculture"),
                  desc: t("After months of research and development, we launched our digital platform..."),
                },
                {
                  year: "2023",
                  title: t("Growing Impact"),
                  desc: t("Building on our early success, we expanded to cover all districts in Tamil Nadu..."),
                },
              ].map(({ year, title, desc }) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-6"
                >
                  <div className="md:w-1/3">
                    <div className="bg-agri-primary text-white text-center rounded-lg p-4">
                      <h3 className="font-bold">{year}</h3>
                      <p>
                        {title === t("Identifying the Problem")
                          ? t("The Beginning")
                          : title}
                      </p>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h4 className="text-xl font-semibold mb-2 text-agri-dark">
                      {title}
                    </h4>
                    <p className="text-gray-700">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-agri-dark">
              {t('Our Leadership Team')}
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {t('Meet the passionate people driving our mission to transform agricultural supply chains')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                role: t("Founder & CEO"),
                img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
              },
              {
                name: "Priya Venkatesh",
                role: t("Chief Technology Officer"),
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
              },
              {
                name: "Arjun Reddy",
                role: t("Chief Operations Officer"),
                img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80",
              },
              {
                name: "Lakshmi Narayan",
                role: t("Chief Financial Officer"),
                img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80",
              },
            ].map(({ name, role, img }) => (
              <div key={name} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <img src={img} alt={name} className="w-24 h-24 rounded-full mb-3 border-4 border-green-300 shadow-lg" />
                <h3 className="text-lg font-semibold text-gray-800 mt-2">{name}</h3>
                <p className="text-green-700 font-medium">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
