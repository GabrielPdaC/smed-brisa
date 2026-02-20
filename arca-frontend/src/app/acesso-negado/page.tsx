'use client';

import { useRouter } from 'next/navigation';
import styles from './acesso-negado.module.css';

export default function AcessoNegado() {
  const router = useRouter();

  const handleVoltar = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Acesso Negado</h1>
        <p className={styles.message}>
          Você não tem permissão para acessar esta página.
        </p>
        <button onClick={handleVoltar} className={styles.button}>
          Voltar
        </button>
      </div>
    </div>
  );
}
