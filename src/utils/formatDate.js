const formatDate = (data) => {
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Os meses são indexados a partir de 0
    const ano = data.getFullYear();

    if (mes < 10) return `${dia}/0${mes}/${ano}`; // Adiciona um zero à esquerda do mês (01, 02, ..., 09

    return `${dia}/${mes}/${ano}`;
};
export default formatDate;
