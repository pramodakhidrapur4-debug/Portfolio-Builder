import React, { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiX } from "react-icons/hi";
import { useToast } from "../UI/Toast";
import { getPreviousWorksAdmin, createPreviousWork, updatePreviousWork, deletePreviousWork } from "../api";
import "./WorksManager.css";

const WorksManager = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    link: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchWorks = async () => {
    try {
      const res = await getPreviousWorksAdmin();
      setWorks(res.data.data || res.data); // Handle depending on exact backend response wrapper
    } catch (error) {
      toast.error("Failed to load previous works");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith("image/")) {
        return toast.error("Please upload a valid image file");
      }
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image size must be less than 5MB");
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    if (!editingId) {
      setImagePreview(null);
    } else {
      // Revert to original backend image
      const originalWork = works.find(w => w._id === editingId);
      if (originalWork) setImagePreview(originalWork.image);
    }
  };

  const openModal = (work = null) => {
    if (work) {
      setEditingId(work._id);
      setFormData({
        businessName: work.businessName,
        description: work.description,
        link: work.link || "",
      });
      setImagePreview(work.image);
    } else {
      setEditingId(null);
      setFormData({ businessName: "", description: "", link: "" });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ businessName: "", description: "", link: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingId && !imageFile) {
      return toast.error("Please upload an image");
    }

    if (formData.link) {
      try {
        const url = new URL(formData.link);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return toast.error("Website URL must start with http:// or https://");
        }
      } catch (err) {
        return toast.error("Please enter a valid URL");
      }
    }
    
    setIsSubmitting(true);
    const data = new FormData();
    data.append("businessName", formData.businessName);
    data.append("description", formData.description);
    data.append("link", formData.link);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (editingId) {
        await updatePreviousWork(editingId, data);
        toast.success("Work updated successfully");
      } else {
        await createPreviousWork(data);
        toast.success("Work added successfully");
      }
      fetchWorks();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save work");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(id);
    try {
      await deletePreviousWork(id);
      toast.success("Work deleted successfully");
      fetchWorks();
    } catch (error) {
      toast.error("Failed to delete work");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="works-manager">
      <div className="wm-header">
        <p className="wm-subtitle">Manage Portfolio</p>
        <div className="wm-header-actions">
          <button className="wm-btn-primary" onClick={() => openModal()}>
            <HiOutlinePlus /> Add New Work
          </button>
        </div>
      </div>

      {loading ? (
        <div className="wm-loading">Loading works...</div>
      ) : (
        <div className="wm-grid">
          {works.map((work) => (
            <div className="wm-card" key={work._id}>
              <div className="wm-card-img">
                <img src={work.image} alt={work.businessName} />
              </div>
              <div className="wm-card-content">
                <h3>{work.businessName}</h3>
                <p>{work.description}</p>
                {work.link && (
                  <a href={work.link} target="_blank" rel="noopener noreferrer">
                    {work.link}
                  </a>
                )}
                <div className="wm-card-actions">
                  <button className="wm-btn-edit" onClick={() => openModal(work)}>
                    <HiOutlinePencilAlt /> Edit
                  </button>
                  <button 
                    className="wm-btn-delete" 
                    onClick={() => handleDelete(work._id)}
                    disabled={deletingId === work._id}
                  >
                    <HiOutlineTrash /> {deletingId === work._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {works.length === 0 && <div className="wm-empty">No previous works found.</div>}
        </div>
      )}

      {isModalOpen && (
        <div className="wm-modal-overlay">
          <div className="wm-modal">
            <div className="wm-modal-header">
              <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
              <button className="wm-close-btn" onClick={closeModal}>
                <HiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="wm-form">
              <div className="wm-form-group">
                <label>Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="wm-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                ></textarea>
              </div>
              <div className="wm-form-group">
                <label>Website Link (Optional)</label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                />
              </div>
              <div className="wm-form-group">
                <label>Project Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="wm-file-input"
                  required={!editingId}
                />
                {imagePreview && (
                  <div className="wm-img-preview-container">
                    <div className="wm-img-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                    {imageFile && (
                      <button type="button" className="wm-btn-remove-img" onClick={removeSelectedImage}>
                        Remove selected image
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="wm-form-actions">
                <button type="button" className="wm-btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="wm-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingId ? "Update Project" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorksManager;
