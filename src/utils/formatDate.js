const formatDate = (data) => {
    const dia = data.getDate();
    const mes = data.getMonth() + 1; // Os meses são indexados a partir de 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
};
export default formatDate;
