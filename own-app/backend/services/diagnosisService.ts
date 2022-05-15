import diagnosisData from '../data/diagnoses.json';
import { Diagnose } from '../types';

const diagnoses: Array<Diagnose> = diagnosisData;

const getDiagnoses = () => {
    return diagnoses;
};

export default {
    getDiagnoses
};