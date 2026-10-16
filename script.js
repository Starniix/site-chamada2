// Função para carregar apenas os domingos válidos do mês atual no select
function carregarDomingosDoMes() {
    const select = document.getElementById('dataSelect');
    if (!select) return;

    select.innerHTML = ''; // Limpa antes de gerar

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas os dias

    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    const totalDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

    for (let dia = 1; dia <= totalDiasNoMes; dia++) {
        const data = new Date(anoAtual, mesAtual, dia);

        // Se for domingo (0) e a data for igual ou depois de hoje
        if (data.getDay() === 0 && data >= hoje) {
            const valorData = data.toISOString().split('T')[0];

            const diaFmt = String(dia).padStart(2, '0');
            const mesFmt = String(mesAtual + 1).padStart(2, '0');
            const textoExibido = `${diaFmt}/${mesFmt}/${anoAtual}`;

            const option = document.createElement('option');
            option.value = valorData;
            option.textContent = textoExibido;
            select.appendChild(option);
        }
    }
}

// Função para registrar a chamada e salvar na memória do navegador
function registrarChamada() {
    const selectData = document.getElementById('dataSelect');
    const dataSelecionada = selectData ? selectData.value : 'Data não informada';
    
    const textoData = selectData && selectData.options[selectData.selectedIndex] 
        ? selectData.options[selectData.selectedIndex].text 
        : dataSelecionada;

    const checkboxesMarcados = document.querySelectorAll('input.Presente:checked');
    const listaPresenca = [];

    checkboxesMarcados.forEach((caixa) => {
        listaPresenca.push(caixa.value);
    });

    const novoRegistro = {
        dataId: dataSelecionada,
        dataTexto: textoData,
        presentes: listaPresenca,
        dataHoraEnvio: new Date().toLocaleString('pt-BR')
    };

    // Pega os registros antigos ou cria uma lista vazia
    const registrosAntigos = JSON.parse(localStorage.getItem('registrosChamada')) || [];

    // Adiciona ou atualiza o registro da mesma data para evitar duplicatas do mesmo dia
    const indexExistente = registrosAntigos.findIndex(r => r.dataId === dataSelecionada);
    if (indexExistente >= 0) {
        registrosAntigos[indexExistente] = novoRegistro;
    } else {
        registrosAntigos.push(novoRegistro);
    }

    // Salva no localStorage
    localStorage.setItem('registrosChamada', JSON.stringify(registrosAntigos));

    alert("Chamada registrada com sucesso para " + listaPresenca.length + " aluno(s)!");
    
    // Opcional: redireciona para a página de registros automaticamente
    // window.location.href = 'registro.html';
}

// Inicializa as funções quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
    carregarDomingosDoMes();

    const botaoRegistrar = document.querySelector("button");
    if (botaoRegistrar) {
        botaoRegistrar.addEventListener("click", registrarChamada);
    }
});


//REGISTROS 
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('containerRegistros');
    if (!container) return;

    const TOTAL_ALUNOS = 70;
    const registros = JSON.parse(localStorage.getItem('registrosChamada')) || [];

    if (registros.length === 0) {
        container.innerHTML = '<p>Nenhum registro encontrado ainda.</p>';
        return;
    }

    container.innerHTML = '';

    // Ordena os registros por data
    registros.sort((a, b) => new Date(a.dataId) - new Date(b.dataId));

    // Percorre cada registro e cria uma DIV separada para cada domingo
    registros.forEach((reg) => {
        const divDomingo = document.createElement('div');
        divDomingo.className = 'card-domingo';
        divDomingo.style.border = '1px solid #ccc';
        divDomingo.style.padding = '15px';
        divDomingo.style.marginBottom = '20px';
        divDomingo.style.borderRadius = '8px';

        const titulo = document.createElement('h3');
        titulo.textContent = `Domingo: ${reg.dataTexto}`;

        // 1 e 2. Presentes e Proporção
        const totalPresentes = reg.presentes.length;
        const proporcaoPresentes = `${totalPresentes}/${TOTAL_ALUNOS}`;
        
        const infoPresentes = document.createElement('p');
        infoPresentes.innerHTML = `<strong>1. Presentes (${proporcaoPresentes}):</strong> ${totalPresentes > 0 ? reg.presentes.join(', ') : 'Nenhum'}`;

        // 3. Descobrir ausentes comparando com o total de 70
        const ausentes = [];
        for (let i = 1; i <= TOTAL_ALUNOS; i++) {
            if (!reg.presentes.includes(String(i))) {
                ausentes.push(i);
            }
        }

        // 4. Ausentes e Proporção
        const totalAusentes = ausentes.length;
        const proporcaoAusentes = `${totalAusentes}/${TOTAL_ALUNOS}`;

        const infoAusentes = document.createElement('p');
        infoAusentes.innerHTML = `<strong>3. Ausentes (${proporcaoAusentes}):</strong> ${ausentes.join(', ')}`;

        const infoEnvio = document.createElement('p');
        infoEnvio.style.fontSize = '0.85em';
        infoEnvio.style.color = '#666';
        infoEnvio.innerHTML = `<em>Enviado em: ${reg.dataHoraEnvio}</em>`;

        // Monta a estrutura dentro da div
        divDomingo.appendChild(titulo);
        divDomingo.appendChild(infoPresentes);
        divDomingo.appendChild(infoAusentes);
        divDomingo.appendChild(infoEnvio);

        container.appendChild(divDomingo);
    });
});
