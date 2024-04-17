import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    createFilterOptions,
} from "@mui/material";
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    setDoc,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { firestore } from "../../../firebase";
import formatDate from "../../../utils/formatDate";
import takeFirst80Char from "../../../utils/takeFirst80Char";
import MenuPrincipal from "../MenuPrincipal";
import MedicalConsultationModal from "./MedicalConsultationModal";
import "./ProntuarioStyles.css";

const ProntuarioEletronico = () => {
    const [pacienteSelecionado, setPacienteSelecionado] = useState({});
    const [textoLivre, setTextoLivre] = useState("");
    const [loading, setLoading] = useState(false);
    const [historico, setHistorico] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [modalConsultaAberto, setModalConsultaAberto] = useState(false);

    const { user } = useUser();

    useEffect(() => {
        const firestore = getFirestore();
        const pacientesCollection = collection(
            firestore,
            "pacientes_cadastrados"
        );

        const listarPacientes = async () => {
            try {
                const snapshot = await getDocs(pacientesCollection);
                const pacientesList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPacientes(pacientesList);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        listarPacientes();
    }, []);

    // Função para salvar anotações do prontuário
    const salvarAnotacoes = async () => {
        if (!textoLivre || !pacienteSelecionado.id) {
            // Adicione uma lógica para lidar com a ausência de texto
            return;
        }
        setLoading(true);
        try {
            const dados = {
                texto: textoLivre,
                data: new Date(),
                user_id: pacienteSelecionado.id,
                medico: user.name,
            };

            const historicoCollection = collection(
                firestore,
                "historico_paciente"
            );
            await setDoc(doc(historicoCollection), dados);
            // Limpe o campo de texto após salvar
            setTextoLivre("");
            // Atualize o histórico do paciente após salvar
            buscarAnotacoes();
        } catch (error) {
            console.error("Erro ao salvar anotações:", error);
        }
        setLoading(false);
    };

    const buscarAnotacoes = useCallback(async () => {
        if (!pacienteSelecionado.id) {
            return;
        }
        setLoading(true);
        // Buscar anotações do paciente selecionado com order by data
        try {
            const historicoCollection = collection(
                firestore,
                "historico_paciente"
            );
            const historicoSnapshot = await getDocs(historicoCollection);
            const historicoList = historicoSnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter(
                    (registro) => registro.user_id === pacienteSelecionado.id
                )
                .sort((a, b) => b.data.toDate() - a.data.toDate());
            setHistorico(historicoList);
            console.log(historicoList);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }, [pacienteSelecionado]);

    useEffect(() => {
        buscarAnotacoes();
    }, [pacienteSelecionado, buscarAnotacoes]);

    const defaultProps = {
        options: pacientes,
        getOptionLabel: (option) => option.nome + " " + option.cpf,
    };

    const defaultFilterOptions = createFilterOptions();
    const filterOptions = (options, state) => {
        return defaultFilterOptions(options, state).slice(0, 6);
    };

    return (
        <div className="prontuario-wrapper">
            <MenuPrincipal />
            <Box className="search-bar">
                <Autocomplete
                    {...defaultProps}
                    id="paciente"
                    clearOnEscape
                    filterOptions={filterOptions}
                    size="small"
                    getOptionKey={(option) => option.id}
                    limitTags={4}
                    onChange={(e, value) => {
                        if (!value) {
                            return;
                        }
                        setPacienteSelecionado(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Paciente"
                            variant="standard"
                        />
                    )}
                />
            </Box>

            <Box className="container">
                <Button
                    variant="contained"
                    onClick={() => setModalConsultaAberto(true)}
                    startIcon={<SaveIcon />}
                    disabled={!pacienteSelecionado.id}
                >
                    Solicitar Exame
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={!pacienteSelecionado.id}
                >
                    Emitir Receituário
                </Button>
            </Box>

            {/* Campo de texto livre para anotações */}
            <Box>
                <TextField
                    label="Anotações do Prontuário"
                    multiline
                    rows={4}
                    value={textoLivre}
                    onChange={(e) => setTextoLivre(e.target.value)}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />

                {/* Botão para salvar as anotações no histórico */}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={salvarAnotacoes}
                    sx={{ mt: 2 }}
                    disabled={!pacienteSelecionado.id}
                >
                    Salvar Anotações
                </Button>
            </Box>

            {/* Tabela de histórico do prontuário */}
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table aria-label="Histórico do Prontuário">
                    <TableHead>
                        <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell>Médico</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historico.map((registro) => (
                            <TableRow key={registro.id}>
                                <TableCell>
                                    {formatDate(registro.data.toDate())}
                                </TableCell>
                                <TableCell>{registro.medico}</TableCell>
                                <TableCell>
                                    {takeFirst80Char(registro.texto)}
                                </TableCell>
                                <TableCell>
                                    {/* Botão para visualizar detalhes do prontuário */}
                                    <IconButton
                                    // onClick={() => abrirDialogHistorico()}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <MedicalConsultationModal open={modalConsultaAberto} />

            {/* Carregando, se necessário */}
            {loading && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                >
                    <CircularProgress />
                </Box>
            )}
        </div>
    );
};

export default ProntuarioEletronico;
