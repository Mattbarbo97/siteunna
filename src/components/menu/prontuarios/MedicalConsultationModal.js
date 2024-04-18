import {
    Box,
    Button,
    IconButton,
    Modal,
    TextField,
    Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Paper } from "@mui/material";
import React, { useState } from "react";

const MedicalConsultationModal = ({ open, onClose, paciente, doutor }) => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [examRequests, setExamRequests] = useState([]);
    const [notes, setNotes] = useState("");

    const addPrescription = () => {
        setPrescriptions([...prescriptions, ""]);
    };

    const addExamRequest = () => {
        setExamRequests([...examRequests, ""]);
    };

    const handlePrescriptionChange = (index, value) => {
        const newPrescriptions = [...prescriptions];
        newPrescriptions[index] = value;
        setPrescriptions(newPrescriptions);
    };

    const handleExamRequestChange = (index, value) => {
        const newExamRequests = [...examRequests];
        newExamRequests[index] = value;
        setExamRequests(newExamRequests);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Paper
                sx={{
                    position: "absolute",
                    bgcolor: "background.paper",
                    width: "80%",
                    p: 4,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <Typography variant="h6" style={{ textAlign: "center" }}>
                    Novo Prontuário
                </Typography>
                <Typography variant="subtitle1">
                    Paciente: {paciente.nome}
                </Typography>
                <Typography variant="subtitle1">
                    {/* Médico: {doutor.name} */}
                </Typography>
                <Box mb={2}>
                    <Typography variant="h6">Receitas</Typography>
                    {prescriptions.map((prescription, index) => (
                        <TextField
                            key={index}
                            label={`Receita ${index + 1}`}
                            value={prescription}
                            onChange={(e) =>
                                handlePrescriptionChange(index, e.target.value)
                            }
                            fullWidth
                            multiline
                            rows={4}
                        />
                    ))}
                    <IconButton onClick={addPrescription}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Pedidos de Exames</Typography>
                    {examRequests.map((request, index) => (
                        <TextField
                            key={index}
                            label={`Pedido de Exame ${index + 1}`}
                            value={request}
                            onChange={(e) =>
                                handleExamRequestChange(index, e.target.value)
                            }
                            fullWidth
                            multiline
                            rows={4}
                        />
                    ))}
                    <IconButton onClick={addExamRequest}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Anotações da Consulta</Typography>
                    <TextField
                        label="Anotações"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Box>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Salvar Prontuário
                </Button>
            </Paper>
        </Modal>
    );
};

export default MedicalConsultationModal;
