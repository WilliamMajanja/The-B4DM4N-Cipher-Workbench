let freqCipherChart = null;
let freqDecryptedChart = null;
let iocChart = null;

const chartColors = {
  grid: '#4A5568',
  freqBar: '#68D391',
  iocBar: '#81E6D9',
  tooltipBg: 'rgba(26, 32, 44, 0.95)',
  tooltipBorder: '#4A5568',
};

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: chartColors.tooltipBg,
      borderColor: chartColors.tooltipBorder,
      borderWidth: 1,
      titleColor: '#E2E8F0',
      bodyColor: '#CBD5E0',
      cornerRadius: 6,
    },
  },
  scales: {
    x: {
      grid: { color: chartColors.grid, drawBorder: false },
      ticks: { color: '#A0AEC0' },
    },
    y: {
      grid: { color: chartColors.grid, drawBorder: false },
      ticks: { color: '#A0AEC0', beginAtZero: true },
    },
  },
};

function initFrequencyCharts() {
  const cipherCtx = document.getElementById('freq-cipher-chart');
  const decryptedCtx = document.getElementById('freq-decrypted-chart');

  if (freqCipherChart) freqCipherChart.destroy();
  if (freqDecryptedChart) freqDecryptedChart.destroy();

  const makeDataset = (label) => ({
    label,
    data: [],
    backgroundColor: chartColors.freqBar,
    borderRadius: 4,
  });

  freqCipherChart = new Chart(cipherCtx, {
    type: 'bar',
    data: {
      labels: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      datasets: [makeDataset('Ciphertext Frequency')],
    },
    options: chartDefaults,
  });

  freqDecryptedChart = new Chart(decryptedCtx, {
    type: 'bar',
    data: {
      labels: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      datasets: [makeDataset('Decrypted Frequency')],
    },
    options: chartDefaults,
  });
}

function updateFrequencyCharts(frequencies, decryptedFrequencies) {
  if (!freqCipherChart || !freqDecryptedChart) return;

  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  freqCipherChart.data.datasets[0].data = labels.map(
    (l) => frequencies[l] || 0
  );
  freqCipherChart.update('none');

  freqDecryptedChart.data.datasets[0].data = labels.map(
    (l) => decryptedFrequencies[l] || 0
  );
  freqDecryptedChart.update('none');
}

function initIocChart() {
  const ctx = document.getElementById('ioc-chart');
  if (iocChart) iocChart.destroy();

  iocChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from({ length: 19 }, (_, i) => String(i + 2)),
      datasets: [
        {
          label: 'Index of Coincidence',
          data: [],
          backgroundColor: chartColors.iocBar,
          borderRadius: 4,
        },
      ],
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        x: {
          ...chartDefaults.scales.x,
          title: { display: true, text: 'Key Length', color: '#A0AEC0' },
        },
        y: {
          ...chartDefaults.scales.y,
          title: {
            display: true,
            text: 'Average IoC',
            color: '#A0AEC0',
          },
        },
      },
    },
  });
}

function updateIocChart(iocData) {
  if (!iocChart) return;

  const labels = Array.from({ length: 19 }, (_, i) => String(i + 2));
  iocChart.data.datasets[0].data = labels.map(
    (_, i) => (iocData && iocData[i + 2]) || 0
  );
  iocChart.update('none');
}
