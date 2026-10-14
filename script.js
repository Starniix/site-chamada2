function registrarChamada() {
    const checkboxesMarcados = document.querySelectorAll('input.Presente:checked');
    
    const listaPresenca = [];

    checkboxesMarcados.forEach((caixa) => {
        listaPresenca.push(caixa.value);
    });

    console.log("IDs dos alunos presentes:", listaPresenca);

    if (listaPresenca.length > 0) {
        alert("Chamada registrada com sucesso para " + listaPresenca.length + " aluno(s)!");
    } else {
        alert("Nenhum aluno marcado.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const botaoRegistrar = document.querySelector("button");
    if (botaoRegistrar) {
        botaoRegistrar.addEventListener("click", registrarChamada);
    }
});
