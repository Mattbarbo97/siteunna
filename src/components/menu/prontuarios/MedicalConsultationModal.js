import AddIcon from "@material-ui/icons/Add";
import {
    Box,
    Button,
    IconButton,
    Modal,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

const MedicalConsultationModal = ({
    open,
    onClose,
    paciente,
    doutor,
    handleSave,
}) => {
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

        if (value === "") {
            newPrescriptions.splice(index, 1);
            setPrescriptions(newPrescriptions);
            return;
        }

        newPrescriptions[index] = value;
        setPrescriptions(newPrescriptions);
    };

    const handleExamRequestChange = (index, value) => {
        const newExamRequests = [...examRequests];

        if (value === "") {
            newExamRequests.splice(index, 1);
            setExamRequests(newExamRequests);
            return;
        }

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
                    maxHeight: "80vh",
                    overflowY: "auto",
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
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={2}
                    >
                        {prescriptions.map((prescription, index) => (
                            <TextField
                                key={index}
                                label={`Receita ${index + 1}`}
                                value={prescription}
                                onChange={(e) =>
                                    handlePrescriptionChange(
                                        index,
                                        e.target.value
                                    )
                                }
                                fullWidth
                                multiline
                            />
                        ))}
                    </Box>
                    <IconButton onClick={addPrescription}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Pedidos de Exames</Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={2}
                    >
                        {examRequests.map((request, index) => (
                            <TextField
                                key={index}
                                label={`Pedido de Exame ${index + 1}`}
                                value={request}
                                onChange={(e) =>
                                    handleExamRequestChange(
                                        index,
                                        e.target.value
                                    )
                                }
                                fullWidth
                                multiline
                            />
                        ))}
                    </Box>
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                        handleSave({
                            receitas: prescriptions,
                            exames: examRequests,
                            anotacoes: notes,
                        })
                    }
                >
                    Salvar Prontuário
                </Button>
            </Paper>
        </Modal>
    );
};

export default MedicalConsultationModal;
