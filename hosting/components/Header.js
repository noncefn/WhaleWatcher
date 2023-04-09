import styles from '/styles/components/header.module.css'

export default function Header(props) {
  const data = props.data 
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.logo}>
          Whale Watcher
        </div>
        <button>
          버튼
        </button>
      </div>
    </div>
  )
}
