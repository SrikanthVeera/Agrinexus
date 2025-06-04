import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useTranslation } from 'react-i18next';

const agribusinessServices = [
  {
    title: "🌾 Product Knowledge",
    description:
      "Get detailed information about crops, livestock, fertilizers, pesticides, and farm machinery tailored to your needs.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgztd0QcUe5Fhmecut_EerzUd3Au2aJJSOLA&s",
  },
  {
    title: "🧑‍🔬 Technical Expertise",
    description:
      "Get expert advice on agricultural practices, irrigation, and pest management directly from professionals.",
    image:
      "data:image/jpeg;base64,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",
  },
  {
    title: "🛒 Order Processing",
    description:
      "Easily place orders for seeds, fertilizers, or equipment with real-time tracking and delivery coordination.",
    image: "https://img.icons8.com/color/60/000000/purchase-order.png",
  },
  {
    title: "🛠️ Problem Resolution",
    description:
      "Receive quick assistance with product quality, delivery issues, or crop-related challenges.",
    image: "https://img.icons8.com/color/60/000000/customer-support.png",
  },
  {
    title: "🔧 After-sales Support",
    description:
      "Support after purchase, including crop guidance, disease control, and equipment maintenance tips.",
    image: "https://img.icons8.com/color/60/000000/maintenance.png",
  },
  {
    title: "📞 Communication Channels",
    description:
      "Reach out via phone, email, or chat. Self-service is available through our mobile app anytime.",
    image: "https://img.icons8.com/color/60/000000/chat.png",
  },
  {
    title: "🤝 Relationship Building",
    description:
      "We understand your unique farming needs and build long-term trust with personalized support.",
    image: "https://img.icons8.com/color/60/000000/handshake.png",
  },
  {
    title: "📚 Training & Education",
    description:
      "Stay updated with new trends, tools, and practices in agriculture through regular training.",
    image: "",
  },
];

const tamilNaduDistricts = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Trichy",
  "Salem",
  "Erode",
  "Tirunelveli",
  "Thanjavur",
  "Kanyakumari",
];

const CustomerDetails = () => {
  const { t } = useTranslation();
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    phone: "",
    email: "",
    category: "",
    district: "",
  });

  const handleChange = (e) => {
    setBuyerForm({ ...buyerForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Buyer Registered:", buyerForm);
    alert("Buyer Registered Successfully!");
    setShowModal(false);
  };

  const translatedServices = agribusinessServices.map(service => ({
    ...service,
    title: t(service.title),
    description: t(service.description)
  }));

  return (
    <div className="bg-white min-h-screen px-4 sm:px-8 py-10">
      {/* Customer Form */}
      <div className="max-w-4xl mx-auto shadow-lg rounded-lg p-8 bg-gradient-to-br from-green-50 via-white to-green-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
          Customer Information
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md shadow-sm"
              placeholder="Village / District / State"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-all duration-300">
            Save Details
          </button>
        </div>
      </div>

      {/* Agribusiness Services */}
      <div className="max-w-6xl mx-auto mt-14">
        <h2
          className="text-3xl font-bold text-center text-green-700 mb-8"
          data-aos="fade-up"
        >
          Agribusiness Customer Services
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {translatedServices.map((service, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white rounded-lg p-6 border border-green-100 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <img src={service.image} alt="" className="w-12 h-12" />
                <h3 className="text-xl font-semibold text-green-700">
                  {service.title}
                </h3>
              </div>
              <p className="mt-2 text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join Buyer CTA */}
      <div className="bg-green-700 mt-20 rounded-lg text-white py-10 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between shadow-xl">
        {/* Left */}
        <div className="flex items-center mb-8 md:mb-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSyqMB2-3DXj_cU8uV6P_owocvjMd2iNGlfA&s"
            alt="buyer-icon"
            className="w-50 h-100 mr-10"
          />
          <span className="text-lg font-medium"></span>
        </div>

        {/* Right */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">{t("Join Our Buyer Community")}</h3>
          <p className="mb-4">
            {t("Are you a buyer looking for fresh produce or bulk orders? Register today to explore a wide network of farmers and agri-products.")}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-green-700 font-semibold px-5 py-2 rounded-xl hover:bg-green-100 transition-all flex items-center gap-2 mx-auto md:mx-0"
          >
            <img src="/image/customer1.jpeg" alt="icon" className="w-5 h-5" />
            {t("Join Now")}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              {t("Register as Buyer")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={buyerForm.name}
                onChange={handleChange}
                placeholder={t("Full Name")}
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="phone"
                value={buyerForm.phone}
                onChange={handleChange}
                placeholder={t("Phone Number")}
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="email"
                type="email"
                value={buyerForm.email}
                onChange={handleChange}
                placeholder={t("Email Address")}
                className="w-full p-2 border rounded"
                required
              />
              <select
                name="category"
                value={buyerForm.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">{t("Select Buyer Category")}</option>
                <option value="Wholesaler">{t("Wholesaler")}</option>
                <option value="Retailer">{t("Retailer")}</option>
                <option value="Distributor">{t("Distributor")}</option>
              </select>
              <select
                name="district"
                value={buyerForm.district}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">{t("Select Tamil Nadu District")}</option>
                {tamilNaduDistricts.map((dist, i) => (
                  <option key={i} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {t("Register")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
