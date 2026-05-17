const JobRequestController = require("../controllers/JobRequest.controller");
const { authenticateUser } = require("../middleware/UserAuth.middleware");
const router = require("express").Router();

// Create a new job request
router.post("/", authenticateUser, JobRequestController.createJobRequest);
// Get all job requests
router.get("/", JobRequestController.getAllJobRequest);
// Get a specific job request by ID
router.get("/:id", authenticateUser, JobRequestController.getJobRequestById);
// Update a job request by ID
router.put("/:id", authenticateUser, JobRequestController.updateJobRequest);
// Delete a job request by ID
router.delete("/:id", authenticateUser, JobRequestController.deleteJobRequest);

module.exports = router;