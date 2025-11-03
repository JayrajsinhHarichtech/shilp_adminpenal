  "use client";
  import React, { useEffect, useState } from "react";
  import { fetchHomepageData, updateHomepageData, getFullImageUrl } from "../../api/homepageApi.jsx";

  export default function HomeEditor() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [banners, setBanners] = useState([
      {
        aboutText: "",
        image: [], // allow multiple desktop images
        preview: [],
        mobileImage: [], // allow multiple mobile images
        mobilePreview: [],
        imageUrl: [],
        mobileUrl: [],
      },
    ]);
    const [services, setServices] = useState([{ title: "", description: "", icon: "" }]);
    const [testimonials, setTestimonials] = useState([{ name: "", text: "", image: null, preview: null }]);
    
    // New banner types
    const [commercialBanner, setCommercialBanner] = useState({
      images: [],
      previews: [],
      imageUrls: [],
      mobileImages: [],
      mobilePreviews: [],
      mobileImageUrls: [],
      hasNewFiles: false,
      hasNewMobileFiles: false
    });
    const [plotBanner, setPlotBanner] = useState({
      images: [],
      previews: [],
      imageUrls: [],
      mobileImages: [],
      mobilePreviews: [],
      mobileImageUrls: [],
      hasNewFiles: false,
      hasNewMobileFiles: false
    });
    const [residentialBanner, setResidentialBanner] = useState({
      images: [],
      previews: [],
      imageUrls: [],
      mobileImages: [],
      mobilePreviews: [],
      mobileImageUrls: [],
      hasNewFiles: false,
      hasNewMobileFiles: false
    });
    const [aboutusBanner, setAboutusBanner] = useState({
      images: [],
      previews: [],
      imageUrls: [],
      mobileImages: [],
      mobilePreviews: [],
      mobileImageUrls: [],
      hasNewFiles: false,
      hasNewMobileFiles: false
    });
    const [careerBanner, setCareerBanner] = useState({
      images: [],
      previews: [],
      imageUrls: [],
      mobileImages: [],
      mobilePreviews: [],
      mobileImageUrls: [],
      hasNewFiles: false,
      hasNewMobileFiles: false
    });

    useEffect(() => {
      fetchHomepageData()
        .then((data) => {
          if (data.banners) {
              setBanners(
                data.banners.map((b) => ({
                  aboutText: b.aboutText || "",
                  image: [],
                  preview: b.imageUrl && Array.isArray(b.imageUrl) ? b.imageUrl.map((u) => getFullImageUrl(u)) : b.imageUrl ? [getFullImageUrl(b.imageUrl)] : [],
                  mobileImage: [],
                  mobilePreview: b.mobileUrl && Array.isArray(b.mobileUrl) ? b.mobileUrl.map((u) => getFullImageUrl(u)) : b.mobileUrl ? [getFullImageUrl(b.mobileUrl)] : [],
                  imageUrl: b.imageUrl || [],
                  mobileUrl: b.mobileUrl || [],
                }))
              );
            }
          
          // Load commercial banner
          if (data.banners && data.banners[0]) {
            const banner = data.banners[0];
            setCommercialBanner({
              images: [],
              previews: Array.isArray(banner.commercialBanner) ? banner.commercialBanner.map(url => getFullImageUrl(url)) : [],
              imageUrls: banner.commercialBanner || [],
              mobileImages: [],
              mobilePreviews: Array.isArray(banner.commercialMobileBanner) ? banner.commercialMobileBanner.map(url => getFullImageUrl(url)) : [],
              mobileImageUrls: banner.commercialMobileBanner || [],
              hasNewFiles: false,
              hasNewMobileFiles: false
            });
          
            // Load plot banner
            setPlotBanner({
              images: [],
              previews: Array.isArray(banner.plotBanner) ? banner.plotBanner.map(url => getFullImageUrl(url)) : [],
              imageUrls: banner.plotBanner || [],
              mobileImages: [],
              mobilePreviews: Array.isArray(banner.plotMobileBanner) ? banner.plotMobileBanner.map(url => getFullImageUrl(url)) : [],
              mobileImageUrls: banner.plotMobileBanner || [],
              hasNewFiles: false,
              hasNewMobileFiles: false
            });
          
            // Load residential banner
            setResidentialBanner({
              images: [],
              previews: Array.isArray(banner.residentialBanner) ? banner.residentialBanner.map(url => getFullImageUrl(url)) : [],
              imageUrls: banner.residentialBanner || [],
              mobileImages: [],
              mobilePreviews: Array.isArray(banner.residentialMobileBanner) ? banner.residentialMobileBanner.map(url => getFullImageUrl(url)) : [],
              mobileImageUrls: banner.residentialMobileBanner || [],
              hasNewFiles: false,
              hasNewMobileFiles: false
            });
          
            // Load aboutus banner
            setAboutusBanner({
              images: [],
              previews: Array.isArray(banner.aboutusBanner) ? banner.aboutusBanner.map(url => getFullImageUrl(url)) : [],
              imageUrls: banner.aboutusBanner || [],
              mobileImages: [],
              mobilePreviews: Array.isArray(banner.aboutusMobileBanner) ? banner.aboutusMobileBanner.map(url => getFullImageUrl(url)) : [],
              mobileImageUrls: banner.aboutusMobileBanner || [],
              hasNewFiles: false,
              hasNewMobileFiles: false
            });
          
            // Load career banner
            setCareerBanner({
              images: [],
              previews: Array.isArray(banner.careerBanner) ? banner.careerBanner.map(url => getFullImageUrl(url)) : [],
              imageUrls: banner.careerBanner || [],
              mobileImages: [],
              mobilePreviews: Array.isArray(banner.careerMobileBanner) ? banner.careerMobileBanner.map(url => getFullImageUrl(url)) : [],
              mobileImageUrls: banner.careerMobileBanner || [],
              hasNewFiles: false,
              hasNewMobileFiles: false
            });
          }
          
          if (data.services) setServices(data.services);
          if (data.testimonials) {
            setTestimonials(
              data.testimonials.map((t) => ({
                name: t.name || "",
                text: t.text || "",
                image: null,
                preview: t.imageUrl ? getFullImageUrl(t.imageUrl) : null,
                imageUrl: t.imageUrl || "",
              }))
            );
          }
        })
        .catch((err) => console.error(err));
    }, []);

    const handleChange = (list, setList, idx, key, value) => {
      const updated = [...list];
      updated[idx][key] = value;
      setList(updated);
    };

    // single-file handler (kept for other lists like testimonials)
    const handleFileChange = (list, setList, idx, key, previewKey) => (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const updated = [...list];
        updated[idx][key] = file;
        updated[idx][previewKey] = URL.createObjectURL(file);
        setList(updated);
      }
    };

    // multiple-file handler for banners (desktop/mobile)
    const handleFileChangeMultiple = (list, setList, idx, key, previewKey) => (e) => {
      if (e.target.files && e.target.files.length) {
        const files = Array.from(e.target.files);
        const updated = [...list];
        // store File[] and preview URLs array
        updated[idx][key] = files;
        updated[idx][previewKey] = files.map((f) => URL.createObjectURL(f));
        setList(updated);
      }
    };

    // handler for new banner types (commercial, plot, residential)
    const handleBannerFileChange = (setBannerState) => (e) => {
      if (e.target.files && e.target.files.length) {
        const files = Array.from(e.target.files);
        const previews = files.map((f) => URL.createObjectURL(f));
        setBannerState(prev => ({
          ...prev,
          images: files,
          // Keep existing previews from saved images + add new previews
          previews: [...(prev.imageUrls ? prev.imageUrls.map(url => getFullImageUrl(url)) : []), ...previews],
          hasNewFiles: true // Flag to indicate new files added
        }));
      }
    };

    // handler for mobile banner types
    const handleMobileBannerFileChange = (setBannerState) => (e) => {
      if (e.target.files && e.target.files.length) {
        const files = Array.from(e.target.files);
        const previews = files.map((f) => URL.createObjectURL(f));
        setBannerState(prev => ({
          ...prev,
          mobileImages: files,
          // Keep existing mobile previews from saved images + add new previews
          mobilePreviews: [...(prev.mobileImageUrls ? prev.mobileImageUrls.map(url => getFullImageUrl(url)) : []), ...previews],
          hasNewMobileFiles: true // Flag to indicate new mobile files added
        }));
      }
    };

    // Function to remove specific image from preview
    const removeImage = (setBannerState, index, isMobile = false) => {
      setBannerState(prev => {
        if (isMobile) {
          const newPreviews = [...prev.mobilePreviews];
          const newUrls = [...prev.mobileImageUrls];
          
          // Remove from appropriate array
          if (index < newUrls.length) {
            // Removing from existing URLs
            newUrls.splice(index, 1);
          } else {
            // Removing from new previews
            newPreviews.splice(index, 1);
          }
          
          return {
            ...prev,
            mobilePreviews: newPreviews,
            mobileImageUrls: newUrls
          };
        } else {
          const newPreviews = [...prev.previews];
          const newUrls = [...prev.imageUrls];
          
          // Remove from appropriate array
          if (index < newUrls.length) {
            // Removing from existing URLs
            newUrls.splice(index, 1);
          } else {
            // Removing from new previews
            newPreviews.splice(index, 1);
          }
          
          return {
            ...prev,
            previews: newPreviews,
            imageUrls: newUrls
          };
        }
      });
    };

    const handleDelete = (list, setList, idx) => {
      const updated = [...list];
      updated.splice(idx, 1);
      setList(updated);
    };

    const handleAdd = (list, setList, newItem) => {
      setList([...list, newItem]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");

      try {
        const formData = new FormData();

        // Prepare banners JSON with arrays for imageUrl/mobileUrl
        formData.append(
          "banners",
          JSON.stringify(
            banners.map((b) => ({
              aboutText: b.aboutText,
              imageUrl: Array.isArray(b.imageUrl) ? b.imageUrl : b.imageUrl ? [b.imageUrl] : [],
              mobileUrl: Array.isArray(b.mobileUrl) ? b.mobileUrl : b.mobileUrl ? [b.mobileUrl] : [],
            }))
          )
        );

        // Append multiple banner files per banner index (desktop)
        banners.forEach((b, idx) => {
          if (Array.isArray(b.image) && b.image.length) {
            b.image.forEach((file) => {
              formData.append(`banners[${idx}][bannerImages]`, file);
            });
          } else if (b.image) {
            // fallback single file
            formData.append(`banners[${idx}][bannerImages]`, b.image);
          }

          // Append multiple mobile images per banner index
          if (Array.isArray(b.mobileImage) && b.mobileImage.length) {
            b.mobileImage.forEach((file) => {
              formData.append(`banners[${idx}][mobileImages]`, file);
            });
          } else if (b.mobileImage) {
            formData.append(`banners[${idx}][mobileImages]`, b.mobileImage);
          }
        });

        formData.append("services", JSON.stringify(services));

        // Add new banner types to FormData - only append current URLs (not empty arrays)
        formData.append("commercialBanner", JSON.stringify(commercialBanner.imageUrls || []));
        formData.append("commercialMobileBanner", JSON.stringify(commercialBanner.mobileImageUrls || []));
        formData.append("plotBanner", JSON.stringify(plotBanner.imageUrls || []));
        formData.append("plotMobileBanner", JSON.stringify(plotBanner.mobileImageUrls || []));
        formData.append("residentialBanner", JSON.stringify(residentialBanner.imageUrls || []));
        formData.append("residentialMobileBanner", JSON.stringify(residentialBanner.mobileImageUrls || []));
        formData.append("aboutusBanner", JSON.stringify(aboutusBanner.imageUrls || []));
        formData.append("aboutusMobileBanner", JSON.stringify(aboutusBanner.mobileImageUrls || []));
        formData.append("careerBanner", JSON.stringify(careerBanner.imageUrls || []));
        formData.append("careerMobileBanner", JSON.stringify(careerBanner.mobileImageUrls || []));

        // Append commercial banner files
        if (commercialBanner.images && commercialBanner.images.length) {
          commercialBanner.images.forEach((file) => {
            formData.append('commercialBannerImages', file);
          });
        }

        // Append commercial mobile banner files
        if (commercialBanner.mobileImages && commercialBanner.mobileImages.length) {
          commercialBanner.mobileImages.forEach((file) => {
            formData.append('commercialMobileBannerImages', file);
          });
        }

        // Append plot banner files
        if (plotBanner.images && plotBanner.images.length) {
          plotBanner.images.forEach((file) => {
            formData.append('plotBannerImages', file);
          });
        }

        // Append plot mobile banner files
        if (plotBanner.mobileImages && plotBanner.mobileImages.length) {
          plotBanner.mobileImages.forEach((file) => {
            formData.append('plotMobileBannerImages', file);
          });
        }

        // Append residential banner files
        if (residentialBanner.images && residentialBanner.images.length) {
          residentialBanner.images.forEach((file) => {
            formData.append('residentialBannerImages', file);
          });
        }

        // Append residential mobile banner files
        if (residentialBanner.mobileImages && residentialBanner.mobileImages.length) {
          residentialBanner.mobileImages.forEach((file) => {
            formData.append('residentialMobileBannerImages', file);
          });
        }

        // Append aboutus banner files
        if (aboutusBanner.images && aboutusBanner.images.length) {
          aboutusBanner.images.forEach((file) => {
            formData.append('aboutusBannerImages', file);
          });
        }

        // Append aboutus mobile banner files
        if (aboutusBanner.mobileImages && aboutusBanner.mobileImages.length) {
          aboutusBanner.mobileImages.forEach((file) => {
            formData.append('aboutusMobileBannerImages', file);
          });
        }

        // Append career banner files
        if (careerBanner.images && careerBanner.images.length) {
          careerBanner.images.forEach((file) => {
            formData.append('careerBannerImages', file);
          });
        }

        // Append career mobile banner files
        if (careerBanner.mobileImages && careerBanner.mobileImages.length) {
          careerBanner.mobileImages.forEach((file) => {
            formData.append('careerMobileBannerImages', file);
          });
        }

        formData.append(
          "testimonials",
          JSON.stringify(testimonials.map((t) => ({ name: t.name, text: t.text, imageUrl: t.imageUrl || "" })))
        );
        testimonials.forEach((t, idx) => {
          if (t.image) formData.append(`testimonials[${idx}][testimonialImage]`, t.image);
        });

        const json = await updateHomepageData(formData);
        setMessage("Homepage updated successfully!");
        
        if (json.banners && json.banners.length > 0) {
          setBanners(
            json.banners.map((b) => ({
              aboutText: b.aboutText || "",
              image: [],
              preview: b.imageUrl && Array.isArray(b.imageUrl) ? b.imageUrl.map((u) => getFullImageUrl(u)) : b.imageUrl ? [getFullImageUrl(b.imageUrl)] : [],
              mobileImage: [],
              mobilePreview: b.mobileUrl && Array.isArray(b.mobileUrl) ? b.mobileUrl.map((u) => getFullImageUrl(u)) : b.mobileUrl ? [getFullImageUrl(b.mobileUrl)] : [],
              imageUrl: b.imageUrl || [],
              mobileUrl: b.mobileUrl || [],
            }))
          );
        }

        // Update new banner types after save
        if (json.banners && json.banners[0]) {
          const updatedBanner = json.banners[0];
          
          setCommercialBanner({
            images: [],
            previews: Array.isArray(updatedBanner.commercialBanner) ? updatedBanner.commercialBanner.map(url => getFullImageUrl(url)) : [],
            imageUrls: updatedBanner.commercialBanner || [],
            mobileImages: [],
            mobilePreviews: Array.isArray(updatedBanner.commercialMobileBanner) ? updatedBanner.commercialMobileBanner.map(url => getFullImageUrl(url)) : [],
            mobileImageUrls: updatedBanner.commercialMobileBanner || [],
            hasNewFiles: false,
            hasNewMobileFiles: false
          });
        
          setPlotBanner({
            images: [],
            previews: Array.isArray(updatedBanner.plotBanner) ? updatedBanner.plotBanner.map(url => getFullImageUrl(url)) : [],
            imageUrls: updatedBanner.plotBanner || [],
            mobileImages: [],
            mobilePreviews: Array.isArray(updatedBanner.plotMobileBanner) ? updatedBanner.plotMobileBanner.map(url => getFullImageUrl(url)) : [],
            mobileImageUrls: updatedBanner.plotMobileBanner || [],
            hasNewFiles: false,
            hasNewMobileFiles: false
          });
        
          setResidentialBanner({
            images: [],
            previews: Array.isArray(updatedBanner.residentialBanner) ? updatedBanner.residentialBanner.map(url => getFullImageUrl(url)) : [],
            imageUrls: updatedBanner.residentialBanner || [],
            mobileImages: [],
            mobilePreviews: Array.isArray(updatedBanner.residentialMobileBanner) ? updatedBanner.residentialMobileBanner.map(url => getFullImageUrl(url)) : [],
            mobileImageUrls: updatedBanner.residentialMobileBanner || [],
            hasNewFiles: false,
            hasNewMobileFiles: false
          });
        
          setAboutusBanner({
            images: [],
            previews: Array.isArray(updatedBanner.aboutusBanner) ? updatedBanner.aboutusBanner.map(url => getFullImageUrl(url)) : [],
            imageUrls: updatedBanner.aboutusBanner || [],
            mobileImages: [],
            mobilePreviews: Array.isArray(updatedBanner.aboutusMobileBanner) ? updatedBanner.aboutusMobileBanner.map(url => getFullImageUrl(url)) : [],
            mobileImageUrls: updatedBanner.aboutusMobileBanner || [],
            hasNewFiles: false,
            hasNewMobileFiles: false
          });
        
          setCareerBanner({
            images: [],
            previews: Array.isArray(updatedBanner.careerBanner) ? updatedBanner.careerBanner.map(url => getFullImageUrl(url)) : [],
            imageUrls: updatedBanner.careerBanner || [],
            mobileImages: [],
            mobilePreviews: Array.isArray(updatedBanner.careerMobileBanner) ? updatedBanner.careerMobileBanner.map(url => getFullImageUrl(url)) : [],
            mobileImageUrls: updatedBanner.careerMobileBanner || [],
            hasNewFiles: false,
            hasNewMobileFiles: false
          });
        }

        if (json.testimonials && json.testimonials.length > 0) {
          setTestimonials(
            json.testimonials.map((t) => ({
              name: t.name || "",
              text: t.text || "",
              image: null,
              preview: t.imageUrl ? getFullImageUrl(t.imageUrl) : null,
              imageUrl: t.imageUrl || "",
            }))
          );
        }
      } catch (err) {
        console.error(err);
        setMessage(err.message || "Failed to update homepage.");
      } finally {
        setLoading(false);
        setTimeout(() => setMessage(""), 5000);
      }
    };

    return (
      <div className="p-6 bg-white rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">Home-Page</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BANNERS */}
          <div className="space-y-4">
            <h3 className="font-semibold">Banners</h3>
            {banners.map((b, idx) => (
              <div key={idx} className="space-y-2 border p-3 rounded relative">
                <button type="button" className="absolute top-2 right-2 text-red-600" onClick={() => handleDelete(banners, setBanners, idx)}>Delete</button>
                <label>Banner Text</label>
                <textarea
                  value={b.aboutText}
                  onChange={(e) => handleChange(banners, setBanners, idx, "aboutText", e.target.value)}
                  className="border p-2 w-full"
                />
                <div>
                  <label>Desktop Image Preview</label>
                  {b.preview && b.preview.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {b.preview.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input type="file" accept="image/*" multiple onChange={handleFileChangeMultiple(banners, setBanners, idx, "image", "preview")} />
                </div>
                <div>
                  <label>Mobile Image Preview</label>
                  {b.mobilePreview && b.mobilePreview.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {b.mobilePreview.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-contain" />
                      ))}
                    </div>
                  ) : null}
                  <input type="file" accept="image/*" multiple onChange={handleFileChangeMultiple(banners, setBanners, idx, "mobileImage", "mobilePreview")} />
                </div>
              </div>
            ))}
            <button type="button" className="bg-blue-600 text-white py-1 px-3 rounded" onClick={() => handleAdd(banners, setBanners, { aboutText: "", image: [], preview: [], mobileImage: [], mobilePreview: [], imageUrl: [], mobileUrl: [] })}>
              Add Banner
            </button>
          </div>

          {/* COMMERCIAL BANNER */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">🏢 Commercial Banner</h3>
            <div className="border p-4 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Desktop Images */}
                <div className="space-y-3">
                  <label className="block font-medium text-gray-700">Desktop Images</label>
                  
                  {/* Show Current Uploaded Images */}
                  {commercialBanner.imageUrls && commercialBanner.imageUrls.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">✅ Currently Uploaded ({commercialBanner.imageUrls.length} images):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {commercialBanner.imageUrls.map((url, i) => (
                          <div key={i} className="relative group">
                            <img 
                              src={getFullImageUrl(url)} 
                              className="w-full h-32 object-cover rounded border-2 border-green-200" 
                              alt={`Commercial ${i + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(setCommercialBanner, i, false)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              Saved
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show New Images Preview */}
                  {commercialBanner.hasNewFiles && commercialBanner.images && commercialBanner.images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-blue-600 font-medium">🆕 New Images to Upload ({commercialBanner.images.length} images):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {commercialBanner.images.map((file, i) => (
                          <div key={i} className="relative group">
                            <img 
                              src={URL.createObjectURL(file)} 
                              className="w-full h-32 object-cover rounded border-2 border-blue-200" 
                              alt={`New Commercial ${i + 1}`}
                            />
                            <div className="absolute bottom-1 left-1 bg-blue-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                              New
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleBannerFileChange(setCommercialBanner)} 
                    className="w-full border border-dashed border-gray-300 p-3 rounded text-center hover:border-blue-400 transition-colors"
                  />
                  <p className="text-xs text-gray-500">Select multiple images for desktop view</p>
                </div>

                {/* Mobile Images */}
                <div className="space-y-3">
                  <label className="block font-medium text-gray-700">Mobile Images</label>
                  
                  {/* Show Current Uploaded Mobile Images */}
                  {commercialBanner.mobileImageUrls && commercialBanner.mobileImageUrls.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">✅ Currently Uploaded ({commercialBanner.mobileImageUrls.length} images):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {commercialBanner.mobileImageUrls.map((url, i) => (
                          <div key={i} className="relative group">
                            <img 
                              src={getFullImageUrl(url)} 
                              className="w-full h-32 object-cover rounded border-2 border-green-200" 
                              alt={`Mobile Commercial ${i + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(setCommercialBanner, i, true)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                              Saved
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show New Mobile Images Preview */}
                  {commercialBanner.hasNewMobileFiles && commercialBanner.mobileImages && commercialBanner.mobileImages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-blue-600 font-medium">🆕 New Mobile Images to Upload ({commercialBanner.mobileImages.length} images):</p>
                      <div className="grid grid-cols-2 gap-2">
                        {commercialBanner.mobileImages.map((file, i) => (
                          <div key={i} className="relative group">
                            <img 
                              src={URL.createObjectURL(file)} 
                              className="w-full h-32 object-cover rounded border-2 border-blue-200" 
                              alt={`New Mobile Commercial ${i + 1}`}
                            />
                            <div className="absolute bottom-1 left-1 bg-blue-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                              New
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleMobileBannerFileChange(setCommercialBanner)} 
                    className="w-full border border-dashed border-gray-300 p-3 rounded text-center hover:border-blue-400 transition-colors"
                  />
                  <p className="text-xs text-gray-500">Select multiple images for mobile view</p>
                </div>
              </div>
            </div>
          </div>

          {/* PLOT BANNER */}
          <div className="space-y-4">
            <h3 className="font-semibold">Plot Banner</h3>
            <div className="border p-3 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Plot Banner Images (Desktop)</label>
                  {plotBanner.previews && plotBanner.previews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {plotBanner.previews.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleBannerFileChange(setPlotBanner)} 
                  />
                </div>
                <div>
                  <label>Plot Banner Images (Mobile)</label>
                  {plotBanner.mobilePreviews && plotBanner.mobilePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {plotBanner.mobilePreviews.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleMobileBannerFileChange(setPlotBanner)} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RESIDENTIAL BANNER */}
          <div className="space-y-4">
            <h3 className="font-semibold">Residential Banner</h3>
            <div className="border p-3 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Residential Banner Images (Desktop)</label>
                  {residentialBanner.previews && residentialBanner.previews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {residentialBanner.previews.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleBannerFileChange(setResidentialBanner)} 
                  />
                </div>
                <div>
                  <label>Residential Banner Images (Mobile)</label>
                  {residentialBanner.mobilePreviews && residentialBanner.mobilePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {residentialBanner.mobilePreviews.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleMobileBannerFileChange(setResidentialBanner)} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ABOUTUS BANNER */}
          <div className="space-y-4">
            <h3 className="font-semibold">About Us Banner</h3>
            <div className="border p-3 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>About Us Banner Images (Desktop)</label>
                  {aboutusBanner.previews && aboutusBanner.previews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {aboutusBanner.previews.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleBannerFileChange(setAboutusBanner)} 
                  />
                </div>
                <div>
                  <label>About Us Banner Images (Mobile)</label>
                  {aboutusBanner.mobilePreviews && aboutusBanner.mobilePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {aboutusBanner.mobilePreviews.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleMobileBannerFileChange(setAboutusBanner)} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CAREER BANNER */}
          <div className="space-y-4">
            <h3 className="font-semibold">Career Banner</h3>
            <div className="border p-3 rounded">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Career Banner Images (Desktop)</label>
                  {careerBanner.previews && careerBanner.previews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {careerBanner.previews.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleBannerFileChange(setCareerBanner)} 
                  />
                </div>
                <div>
                  <label>Career Banner Images (Mobile)</label>
                  {careerBanner.mobilePreviews && careerBanner.mobilePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {careerBanner.mobilePreviews.map((p, i) => (
                        <img key={i} src={p} className="w-full max-h-40 object-cover" />
                      ))}
                    </div>
                  ) : null}
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleMobileBannerFileChange(setCareerBanner)} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* TESTIMONIALS */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold">Testimonials</h3>
            {testimonials.map((t, idx) => (
              <div key={idx} className="border p-2 rounded space-y-2 relative">
                <button type="button" className="absolute top-2 right-2 text-red-600" onClick={() => handleDelete(testimonials, setTestimonials, idx)}>Delete</button>
                <input type="text" value={t.name} placeholder="Name"
                  onChange={(e) => handleChange(testimonials, setTestimonials, idx, "name", e.target.value)} className="border p-2 w-full" />
                <textarea value={t.text} placeholder="Text"
                  onChange={(e) => handleChange(testimonials, setTestimonials, idx, "text", e.target.value)} className="border p-2 w-full" />
                {t.preview && <img src={t.preview} className="w-24 h-24 object-cover" />}
                <input type="file" accept="image/*" onChange={handleFileChange(testimonials, setTestimonials, idx, "image", "preview")} />
              </div>
            ))}
            <button type="button" className="bg-blue-600 text-white py-1 px-3 rounded" onClick={() => handleAdd(testimonials, setTestimonials, { name: "", text: "", image: null, preview: null, imageUrl: "" })}>
              Add Testimonial
            </button>
          </div> */}

          

          {/* SERVICES */}
          {/* <div className="space-y-2">
            <h3 className="font-semibold">Services</h3>
            {services.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 border p-2 rounded relative">
                <button type="button" className="absolute top-2 right-2 text-red-600" onClick={() => handleDelete(services, setServices, idx)}>Delete</button>
                <input type="text" value={s.title} placeholder="Title" className="border p-2 w-1/3"
                  onChange={(e) => handleChange(services, setServices, idx, "title", e.target.value)} />
                <input type="text" value={s.description} placeholder="Description" className="border p-2 w-1/2"
                  onChange={(e) => handleChange(services, setServices, idx, "description", e.target.value)} />
                <input type="text" value={s.icon} placeholder="Icon" className="border p-2 w-1/6"
                  onChange={(e) => handleChange(services, setServices, idx, "icon", e.target.value)} />
              </div>
            ))}
            <button type="button" className="bg-blue-600 text-white py-1 px-3 rounded" onClick={() => handleAdd(services, setServices, { title: "", description: "", icon: "" })}>
              Add Service
            </button>
          </div> */}

          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="bg-gray-800 text-white py-2 px-4 rounded">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {message && (
              <p className={message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}>
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    );
  }
