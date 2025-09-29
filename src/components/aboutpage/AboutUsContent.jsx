import React from "react";

const AboutUsContent = () => {
  return (
    <section className="bg-white rounded shadow p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">About Us</h2>

      <div className="space-y-4 text-gray-700">
        <p>
          Shilp Group is a leading real estate and construction company based in Ahmedabad, Gujarat. With a legacy of delivering premium residential and commercial properties, we are committed to providing world-class living and working spaces to our clients.
        </p>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Our Vision</h3>
          <p>
            To be the most trusted and innovative real estate company, delivering exceptional value to our clients and stakeholders.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Our Mission</h3>
          <p>
            To create sustainable and high-quality developments that enhance the communities we serve, while maintaining the highest standards of integrity and professionalism.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-800">Core Values</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Integrity and Transparency</li>
            <li>Commitment to Quality</li>
            <li>Customer-Centric Approach</li>
            <li>Innovation and Excellence</li>
            <li>Sustainability and Responsibility</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutUsContent;
