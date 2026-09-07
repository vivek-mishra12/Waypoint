const express = require('express');
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { getTasks, createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

// nested task routes
router.route('/:projectId/tasks').get(getTasks).post(createTask);

module.exports = router;
