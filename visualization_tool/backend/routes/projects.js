const express = require('express');
const controller = require('../controllers/projects');

const router = express.Router();

router.get('/', controller.getProjects);
router.get('/refactoringsSequence/:name', controller.getRefactoringsSequence);
router.get('/:project/serviceDependencies/:service/:index', controller.getServiceDependencies);
router.get('/:project/serviceExtraction/:service', controller.getServiceExtractionSequence);
router.get('/:project/getInitialState/:service/:index', controller.getInitialState);
router.get('/:project/getFinalState/:service/:index', controller.getFinalState);
router.get('/:project/getRefactoringImage/:service/:id', controller.getRefactoringImage);
module.exports = router;