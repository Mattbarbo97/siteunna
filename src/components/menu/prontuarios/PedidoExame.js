// PedidoExame.js
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  // ... outros imports necessários
} from '@mui/material';

const PedidoExame = ({ open, onClose, onSave }) => {
  // ... lógica do componente, estados e funções
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pedido de Exame</DialogTitle>
      <DialogContent>
        {/* Campos de formulário para pedido de exame */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave}>Salvar Pedido de Exame</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PedidoExame;
