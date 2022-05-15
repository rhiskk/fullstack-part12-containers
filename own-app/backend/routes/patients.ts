import express from 'express';
import patientService from '../services/patientService';
import { toEntry, toPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
    console.log('Fetching all patients!');
    res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
    console.log(`Fetching patient id: ${req.params.id}`);
    res.json(patientService.getPatient(req.params.id));
});

router.post('/', (req, res) => {
    try {
        const { name, dateOfBirth, ssn, gender, occupation } = toPatient(req.body);
        const newPatient = patientService.addPatient(
            name,
            dateOfBirth,
            ssn,
            gender,
            occupation
        );
        res.json(newPatient);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.post('/:id/entries', (req, res) => {
    try {
        const entry = toEntry(req.body);
        const patient = patientService.addEntry(req.params.id, entry);
        res.json(patient);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

export default router;