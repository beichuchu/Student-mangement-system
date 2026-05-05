const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async (req, res) => {
  try {
    const { search, className, gender, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (className) {
      query.className = className;
    }
    
    if (gender) {
      query.gender = gender;
    }
    
    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Student.countDocuments(query);
    
    res.json({
      success: true,
      data: students,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: '学生不存在' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { studentId, name, gender, age, className, phone } = req.body;
    
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: '学号已存在' });
    }
    
    const student = new Student({
      studentId,
      name,
      gender,
      age,
      className,
      phone
    });
    
    await student.save();
    res.status(201).json({ success: true, data: student, message: '添加成功' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, gender, age, className, phone } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, gender, age, className, phone },
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return res.status(404).json({ success: false, message: '学生不存在' });
    }
    
    res.json({ success: true, data: student, message: '更新成功' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({ success: false, message: '学生不存在' });
    }
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const maleCount = await Student.countDocuments({ gender: '男' });
    const femaleCount = await Student.countDocuments({ gender: '女' });
    
    const classStats = await Student.aggregate([
      { $group: { _id: '$className', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        maleCount,
        femaleCount,
        classDistribution: classStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/classes/list', async (req, res) => {
  try {
    const classes = await Student.distinct('className');
    res.json({ success: true, data: classes.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
