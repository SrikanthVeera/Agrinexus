// src/pages/Service.js
import React from "react";
import { useTranslation } from 'react-i18next';

const coreServices = [
  {
    title: "Market Integration",
    description:
      "Connecting farmers to local and national markets to improve access and profitability.",
  },
  {
    title: "Fair Price Discovery",
    description:
      "Get real-time crop pricing insights to make better selling decisions. Empowering fair trade.",
  },
  {
    title: "Logistics Solutions",
    description:
      "Efficient transport management and delivery tracking for agricultural products.",
  },
  {
    title: "Farmer Support Services",
    description:
      "24/7 assistance for farmers including crop advice, marketplace support, and more.",
  },
  {
    title: "Market Analytics",
    description:
      "Insights on market demand, pricing trends, and buyer preferences to help plan production.",
  },
  {
    title: "Quality Assurance",
    description:
      "Ensuring verified and inspected produce through smart quality grading systems.",
  },
];

const specializedServices = [
  {
    title: "Bulk Order Management",
    description:
      "Specialized handling of agricultural bulk business needs. Reliable and scalable solutions.",
  },
  {
    title: "Order Tracking System",
    description:
      "Explore the ability to track orders in real-time with status updates across transport stages.",
  },
];

const howWeWorkSteps = [
  {
    title: "Digital Onboarding",
    description:
      "As a new farmer, log in to the portal and register your farm & produce digitally.",
    image: "/images/onboarding.jpg",
  },
  {
    title: "Marketplace Access",
    description:
      "List your crops and products in the AgroTech marketplace and connect with potential buyers.",
    image: "/images/marketplace.jpg",
  },
  {
    title: "Logistics Coordination",
    description:
      "Our system matches you with available transport options and tracks deliveries seamlessly.",
    image: "/images/logistics.jpg",
  },
  {
    title: "Payment Processing",
    description:
      "Secure and easy payments with automated records and multiple payment methods supported.",
    image: "/images/payment.jpg",
  },
  {
    title: "Data-Driven Insights",
    description:
      "Monitor performance trends, pricing history, and buyer feedback to strategize for the future.",
    image: "/images/analytics.jpg",
  },
];

const Service = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <div className="bg-green-100 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          {t("Our Services")}
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          {t("From crop discovery to doorstep delivery, our platform offers a streamlined agri-marketing experience powered by tech-driven tools.")}
        </p>
      </div>

      {/* Core Services */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-green-700 mb-8">
          {t("Our Core Services")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreServices.map((service, idx) => (
            <div
              key={idx}
              className="border border-green-200 rounded-xl p-6 shadow hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold text-green-600 mb-2">
                {t(service.title)}
              </h3>
              <p className="text-gray-600">{t(service.description)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center text-green-700 mb-8">
            {t("Specialized Services")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specializedServices.map((service, idx) => (
              <div
                key={idx}
                className="bg-white border border-green-200 rounded-xl p-6 shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  {t(service.title)}
                </h3>
                <p className="text-gray-600">{t(service.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-green-700 mb-8">
          {t("How We Work")}
        </h2>
        <div className="space-y-8">
          {howWeWorkSteps.map((step, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow"
            >
              <div className="md:w-1/3">
                <img
                  src={step.image}
                  alt={t(step.title)}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  {t(step.title)}
                </h3>
                <p className="text-gray-600">{t(step.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Service;
