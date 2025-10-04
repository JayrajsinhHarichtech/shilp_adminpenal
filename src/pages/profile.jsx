import React, { useState, useContext } from "react";
import Avtar from "../../public/Logo/shilp-logo.svg";
import Camera from "../../public/Logo/Camera.png";
import Edit from "../../public/Logo/Edit.svg";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [previewImage, setPreviewImage] = useState(user?.avatar || Avtar);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      setFormData({ ...formData, avatar: file });
    }
  };

  const saveChanges = async () => {
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      const res = await fetch(`http://localhost:5000/api/profile`, {
        method: "POST",
        body: form,
      });

      const updated = await res.json();
      setUser(updated);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto relative">
        <div>
          {!isEditing ? (
            <h1 className="text-4xl mb-6 text-black">My Profile</h1>
          ) : (
            <h2 className="text-2xl font-semibold mb-6 text-black">
              Edit Profile
            </h2>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-6 right-6 bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              Edit Profile
              <img src={Edit} alt="Edit" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="bg-white shadow-md p-6 flex items-center justify-between mb-5">
          <div className="flex items-center gap-6 pb-6">
            <div className="relative">
              <img
                src={
                  previewImage.startsWith("blob")
                    ? previewImage
                    : `http://localhost:5000${previewImage}`
                }
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover"
              />

              {/* Hidden file input */}
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Edit button */}
              {isEditing && (
                <label
                  htmlFor="fileUpload"
                  className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer"
                >
                  <img src={Camera} alt="Camera" className="w-5 h-5" />
                </label>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-sm text-gray-600">
                {formData.city}, {formData.state}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="mt-6 bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Personal Information
          </h3>

          {!isEditing ? (
            <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
              {Object.keys(formData).map(
                (key) =>
                  key !== "avatar" && (
                    <div key={key}>
                      <p className="text-gray-500">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      <p className="font-semibold text-black">
                        {formData[key]}
                      </p>
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg p-2 text-black"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg p-2 text-black"
              />
              <input
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg p-2 text-black"
              />
              <input
                name="mobile"
                placeholder="Mobile No."
                value={formData.mobile}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg p-2 text-black"
              />
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg p-2 text-black"
              >
                <option value="">--Select State--</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg p-2 text-black"
              >
                <option value="">--Select City--</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Mumbai">Mumbai</option>
              </select>
              <input
                name="pincode"
                placeholder="Enter Pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg p-2 text-black"
              />
              <input
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                className="border border-gray-400 rounded-lg p-2 text-black"
              />
            </div>
          )}

          {isEditing && (
            <div className="flex justify-center mt-10">
              <button
                onClick={saveChanges}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
