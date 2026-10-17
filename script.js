function carregarDomingosDoMes() {
    const select = document.getElementById('dataSelect');
    if (!select) return;

    select.innerHTML = '';

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    const totalDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

    for (let dia = 1; dia <= totalDiasNoMes; dia++) {
        const data = new Date(anoAtual, mesAtual, dia);

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

function registrarChamada() {
    const selectData = document.getElementById('dataSelect');
    const dataSelecionada = selectData ? selectData.value : 'Data não informada';
    
    const textoData = selectData && selectData.options[selectData.selectedIndex] 
        ? selectData.options[selectData.selectedIndex].text 
        : dataSelecionada;

    const selectTurno = document.getElementById('turnoSelect');
    const turnoSelecionado = selectTurno ? selectTurno.value : 'Manhã';

    const idUnico = `${dataSelecionada}-${turnoSelecionado}`;
    const textoCompleto = `${textoData} (${turnoSelecionado})`;

    const checkboxesMarcados = document.querySelectorAll('input.Presente:checked');
    const listaPresenca = [];

    checkboxesMarcados.forEach((caixa) => {
        listaPresenca.push(caixa.value);
    });

    const novoRegistro = {
        dataId: idUnico,
        dataTexto: textoCompleto,
        presentes: listaPresenca,
        dataHoraEnvio: new Date().toLocaleString('pt-BR')
    };

    const registrosAntigos = JSON.parse(localStorage.getItem('registrosChamada')) || [];

    const indexExistente = registrosAntigos.findIndex(r => r.dataId === idUnico);
    if (indexExistente >= 0) {
        registrosAntigos[indexExistente] = novoRegistro;
    } else {
        registrosAntigos.push(novoRegistro);
    }

    localStorage.setItem('registrosChamada', JSON.stringify(registrosAntigos));

    alert("Chamada registrada com sucesso para " + listaPresenca.length + " (" + turnoSelecionado + ")!");

    checkboxesMarcados.forEach((caixa) => {
        caixa.checked = false;
    });

    if (selectData && selectData.options.length > 0) {
        selectData.selectedIndex = 0;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarDomingosDoMes();

    const botaoRegistrar = document.querySelector("button");
    if (botaoRegistrar) {
        botaoRegistrar.addEventListener("click", registrarChamada);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('containerRegistros');
    if (!container) return;

    const nomesAlunos = {
        
    };

    function obterFormatado(numero) {
        const nome = nomesAlunos[numero] || "Name";
        return `${numero} ${nome}`;
    }

    const TOTAL_ALUNOS = 70;

    function carregarTelaRegistros() {
        const registros = JSON.parse(localStorage.getItem('registrosChamada')) || [];

        if (registros.length === 0) {
            container.innerHTML = '<p>Nenhum registro encontrado ainda.</p>';
            return;
        }

        container.innerHTML = '';

        registros.sort((a, b) => new Date(a.dataId) - new Date(b.dataId));

        registros.forEach((reg) => {
            const divDomingo = document.createElement('div');
            divDomingo.className = 'card-domingo';
            divDomingo.style.border = '1px solid #ccc';
            divDomingo.style.padding = '15px';
            divDomingo.style.marginBottom = '20px';
            divDomingo.style.borderRadius = '8px';

            const titulo = document.createElement('h3');
            titulo.textContent = `Domingo: ${reg.dataTexto}`;

            const totalPresentes = reg.presentes.length;
            const proporcaoPresentes = `${totalPresentes}/${TOTAL_ALUNOS}`;
            
            const infoPresentes = document.createElement('p');
            infoPresentes.innerHTML = `<strong>1. Pessoas presentes:</strong>`;

            const listaPresentesBox = document.createElement('div');
            listaPresentesBox.style.marginLeft = '10px';
            listaPresentesBox.style.marginBottom = '10px';
            if (reg.presentes.length > 0) {
                reg.presentes.forEach(num => {
                    const item = document.createElement('p');
                    item.style.margin = '2px 0';
                    item.textContent = obterFormatado(num);
                    listaPresentesBox.appendChild(item);
                });
            } else {
                listaPresentesBox.textContent = 'Nenhum';
            }

            const infoQtdPresentes = document.createElement('p');
            infoQtdPresentes.innerHTML = `<strong>2. Proporção de presentes:</strong> ${proporcaoPresentes}`;

            const ausentesNumeros = [];
            for (let i = 1; i <= TOTAL_ALUNOS; i++) {
                if (!reg.presentes.includes(String(i))) {
                    ausentesNumeros.push(i);
                }
            }

            const totalAusentes = ausentesNumeros.length;
            const proporcaoAusentes = `${totalAusentes}/${TOTAL_ALUNOS}`;

            const infoAusentes = document.createElement('p');
            infoAusentes.innerHTML = `<strong>3. Pessoas ausentes:</strong>`;

            const listaAusentesBox = document.createElement('div');
            listaAusentesBox.style.marginLeft = '10px';
            listaAusentesBox.style.marginBottom = '10px';
            if (ausentesNumeros.length > 0) {
                ausentesNumeros.forEach(num => {
                    const item = document.createElement('p');
                    item.style.margin = '2px 0';
                    item.textContent = obterFormatado(String(num));
                    listaAusentesBox.appendChild(item);
                });
            } else {
                listaAusentesBox.textContent = 'Nenhum';
            }

            const infoQtdAusentes = document.createElement('p');
            infoQtdAusentes.innerHTML = `<strong>4. Proporção de ausentes:</strong> ${proporcaoAusentes}`;

            const infoEnvio = document.createElement('p');
            infoEnvio.style.fontSize = '0.85em';
            infoEnvio.style.color = '#666';
            infoEnvio.innerHTML = `<em>Enviado em: ${reg.dataHoraEnvio}</em>`;

            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = 'Excluir Registro';
            btnExcluir.style.marginTop = '10px';
            btnExcluir.style.backgroundColor = '#ff6b6b';
            btnExcluir.style.color = 'white';
            btnExcluir.style.border = 'none';
            btnExcluir.style.padding = '8px 12px';
            btnExcluir.style.borderRadius = '5px';
            btnExcluir.style.cursor = 'pointer';

            btnExcluir.addEventListener('click', () => {
                const confirmar = confirm(`Tem certeza que deseja excluir o registro do dia ${reg.dataTexto}?`);
                if (confirmar) {
                    let listaAtual = JSON.parse(localStorage.getItem('registrosChamada')) || [];
                    listaAtual = listaAtual.filter(r => r.dataId !== reg.dataId);
                    localStorage.setItem('registrosChamada', JSON.stringify(listaAtual));
                    carregarTelaRegistros();
                }
            });

            divDomingo.appendChild(titulo);
            divDomingo.appendChild(infoPresentes);
            divDomingo.appendChild(listaPresentesBox);
            divDomingo.appendChild(infoQtdPresentes);
            divDomingo.appendChild(infoAusentes);
            divDomingo.appendChild(listaAusentesBox);
            divDomingo.appendChild(infoQtdAusentes);
            divDomingo.appendChild(infoEnvio);
            divDomingo.appendChild(btnExcluir);

            container.appendChild(divDomingo);
        });
    }

    carregarTelaRegistros();
});
