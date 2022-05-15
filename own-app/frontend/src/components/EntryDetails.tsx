import React from 'react';
import { Diagnosis, Entry, OccupationalHealthcareEntry, HospitalEntry, HealthCheckEntry } from '../types';
import { Icon, Card } from 'semantic-ui-react';

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

export const EntryDetails: React.FC<{ entry: Entry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
    switch (entry.type) {
        case "Hospital":
            return <Hospital entry={entry} diagnoses={diagnoses} />;
        case "OccupationalHealthcare":
            return <Occupational entry={entry} diagnoses={diagnoses} />;
        case "HealthCheck":
            return <Health entry={entry} diagnoses={diagnoses} />;
        default:
            return assertNever(entry);
    }
};

const Hospital: React.FC<{ entry: HospitalEntry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{entry.date} <Icon size='big' name='hospital' /></Card.Header>
                <Card.Meta>{entry.description}</Card.Meta>
                <Card.Description>
                    {entry.diagnosisCodes && <b>Diagnoses:</b>}
                    <ul>
                        {entry.diagnosisCodes?.map((code: string) =>
                            <li key={code}>{code}:{diagnoses[code]?.name}</li>
                        )}
                    </ul>
                    <b>Discharge:</b>
                    <br></br>
                    {entry.discharge.date}
                    <br></br>
                    {entry.discharge.criteria}
                    <p>{entry.specialist}</p>
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

const Occupational: React.FC<{ entry: OccupationalHealthcareEntry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{entry.date} <Icon size='big' name='stethoscope' /> {entry.employerName}</Card.Header>
                <Card.Meta>{entry.description}</Card.Meta>
                <Card.Description>
                    {entry.diagnosisCodes && <b>Diagnoses:</b>}
                    <ul>
                        {entry.diagnosisCodes?.map((code: string) =>
                            <li key={code}><b>{code}:</b>&nbsp;{diagnoses[code]?.name}</li>
                        )}
                    </ul>
                    {entry.sickLeave && 
                    <div>
                    <b>Sickleave:</b>
                    <br></br>
                    {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}
                    </div>}
                    <p>{entry.specialist}</p>
                </Card.Description>
            </Card.Content>
        </Card>
    );
};

const Health: React.FC<{ entry: HealthCheckEntry, diagnoses: { [code: string]: Diagnosis } }> = ({ entry, diagnoses }) => {
    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{entry.date} <Icon size='big' name='user md' /></Card.Header>
                <Card.Meta>{entry.description}</Card.Meta>
                <Card.Description>
                    {entry.diagnosisCodes && <b>Diagnoses:</b>}
                    <ul>
                        {entry.diagnosisCodes?.map((code: string) =>
                            <li key={code}>{code}:{diagnoses[code]?.name}</li>
                        )}
                    </ul>
                    {entry.healthCheckRating === 0 && <Icon color='green' name='heart' />}
                    {entry.healthCheckRating === 1 && <Icon color='yellow' name='heart' />}
                    {entry.healthCheckRating === 2 && <Icon color='red' name='heart' />}
                    {entry.healthCheckRating === 3 && <Icon color='purple' name='heart' />}
                    <p>{entry.specialist}</p>
                </Card.Description>
            </Card.Content>
        </Card>
    );
};