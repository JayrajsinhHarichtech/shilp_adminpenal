import React, { useState } from "react";

const AboutUsAdmin = () => {
  const [about, setAbout] = useState({
    whoWeAre:
      "Shilp Group is a leading real estate and construction company based in Ahmedabad, Gujarat. With a legacy of delivering premium residential and commercial properties, we are committed to providing world-class living and working spaces to our clients.",
    vision:
      "To be the most trusted and innovative real estate company, delivering exceptional value to our clients and stakeholders.",
    mission:
      "To create sustainable and high-quality developments that enhance the communities we serve, while maintaining the highest standards of integrity and professionalism.",
    values: [
      "Integrity and Transparency",
      "Commitment to Quality",
      "Customer-Centric Approach",
      "Innovation and Excellence",
      "Sustainability and Responsibility",
    ],
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false); 
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setAbout({ ...about, [field]: value });
  };

  const handleValueChange = (index, value) => {
    const updated = [...about.values];
    updated[index] = value;
    setAbout({ ...about, values: updated });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const formData = new FormData();
      formData.append("whoWeAre", about.whoWeAre);
      formData.append("vision", about.vision);
      formData.append("mission", about.mission);
      formData.append("values", JSON.stringify(about.values));
      if (image) formData.append("image", image);

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/aboutus", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("About Us saved successfully!");
        setIsError(false);
      } else {
        setMessage(data.message || "Failed to save About Us.");
        setIsError(true);
      }

      setTimeout(() => setMessage(""), 5000);

    } catch (err) {
      console.error(err);
      setMessage("Error saving About Us.");
      setIsError(true);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Manage About Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Text */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Who We Are
            </label>
            <textarea
              value={about.whoWeAre}
              onChange={(e) => handleInputChange("whoWeAre", e.target.value)}
              className="w-full border rounded-lg p-2 text-gray-700"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Vision
            </label>
            <textarea
              value={about.vision}
              onChange={(e) => handleInputChange("vision", e.target.value)}
              className="w-full border rounded-lg p-2 text-gray-700"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Mission
            </label>
            <textarea
              value={about.mission}
              onChange={(e) => handleInputChange("mission", e.target.value)}
              className="w-full border rounded-lg p-2 text-gray-700"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Core Values
            </label>
            {about.values.map((val, index) => (
              <input
                key={index}
                type="text"
                value={val}
                onChange={(e) => handleValueChange(index, e.target.value)}
                className="w-full border rounded-lg p-2 text-gray-700 mt-1"
              />
            ))}
          </div>
        </div>

        {/* Right Side - Image Upload */}
        <div className="flex flex-col items-center justify-center border rounded-lg p-4 bg-gray-50">
          {preview ? (
            <img
              src={preview}
              alt="About Us"
              className="w-full max-h-80 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="text-gray-500 italic mb-4">
              No image uploaded yet
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>

      <div className="flex flex-col items-start md:items-end space-y-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        {message && (
          <p className={`text-sm font-medium ${isError ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AboutUsAdmin;
