import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firestore } from "../../../firebase";
import MenuPrincipal from "../MenuPrincipal";
import PedidoExame from "./PedidoExame";
import "./ProntuarioStyles.css";
import Receituario from "./Receituario";

const ProntuarioEletronico = () => {
    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [textoLivre, setTextoLivre] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultadosPesquisa, setResultadosPesquisa] = useState([]);
    const [modalPedidoExameAberto, setModalPedidoExameAberto] = useState(false);
    const [modalReceituarioAberto, setModalReceituarioAberto] = useState(false);
    const [historico, setHistorico] = useState([]);
    const [dialogHistoricoAberto, setDialogHistoricoAberto] = useState(false);
    const [pacientes, setPacientes] = useState([]);

    const toggleModalPedidoExame = () => {
        setModalPedidoExameAberto(!modalPedidoExameAberto);
    };

    // Função de toggle para o modal de Receituário
    const toggleModalReceituario = () => {
        setModalReceituarioAberto(!modalReceituarioAberto);
    };

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

    // Função para buscar pacientes
    const handleSearch = async () => {
        if (!termoPesquisa || !dataNascimento) {
            //  exibir algum feedback para o usuário com a daata de nascimento do paciente
            return;
        }
        setLoading(true);
        try {
            const q = query(
                collection(firestore, "pacientes_cadastrados"),
                where("nome", "==", termoPesquisa),
                where("dataNascimento", "==", dataNascimento)
            );
            const querySnapshot = await getDocs(q);
            const pacientes = [];
            querySnapshot.forEach((doc) => {
                pacientes.push({ id: doc.id, ...doc.data() });
            });
            setResultadosPesquisa(pacientes);
            // Supondo que você tenha uma função para buscar o histórico aqui
        } catch (error) {
            console.error("Erro na pesquisa:", error);
        }
        setLoading(false);
    };

    // Função para salvar anotações do prontuário
    const salvarAnotacoes = async () => {
        if (!textoLivre) {
            // Adicione uma lógica para lidar com a ausência de texto
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(firestore, "historico_paciente"), {
                texto: textoLivre,
                data: new Date(),
                // Adicione aqui outras propriedades necessárias
            });
            setTextoLivre("");
            // Atualize o histórico do paciente após salvar
        } catch (error) {
            console.error("Erro ao salvar anotações:", error);
        }
        setLoading(false);
    };

    // Função para abrir o diálogo de histórico completo
    const abrirDialogHistorico = () => {
        setDialogHistoricoAberto(true);
    };

    // Função para fechar o diálogo de histórico completo
    const fecharDialogHistorico = () => {
        setDialogHistoricoAberto(false);
    };

    const defaultProps = {
        options: pacientes,
        getOptionLabel: (option) => option.nome + " " + option.cpf,
    };

    return (
        <div className="prontuario-wrapper">
            <MenuPrincipal />
            <Box className="search-bar">
                <Autocomplete
                    {...defaultProps}
                    id="paciente"
                    clearOnEscape
                    size="small"
                    getOptionKey={(option) => option.id}
                    onChange={(e, value) => {
                        setTermoPesquisa(value || "");
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Paciente"
                            variant="standard"
                        />
                    )}
                />
                <IconButton onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
            </Box>

            <Box className="container">
                <Button
                    variant="contained"
                    onClick={toggleModalPedidoExame}
                    startIcon={<SaveIcon />}
                >
                    Solicitar Exame
                </Button>
                <Button
                    variant="contained"
                    onClick={toggleModalReceituario}
                    startIcon={<SaveIcon />}
                >
                    Emitir Receituário
                </Button>

                {/* Campo de texto livre para anotações */}

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
                                <TableCell>{registro.data}</TableCell>
                                <TableCell>{registro.medico}</TableCell>
                                <TableCell>{registro.descricao}</TableCell>
                                <TableCell>
                                    {/* Botão para visualizar detalhes do prontuário */}
                                    <IconButton
                                        onClick={() => abrirDialogHistorico()}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modais */}
            <PedidoExame
                open={modalPedidoExameAberto}
                onClose={toggleModalPedidoExame}
            />
            <Receituario
                open={modalReceituarioAberto}
                onClose={toggleModalReceituario}
            />

            {/* Dialog de visualização do histórico completo */}
            <Dialog
                open={dialogHistoricoAberto}
                onClose={fecharDialogHistorico}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Histórico Completo do Paciente</DialogTitle>
                <DialogContent>
                    {/* Conteúdo do histórico completo do paciente */}
                    {/* Este conteúdo precisaria ser dinamicamente carregado com base no paciente selecionado */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={fecharDialogHistorico}>Fechar</Button>
                </DialogActions>
            </Dialog>

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
