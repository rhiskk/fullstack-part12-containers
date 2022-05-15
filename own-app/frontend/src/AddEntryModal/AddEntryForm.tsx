import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { DiagnosisSelection, TextField, NumberField } from "./FromField";
import { EntryWithoutId } from "../types";
import { useStateValue } from "../state";

interface Props {
    onSubmit: (values: EntryWithoutId) => void;
    onCancel: () => void;
    entryType: string;
}

interface Errors {
    date?: string;
    description?: string;
    specialist?: string;
    diagnosisCodes?: string;
    healthCheckRating?: string;
    discharge?: {
        date?: string,
        criteria?: string
    }
    sickLeave?: {
        startDate?: string,
        endDate?: string
    }
    employerName?: string;
}

const AddEntryForm = ({ onSubmit, onCancel, entryType }: Props) => {
    const [{ diagnoses }] = useStateValue();
    const initValues = (entryType: string): EntryWithoutId => {
        switch (entryType) {
            case "Health":
                return {
                    type: "HealthCheck",
                    date: "",
                    description: "",
                    specialist: "",
                    diagnosisCodes: [],
                    healthCheckRating: 0
                };
            case "Hospital":
                return {
                    type: "Hospital",
                    date: "",
                    description: "",
                    specialist: "",
                    diagnosisCodes: [],
                    discharge: {
                        date: "",
                        criteria: ""
                    }
                };
            case "Occupational":
                return {
                    type: "OccupationalHealthcare",
                    date: "",
                    description: "",
                    specialist: "",
                    diagnosisCodes: [],
                    employerName: "",
                    sickLeave: {
                        startDate: "",
                        endDate: ""
                    }
                };
            default:
                throw new Error('Incorrect or missing type: ' + entryType);
        }
    };

    return (
        <Formik
            initialValues={initValues(entryType)}
            onSubmit={onSubmit}
            validate={values => {
                const requiredError = "Field is required";
                const formatError = "Incorrect format";
                const errors: Errors = {};
                if (!values.date) {
                    errors.date = requiredError;
                } else if (!Date.parse(values.date)) {
                    errors.date = formatError;
                }
                if (!values.description) {
                    errors.description = requiredError;
                }
                if (!values.specialist) {
                    errors.specialist = requiredError;
                }
                if (values.type === "HealthCheck") {
                    if (!values.healthCheckRating && values.healthCheckRating !== 0) {
                        errors.healthCheckRating = requiredError;
                    } else if ((values.healthCheckRating > 3 || values.healthCheckRating < 0)) {
                        errors.healthCheckRating = "Rating must be an integer between 0 and 3";
                    }
                }
                if (values.type === "Hospital") {
                    errors.discharge = { ...errors.discharge };
                    if (!values.discharge.date) {
                        errors.discharge.date = requiredError;
                    } else if (!Date.parse(values.discharge.date)) {
                        errors.discharge.date = formatError;
                    }
                    if (!values.discharge.criteria) {
                        errors.discharge.criteria = requiredError;
                    }
                }
                if (values.type === "OccupationalHealthcare") {
                    if (!values.employerName) {
                        errors.employerName = requiredError;
                    }
                    if (values.sickLeave) {
                        errors.sickLeave = { ...errors.sickLeave };
                        if (values.sickLeave?.startDate && !Date.parse(values.sickLeave.startDate)) {
                            errors.sickLeave.startDate = formatError;
                        }
                        if (values.sickLeave?.endDate && !Date.parse(values.sickLeave.endDate)) {
                            errors.sickLeave.endDate = formatError;
                        }
                    }
                }
                if (!errors.sickLeave?.endDate && !errors.sickLeave?.startDate) {
                    delete errors.sickLeave;
                }
                if (!errors.discharge?.date && !errors.discharge?.criteria) {
                    delete errors.discharge;
                }
                return errors;
            }}
        >
            {({ isValid, dirty, setFieldValue, setFieldTouched }) => {

                return (
                    <Form className="form ui">
                        <Field
                            label="Date"
                            placeholder="YYYY-MM-DD"
                            name="date"
                            component={TextField}
                        />
                        <Field
                            label="Description"
                            placeholder="Description"
                            name="description"
                            component={TextField}
                        />

                        {entryType === "Health" &&
                            <Field
                                label="Health check rating"
                                name="healthCheckRating"
                                min={0}
                                max={3}
                                component={NumberField}
                            />}

                        {entryType === "Occupational" && <Field
                            label="Employer"
                            placeholder="Employer"
                            name="employerName"
                            component={TextField}
                        />}

                        {entryType === "Occupational" && <Field
                            label="Sick leave start date"
                            placeholder="YYYY-MM-DD"
                            name="sickLeave.startDate"
                            component={TextField}
                        />}

                        {entryType === "Occupational" && <Field
                            label="Sick leave end date"
                            placeholder="YYYY-MM-DD"
                            name="sickLeave.endDate"
                            component={TextField}
                        />}

                        {entryType === "Hospital" && <Field
                            label="Discharge date"
                            placeholder="YYYY-MM-DD"
                            name="discharge.date"
                            component={TextField}
                        />}

                        {entryType === "Hospital" && <Field
                            label="Discharge criteria"
                            placeholder="Discharge criteria"
                            name="discharge.criteria"
                            component={TextField}
                        />}

                        <Field
                            label="Specialist"
                            placeholder="Specialist"
                            name="specialist"
                            component={TextField}
                        />

                        <DiagnosisSelection
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            diagnoses={Object.values(diagnoses)}
                        />

                        <Grid>
                            <Grid.Column floated="left" width={5}>
                                <Button type="button" onClick={onCancel} color="red">
                                    Cancel
                                </Button>
                            </Grid.Column>
                            <Grid.Column floated="right" width={5}>
                                <Button
                                    type="submit"
                                    floated="right"
                                    color="green"
                                    disabled={!dirty || !isValid}
                                >
                                    Add
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default AddEntryForm;