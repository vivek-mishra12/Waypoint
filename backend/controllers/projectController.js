const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// GET /api/projects  -> all projects the user owns or is a member of
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    // attach lightweight progress info
    const withProgress = await Promise.all(
      projects.map(async (p) => {
        const tasks = await Task.find({ project: p._id });
        const total = tasks.length;
        const done = tasks.filter((t) => t.status === 'done').length;
        const progress = total === 0 ? 0 : Math.round((done / total) * 100);
        return { ...p.toObject(), taskCount: total, progress };
      })
    );

    res.json(withProgress);
  } catch (err) {
    next(err);
  }
};

// POST /api/projects
const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id],
    });

    const populated = await project.populate('owner members', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isMember =
      project.owner._id.equals(req.user._id) ||
      project.members.some((m) => m._id.equals(req.user._id));
    if (!isMember) return res.status(403).json({ message: 'You do not have access to this project' });

    res.json(project);
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the project owner can edit this project' });
    }

    const { name, description, status } = req.body;
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;

    await project.save();
    const populated = await project.populate('owner members', 'name email');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the project owner can delete this project' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/projects/:id/members  { email }
const addMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the project owner can add members' });
    }

    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No user found with that email' });

    if (project.members.some((m) => m.equals(user._id))) {
      return res.status(409).json({ message: 'This user is already a member of the project' });
    }

    project.members.push(user._id);
    await project.save();
    const populated = await project.populate('owner members', 'name email');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id/members/:userId
const removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Only the project owner can remove members' });
    }
    if (req.params.userId === project.owner.toString()) {
      return res.status(400).json({ message: 'The project owner cannot be removed' });
    }

    project.members = project.members.filter((m) => m.toString() !== req.params.userId);
    await project.save();
    const populated = await project.populate('owner members', 'name email');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
