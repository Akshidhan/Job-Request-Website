import type { Request, Response } from "express";

const JobRequest = require("../models/JobRequest.model");
const User = require("../models/User.model");

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

        const jobRequests = await JobRequest.find(filter)
            .sort({ createdAt: -1 })
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum);
        res.status(200).json(jobRequests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

const getMyJobRequests = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;
        const jobRequests = await JobRequest.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(jobRequests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getUserJobRequests = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;
        const jobRequests = await JobRequest.find({
            $or: [{ user: userId }, { acceptedUser: userId }],
        }).sort({ createdAt: -1 });

        res.status(200).json(jobRequests);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get job request by ID
const getJobRequestById = async (req: Request, res: Response) => {
    try {
        const jobRequest = await JobRequest.findById(req.params.id)
            .populate("user", "name email")
            .populate("acceptedUser", "name email");
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
            category,
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
        const jobRequest = await JobRequest.findById(req.params.id);
        if (!jobRequest) {
            return res.status(404).json({ message: "Job request not found" });
        }
        const { userId } = (req as any).user;

        if (userId != jobRequest.user) {
            return res.status(403).json({ message: "User not authorized to update" });
        }
        await JobRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Job request updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};

const acceptJobRequest = async (req: Request, res: Response) => {
    try {
        const jobRequest = await JobRequest.findById(req.params.id);

        if (!jobRequest) {
            return res.status(404).json({ message: "Job request not found" });
        }

        if (jobRequest.acceptedUser) {
            return res.status(409).json({ message: "Job has already been accepted" });
        }

        if (jobRequest.status === "Closed") {
            return res.status(409).json({ message: "Closed jobs cannot be accepted" });
        }

        const { userId } = (req as any).user;

        jobRequest.acceptedUser = userId;
        jobRequest.status = "Ongoing";
        await jobRequest.save();

        const updatedJobRequest = await JobRequest.findById(req.params.id)
            .populate("user", "name email")
            .populate("acceptedUser", "name email");

        res.status(200).json(updatedJobRequest);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const closeJobRequest = async (req: Request, res: Response) => {
    try {
        const jobRequest = await JobRequest.findById(req.params.id);

        if (!jobRequest) {
            return res.status(404).json({ message: "Job request not found" });
        }

        const { userId } = (req as any).user;
        const ownsJob = String(jobRequest.user) === String(userId);

        if (!ownsJob) {
            return res.status(403).json({ message: "User not authorized to close" });
        }

        jobRequest.status = "Closed";
        await jobRequest.save();

        const updatedJobRequest = await JobRequest.findById(req.params.id)
            .populate("user", "name email")
            .populate("acceptedUser", "name email");

        res.status(200).json(updatedJobRequest);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Delete a job request
const deleteJobRequest = async (req: Request, res: Response) => {
    try {
        const jobRequest = await JobRequest.findById(req.params.id);
        if (!jobRequest) {
            return res.status(404).json({ message: "Job request not found" });
        }
        const { userId } = (req as any).user;

        if (userId != jobRequest.user) {
            return res.status(403).json({ message: "User not authorized to delete" });
        }
        await JobRequest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Job request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Search a job using a keyword
const searchJobRequest = async function (req: Request, res: Response) {
    try {
        const keyword = String(req.query.keyword || "").trim();
        const searchValue = escapeRegExp(keyword);

        if (!searchValue) {
            return res.status(200).json([]);
        }

        const jobRequest = await JobRequest.find({
            $or: [
                { title: { $regex: searchValue, $options: 'i' } },
                { description: { $regex: searchValue, $options: 'i'} },
                { category: { $regex: searchValue, $options: 'i'} },
                { location: { $regex: searchValue, $options: 'i'} }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json(jobRequest);
    } catch (error) {
        res.status(500).json({ message: "Server error", error})
    }
}

module.exports = {
    getAllJobRequest,
    getMyJobRequests,
    getUserJobRequests,
    getJobRequestById,
    createJobRequest,
    updateJobRequest,
    acceptJobRequest,
    closeJobRequest,
    deleteJobRequest,
    searchJobRequest
}