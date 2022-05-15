import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { Patient, Entry, Diagnosis, EntryWithoutId } from "../types";
import { Icon, Button, Header } from "semantic-ui-react";

import { useStateValue, setPatientState, setDiagnoseList } from "../state";
import { EntryDetails } from "../components/EntryDetails";
import AddEntryModal from "../AddEntryModal";

const PatientPage = () => {
    const { id } = useParams<{ id: string }>();
    const [{ patient }, patientDispatch ] = useStateValue();
    const [{ diagnoses }, diagnosisDispatch ] = useStateValue();

    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();
    const [entryType, setEntryType] = React.useState<string>("Health");

    const openModal = (type: string): void => {
        setEntryType(type);
        setModalOpen(true);
    };

    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    const submitNewEntry = async (values: EntryWithoutId) => {
        try {
            const { data: newPatient } = await axios.post<Patient>(
                `${apiBaseUrl}/patients/${id}/entries`,
                values
            );
            patientDispatch(setPatientState(newPatient));
            closeModal();
        } catch (e) {
            console.error(e.response?.data || 'Unknown Error');
            setError(e.response?.data || 'Unknown error');
        }
    };

    const setPatient = async () => {
        try {
            const { data: foundPatient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
            patientDispatch(setPatientState(foundPatient));
        } catch (e) {
            console.error(e.response?.data || 'Unknown Error');
        }
    };

    const setDiagnoses = async () => {
        try {
            const { data: diagnoses } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnosis`);
            diagnosisDispatch(setDiagnoseList(diagnoses));
        } catch (e) {
            console.error(e.response?.data || 'Unknown Error');
        }
    };

    useEffect(() => {
        void setDiagnoses();
    }, []);

    useEffect(() => {
        if (!patient || id !== patient.id) {
            void setPatient();
        }
    }, [id]);

    if (!patient) return null;

    return (
        <div>
            <h2>
                {patient.name}
                {patient.gender === "male" && <Icon name='mars' />}
                {patient.gender === "female" && <Icon name='venus' />}
                {patient.gender === "other" && <Icon name='mars stroke vertical' />}
            </h2>
            {patient.ssn && <p>{`ssn: ${patient.ssn}`}</p>}
            <p>{`occupation: ${patient.occupation}`}</p>
            <h4>entires</h4>
            {patient.entries.map((entry: Entry) =>
                <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
            )}
            <AddEntryModal
                modalOpen={modalOpen}
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal}
                entryType={entryType}
            />
            <br></br>
            <div>
                <Header as='h4' attached='top' textAlign='center'>
                    Add a new entry
                </Header>
                <Button.Group fluid>
                    <Button onClick={() => openModal("Health")}>{`Health check `}<Icon name='user md'/></Button>
                    <Button onClick={() => openModal("Occupational")}>{`Occupational `}<Icon name='stethoscope'/></Button>
                    <Button onClick={() => openModal("Hospital")}>{`Hospital `}<Icon name='hospital'/></Button>
                </Button.Group>
            </div>
        </div>
    );
};

export default PatientPage;