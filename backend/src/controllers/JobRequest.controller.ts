import type { Request, Response } from "express";

const JobRequest = require("../models/JobRequest.model");
const User = require("../models/User.model");

// Get all job requests
const getAllJobRequest = async (req: Request, res: Response) => {
    try{
        const { page = 1, limit = 10, category, status } = req.query;
        const pageNum = Number(page) || 1;
        const limitNum = Number(limit) || 10;
        const filter: any = {};

        if (category) {
            filter.category = category;
        }

        if (status) {
            filter.status = status;
        }

        const jobRequests = await JobRequest.find(filter).limit(limitNum).skip((pageNum - 1) * limitNum);
        res.status(200).json(jobRequests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

// Get job request by ID
const getJobRequestById = async (req: Request, res: Response) => {
    try {
        const jobRequest = await JobRequest.findById(req.params.id);
        if (!jobRequest) {
            return res.status(404).json({ message: "Job request not found" });
        }
        res.status(200).json(jobRequest);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Create a new job request
const createJobRequest = async (req: Request, res: Response) => {
    try {
        const { title, description, category, location, contactName, contactEmail } = req.body;
        const { userId } = (req as any).user;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const jobRequest = new JobRequest({
            title,
            description,
            category: category._id,
            location,
            contactName,
            contactEmail,
            user: user._id
        });

        await jobRequest.save();
        res.status(201).json(jobRequest);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update a job request
const updateJobRequest = async (req: Request, res: Response) => {
    try {
        const jobRequest = await JobRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!jobRequest) {
            return res.status(404).json({ message: "Job request not found" });
        }
        res.status(200).json(jobRequest);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a job request
const deleteJobRequest = async (req: Request, res: Response) => {
    try {
        const jobRequest = await JobRequest.findByIdAndDelete(req.params.id);
        if (!jobRequest) {
            return res.status(404).json({ message: "Job request not found" });
        }
        res.status(200).json({ message: "Job request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Search a job using a keyword
const searchJobRequest = async function (req: Request, res: Response) {
    try {
        const { keyword } = req.body;

        const jobRequest = await JobRequest.find({
            $or: [
                { title: { $regex: keyword, $option: 'i' } },
                { description: { $regex: keyword, $option: 'i'} }
            ]
        })

        if (!jobRequest){
            return res.status(404).json({ message: "No job request found!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error})
    }
}

module.exports = {
    getAllJobRequest,
    getJobRequestById,
    createJobRequest,
    updateJobRequest,
    deleteJobRequest,
    searchJobRequest
}