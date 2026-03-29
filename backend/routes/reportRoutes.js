const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth'); // Login වෙලා ඉන්න ඕන

// @route   POST api/reports
// @desc    Save a new AI draft report
// 🚀 මෙන්න මෙතන තමයි saveReport වෙනුවට createDraftReport කියලා වෙනස් වුණේ
router.post('/', auth, reportController.createDraftReport);

// @route   GET api/reports
// @desc    Get all reports (Doctor Only)
router.get('/', auth, reportController.getAllReports);

// @route   GET api/reports/patient/:name
// @desc    Get reports by patient name
router.get('/patient/:name', auth, reportController.getPatientReports);

// රිපෝට් එකක් Confirm කරන Route එක (PUT Request)
// 🚀 මේකටත් auth එක දාන එක ආරක්ෂිතයි (Doctor කෙනෙක්මයි Confirm කරන්නේ කියලා තහවුරු කරන්න)
router.put('/confirm/:id', auth, reportController.confirmReport);

module.exports = router;