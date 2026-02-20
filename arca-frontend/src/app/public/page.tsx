import React from 'react';
import styles from './public.module.css';

export default function PublicPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bem-vindo ao ARCA</h1>
        <p className={styles.subtitle}>
          Sistema de Gestão Educacional - Página Pública
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Sobre o Sistema</h2>
          <p>
            O ARCA é um sistema completo de gestão educacional que oferece 
            funcionalidades para administração de escolas, usuários, permissões 
            e muito mais.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Funcionalidades</h2>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h3>🏫 Gestão de Escolas</h3>
              <p>Administre informações completas sobre instituições de ensino.</p>
            </div>
            <div className={styles.feature}>
              <h3>👥 Gestão de Usuários</h3>
              <p>Controle de acesso e perfis de usuários do sistema.</p>
            </div>
            <div className={styles.feature}>
              <h3>🔐 Controle de Permissões</h3>
              <p>Sistema robusto de roles e permissões para segurança.</p>
            </div>
            <div className={styles.feature}>
              <h3>📞 Gestão de Contatos</h3>
              <p>Mantenha informações de contato organizadas e atualizadas.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Informações de Contato</h2>
          <div className={styles.contact}>
            <p>📧 Email: contato@arca.edu.br</p>
            <p>📱 Telefone: (11) 1234-5678</p>
            <p>🌐 Website: www.arca.edu.br</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2025 ARCA - Sistema de Gestão Educacional. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}