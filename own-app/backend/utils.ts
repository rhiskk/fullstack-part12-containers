import { NewPatient, Gender, EntryWithoutId,
     HealthCheckEntry, HospitalEntry, 
     OccupationalHealthcareEntry, HealthCheckRating, Diagnose} from './types';

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const isGender = (str: string): str is Gender => {
    return ['male', 'female', 'other'].includes(str);
};

const isSsn = (str: string): boolean => {
    return /^\d{3}-?\d{2}-?\d{4}$/.test(str);
};

const parseName = (name: unknown): string => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name');
    }
    return name;
};

const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date');
    }
    return date;
};

const parseSsn = (ssn: unknown): string => {
    if (!ssn || !isString(ssn) || !isSsn(ssn)) {
        throw new Error('Incorrect or missing ssn');
    }
    return ssn;
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};

const parseOccupation = (occupation: unknown): string => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation');
    }
    return occupation;
};

type PatientFields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

export const toPatient = (object: PatientFields): NewPatient => {
    const newPatient: NewPatient = {
        name: parseName(object.name),
        dateOfBirth: parseDate(object.dateOfBirth),
        ssn: parseSsn(object.ssn),
        gender: parseGender(object.gender),
        occupation: parseOccupation(object.occupation),
        entries: []
    };
    return newPatient;
};

const parseSpecialist = (specialist: unknown): string => {
    if (!specialist || !isString(specialist)) {
        throw new Error('Incorrect or missing specialist');
    }
    return specialist;
};

const parseEmployerName = (name: unknown): string => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing employer name');
    }
    return name;
};

const parseDescription = (description: unknown): string => {
    if (!description || !isString(description)) {
        throw new Error('Incorrect or missing description');
    }
    return description;
};

const isHealCheckRating = (int: number): int is HealthCheckRating => {
    return [0, 1, 2, 3].includes(int);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {   
    if (!rating && rating !== 0 || typeof rating !== 'number' || !isHealCheckRating(rating)) {
        throw new Error('Incorrect or missing health rating: ' + rating);
    }
    return rating;
};

const isDiagnosisCodeList = (codes: unknown): codes is Array<Diagnose['code']> => {
    //&& codes are included in diagnoseData codes
    return Array.isArray(codes) && codes.length !== 0 && typeof codes[0] === 'string';
};

const parseDiagnosisCodes = (codes: unknown): Array<Diagnose['code']> | []=> {
    if(isDiagnosisCodeList(codes)) {
        return codes;
    }
    return [];
};

const isSickLeave = (leave: unknown): leave is OccupationalHealthcareEntry['sickLeave'] => {
    return  (typeof leave === 'object' && leave !== null &&
      'startDate' in leave && 'endDate' in leave);
};

const parseSickLeave = (leave: unknown): OccupationalHealthcareEntry['sickLeave'] => {
    if (!isSickLeave(leave)) {
        throw new Error('Incorrect sickLeave');
    }
    return leave;
};

const isDischarge = (discharge: unknown): discharge is HospitalEntry['discharge'] => {
    return  (typeof discharge === 'object' && discharge !== null &&
      'date' in discharge && 'criteria' in discharge);
};

const parseDischarge = (discharge: unknown): HospitalEntry['discharge'] => {
    if (!discharge || !isDischarge(discharge)) {
        throw new Error('Incorrect or missing discharge');
    }
    return discharge;
};

type EntryFields = { type: unknown, date: unknown, description: unknown, specialist: unknown, diagnosisCodes: unknown,
     healthCheckRating: unknown, discharge: unknown, employerName: unknown, sickLeave: unknown };

export const toEntry = (object: EntryFields): EntryWithoutId => {
    switch (object.type) {
        case "HealthCheck":
            return newHealthEntry(object);
        case "OccupationalHealthcare":
            return newOccupationalEntry(object);
        case "Hospital":
            return newHospitalEntry(object);
        default:
            throw new Error('Incorrect or missing type: ' + object.type);
    }
};

const newHealthEntry = (object: EntryFields): Omit<HealthCheckEntry, 'id'> => {
    const entry: Omit<HealthCheckEntry, 'id'> = {
        type: "HealthCheck",
        date: parseDate(object.date),
        description: parseDescription(object.description),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
    };
    return entry;
};

const newOccupationalEntry = (object: EntryFields): Omit<OccupationalHealthcareEntry, 'id'> => {
    const entry: Omit<OccupationalHealthcareEntry, 'id'> = {
        type: "OccupationalHealthcare",
        date: parseDate(object.date),
        description: parseDescription(object.description),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        employerName: parseEmployerName(object.employerName),
        sickLeave: parseSickLeave(object.sickLeave)
    };
    return entry;
};

const newHospitalEntry = (object: EntryFields): Omit<HospitalEntry, 'id'> => {
    const entry: Omit<HospitalEntry, 'id'> = {
        type: "Hospital",
        date: parseDate(object.date),
        description: parseDescription(object.description),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        discharge: parseDischarge(object.discharge)
    };
    return entry;
};