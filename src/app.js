document.getElementById('btnAnalyze').addEventListener('click', function() {
    // Capturar inputs
    const pair = document.getElementById('currencyPair').value;
    const timeframe = parseInt(document.getElementById('timeframe').value);
    const payout = parseFloat(document.getElementById('payout').value) / 100;
    const bankroll = parseFloat(document.getElementById('bankroll').value);
    const entryValue = parseFloat(document.getElementById('entryValue').value);

    // 1. Cálculo do Break-even (Taxa mínima para não perder dinheiro)
    // Fórmula: 1 / (1 + Payout)
    const breakEven = (1 / (1 + payout)) * 100;

    // 2. Simulação de cenários com base no ativo e tempo
    // Ativos em prazos de 1 minuto têm maior ruído (aleatoriedade maior)
    // Prazos de 5 a 15 minutos respeitam mais zonas de suporte/resistência técnica
    let estimatedWinRate = 54.0; // Taxa padrão realista de análise técnica sem robôs milagrosos
    
    if (timeframe === 1) {
        estimatedWinRate -= 3.5; // Ruído alto em 1 minuto dificulta consistência
    } else if (timeframe >= 5) {
        estimatedWinRate += 2.0; // Menor ruído estatístico
    }

    // Ajuste por paridade (exemplo de volatilidade histórica simulada)
    if (pair === 'BTCUSD') {
        estimatedWinRate -= 2.0; // Cripto tem alta volatilidade errática
    }

    // 3. Expectativa Matemática por operação (EV) considerando a taxa estimada
    // EV = (WinRate * Payout) - (LossRate * 1)
    const winProb = estimatedWinRate / 100;
    const lossProb = 1 - winProb;
    const evPerTrade = (winProb * payout * entryValue) - (lossProb * entryValue);

    // 4. Projeção financeira para 100 operações usando stake fixa
    const totalTraded = entryValue * 100;
    const estimatedProfit = evPerTrade * 100;
    const finalBankroll = bankroll + estimatedProfit;

    // Renderizar resultados na tela
    document.getElementById('breakevenRate').innerText = `${breakEven.toFixed(2)}%`;
    
    const evElement = document.getElementById('evValue');
    evElement.innerText = `R$ ${evPerTrade.toFixed(2)} por operação`;
    evElement.style.color = evPerTrade >= 0 ? 'var(--success)' : 'var(--danger)';

    const projElement = document.getElementById('projectionValue');
    projElement.innerText = `R$ ${finalBankroll.toFixed(2)} (Lucro/Prejuízo: R$ ${estimatedProfit.toFixed(2)})`;
    projElement.style.color = estimatedProfit >= 0 ? 'var(--success)' : 'var(--danger)';

    // 5. Análise de Cenário Inteligente
    let adviceHTML = `<strong>Análise para ${pair} em ${timeframe}m:</strong><br>`;
    
    if (breakEven > 56) {
        adviceHTML += `⚠️ **Atenção:** Com um payout de ${(payout*100).toFixed(0)}%, o mercado exige que você acerte mais de ${breakEven.toFixed(1)}% das operações apenas para empatar. Isso é estatisticamente muito difícil de manter no longo prazo.<br>`;
    } else {
        adviceHTML += `✅ O payout de ${(payout*100).toFixed(0)}% exige uma assertividade acima de ${breakEven.toFixed(1)}% para gerar lucro.<br>`;
    }

    if (timeframe === 1) {
        adviceHTML += `💡 **Dica de Cenário:** Operações de 1 minuto possuem altíssimo ruído de preço (*micro-fluctuations*), o que reduz a eficácia da análise técnica pura. Considere migrar para gráficos de 5 ou 15 minutos para filtrar falsos rompimentos.`;
    } else {
        adviceHTML += `💡 **Dica de Cenário:** O tempo de ${timeframe} minutos selecionado oferece um respiro melhor para validação de tendência e zonas de preço. Mantenha uma gestão de risco rigorosa (máximo de 2% a 3% da banca por entrada).`;
    }

    document.getElementById('aiAdvice').innerHTML = adviceHTML;
});