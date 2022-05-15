import express from 'express';
import diagnoseService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res) => {
    console.log('Fetching all diagnoses!');
    res.send(diagnoseService.getDiagnoses());
});

export default router;