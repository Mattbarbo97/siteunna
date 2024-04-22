import AddIcon from "@material-ui/icons/Add";
import {
    Box,
    Button,
    IconButton,
    Input,
    InputAdornment,
    Modal,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

import CancelIcon from "@mui/icons-material/Cancel";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    receitas: Yup.array().of(
        Yup.string().required(
            "O campo não pode estar vazio, se não for preencher, remova o campo."
        )
    ),
    exames: Yup.array().of(
        Yup.string().required(
            "O campo não pode estar vazio, se não for preencher, remova o campo."
        )
    ),
    anotacoes: Yup.string().required(
        "As anotações da consulta são obrigatórias."
    ),
});

const MedicalConsultationModal = ({
    open,
    onClose,
    paciente,
    doutor,
    handleSave,
}) => {
    const [confirmClear, setConfirmClear] = useState(false);

    const formik = useFormik({
        initialValues: {
            receitas: [],
            exames: [],
            anotacoes: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSave(values);
            formik.resetForm();
        },
    });

    const handleDeleteReceita = (index) => {
        const newReceitas = [...formik.values.receitas];
        newReceitas.splice(index, 1);
        formik.setFieldValue("receitas", newReceitas);
    };

    const addReceita = () => {
        formik.setFieldValue("receitas", [...formik.values.receitas, ""]);
    };

    const handleDeleteExame = (index) => {
        const newExames = [...formik.values.exames];
        newExames.splice(index, 1);
        formik.setFieldValue("exames", newExames);
    };

    const addExame = () => {
        formik.setFieldValue("exames", [...formik.values.exames, ""]);
    };

    return (
        <>
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
                    <form onSubmit={formik.handleSubmit}>
                        <Box mb={2}>
                            <Typography variant="h6">Receitas</Typography>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={2}
                            >
                                {formik.values.receitas.map((index) => (
                                    <Input
                                        key={index}
                                        label={`Receita ${index + 1}`}
                                        name={`receitas[${index}]`}
                                        value={formik.values.receitas[index]}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.receitas &&
                                            Boolean(formik.errors.receitas)
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="delete field"
                                                    onClick={() =>
                                                        handleDeleteReceita(
                                                            index
                                                        )
                                                    }
                                                    edge="end"
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        fullWidth
                                        multiline
                                    />
                                ))}
                            </Box>
                            <IconButton onClick={addReceita}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="h6">
                                Pedidos de Exames
                            </Typography>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                gap={2}
                            >
                                {formik.values.exames.map((index) => (
                                    <Input
                                        key={index}
                                        label={`Pedido de Exame ${index + 1}`}
                                        name={`exames[${index}]`}
                                        value={formik.values.exames[index]}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.exames &&
                                            Boolean(formik.errors.exames)
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="delete field"
                                                    onClick={() =>
                                                        handleDeleteExame(index)
                                                    }
                                                    edge="end"
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        fullWidth
                                    />
                                ))}
                            </Box>
                            <IconButton onClick={addExame}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="h6">
                                Anotações da Consulta
                            </Typography>
                            <TextField
                                label="Anotações"
                                value={formik.values.anotacoes}
                                name="anotacoes"
                                helperText={
                                    formik.touched.anotacoes &&
                                    formik.errors.anotacoes
                                }
                                error={
                                    formik.touched.anotacoes &&
                                    Boolean(formik.errors.anotacoes)
                                }
                                onChange={formik.handleChange}
                                fullWidth
                                multiline
                                rows={4}
                            />
                        </Box>
                    </form>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={formik.handleSubmit}
                        >
                            Salvar Prontuário
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#f44336",
                                "&:hover": {
                                    backgroundColor: "#d32f2f",
                                },
                            }}
                            onClick={() => setConfirmClear(true)}
                        >
                            Limpar tudo
                        </Button>
                    </Box>
                </Paper>
            </Modal>
            <Modal open={confirmClear}>
                <Paper
                    sx={{
                        position: "absolute",
                        bgcolor: "background.paper",
                        width: "40%",
                        p: 4,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <Typography variant="h6" align="center">
                        Tem certeza que deseja limpar tudo?
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        sx={{
                            color: "#f44336",
                            opacity: 0.8,
                            marginBottom: 4,
                        }}
                    >
                        Essa ação não pode ser desfeita
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            marginTop: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                formik.resetForm();
                                setConfirmClear(false);
                            }}
                        >
                            Sim
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#f44336",
                                "&:hover": {
                                    backgroundColor: "#d32f2f",
                                },
                            }}
                            onClick={() => setConfirmClear(false)}
                        >
                            Não
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </>
    );
};

export default MedicalConsultationModal;
