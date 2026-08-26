import PreviousWork from '../models/PreviousWork.js';
import { upl } from '../utils/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

const validateUrl = (urlStr) => {
  try {
    const url = new URL(urlStr);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export const createPreviousWork = async (req, res) => {
  try {
    const { businessName, description, link } = req.body;

    if (!businessName || !description || !link) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validateUrl(link)) {
      return res.status(400).json({ success: false, message: 'Invalid or dangerous URL' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required when creating a project' });
    }

    const result = await upl(req.file.path);
    
    const newWork = new PreviousWork({
      businessName,
      description,
      link,
      image: result.secure_url,
      imagePublicId: result.public_id
    });

    await newWork.save();
    return res.status(201).json({ success: true, data: newWork });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPreviousWorks = async (req, res) => {
  try {
    const works = await PreviousWork.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: works });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getPreviousWorkById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const work = await PreviousWork.findById(id);
    if (!work) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, data: work });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updatePreviousWork = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const { businessName, description, link } = req.body;
    const work = await PreviousWork.findById(id);

    if (!work) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (link && !validateUrl(link)) {
      return res.status(400).json({ success: false, message: 'Invalid or dangerous URL' });
    }

    let imageUrl = work.image;
    let imagePublicId = work.imagePublicId;

    if (req.file) {
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId).catch(() => {});
      }
      const result = await upl(req.file.path);
      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const updated = await PreviousWork.findByIdAndUpdate(id, {
      ...(businessName && { businessName }),
      ...(description && { description }),
      ...(link && { link }),
      image: imageUrl,
      imagePublicId
    }, { new: true, runValidators: true });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deletePreviousWork = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const work = await PreviousWork.findById(id);
    if (!work) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (work.imagePublicId) {
      await cloudinary.uploader.destroy(work.imagePublicId).catch(() => {});
    }

    await PreviousWork.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
