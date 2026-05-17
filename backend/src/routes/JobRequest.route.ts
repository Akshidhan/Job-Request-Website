const JobRequestController = require("../controllers/JobRequest.controller");
const { authenticateUser } = require("../middleware/UserAuth.middleware");
const router = require("express").Router();

// Create a new job request
router.post("/", authenticateUser, JobRequestController.createJobRequest);
// Get all job requests
router.get("/", JobRequestController.getAllJobRequest);
// Search job requests
router.get("/search", JobRequestController.searchJobRequest);
// Get job requests created by the current user
router.get("/me", authenticateUser, JobRequestController.getMyJobRequests);
// Get jobs the current user created or accepted
router.get("/user", authenticateUser, JobRequestController.getUserJobRequests);
// Get a specific job request by ID
router.get("/:id", JobRequestController.getJobRequestById);
// Accept a job request
router.post("/:id/accept", authenticateUser, JobRequestController.acceptJobRequest);
// Close a job request
router.post("/:id/close", authenticateUser, JobRequestController.closeJobRequest);
// Update a job request by ID
router.put("/:id", authenticateUser, JobRequestController.updateJobRequest);
// Delete a job request by ID
router.delete("/:id", authenticateUser, JobRequestController.deleteJobRequest);

module.exports = router;