const Task = require('../models/Task');
const Project = require('../models/Project');

const assertMember = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: { status: 404, message: 'Project not found' } };
  const isMember = project.owner.equals(userId) || project.members.some((m) => m.equals(userId));
  if (!isMember) return { error: { status: 403, message: 'You do not have access to this project' } };
  return { project };
};

// GET /api/projects/:projectId/tasks
const getTasks = async (req, res, next) => {
  try {
    const { project, error } = await assertMember(req.params.projectId, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const tasks = await Task.find({ project: project._id })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// POST /api/projects/:projectId/tasks
const createTask = async (req, res, next) => {
  try {
    const { project, error } = await assertMember(req.params.projectId, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const { title, description, priority, assignee, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Task title is required' });

    if (assignee) {
      const isValidAssignee =
        project.owner.equals(assignee) || project.members.some((m) => m.equals(assignee));
      if (!isValidAssignee) {
        return res.status(400).json({ message: 'Assignee must be a member of this project' });
      }
    }

    const task = await Task.create({
      project: project._id,
      title,
      description,
      priority,
      status: 'todo',
      isCompleted: false,
      assignee: assignee || null,
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    const populated = await task.populate('assignee createdBy', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { error } = await assertMember(task.project, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const { title, description, status, priority, assignee, dueDate, isCompleted } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (assignee !== undefined) task.assignee = assignee || null;
    if (dueDate !== undefined) task.dueDate = dueDate || null;

    // Synchronize isCompleted and status
    if (isCompleted !== undefined) {
      task.isCompleted = isCompleted;
      task.status = isCompleted ? 'done' : 'todo';
    } else if (status !== undefined) {
      task.status = status;
      task.isCompleted = status === 'done';
    }

    await task.save();
    const populated = await task.populate('assignee createdBy', 'name email');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id/toggle
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { error } = await assertMember(task.project, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    // Flip completion boolean and sync status
    task.isCompleted = !task.isCompleted;
    task.status = task.isCompleted ? 'done' : 'todo';

    await task.save();
    const populated = await task.populate('assignee createdBy', 'name email');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { error } = await assertMember(task.project, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, toggleTask, deleteTask };