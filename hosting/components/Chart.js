import styles from '/styles/components/chart.module.css'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
)

import { Line } from 'react-chartjs-2'

export default (props) => {
  const generateData = (viewsPerDay, totalDays) => {
    const totalViewsArray = [viewsPerDay]

    for(let i = 1; i < totalDays ; i++) {
      const videoCount = i + 1
      const totalViews = totalViewsArray[i - 1] + (videoCount * viewsPerDay)
      totalViewsArray.push(totalViews)
    }
    return totalViewsArray
  }

  const options = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Test this text over this test',
        color: 'white',
        font: { size: 18 },
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 1,
        borderColor: 'lightblue',
        fill: 'start',
        backgroundColor: 'lightblue',
      },
      point: {
        radius: 10,
        hitRadius: 10,
      }
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: 'white'
        },
      },
      y: {
        display: true,
        ticks: {
          color: 'white'
        },
      },
    },
  }

  const defaultData = {
    labels: [...Array(100).keys()],
    datasets: [
      {data: generateData(10, 100)}
    ]
  }

  return (
    <div className={styles.container}>
      <Line data={defaultData} width={100} height={40} options={options} />
    </div>
  )
}
