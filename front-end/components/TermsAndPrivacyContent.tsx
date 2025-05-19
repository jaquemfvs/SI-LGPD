
import React from 'react';

const TermsAndPrivacyContent: React.FC = () => {
  return (
    <div className="prose max-w-none">
      <h1 className="text-2xl font-bold mb-4">Termos e Condições e Política de Privacidade</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Termos e Condições</h2>
        <p className="mb-2 text-sm text-gray-500">Última atualização: 19 de maio de 2025</p>
        <p className="mb-3">
          Bem-vindo ao nosso site! Ao acessar ou usar nosso serviço, você concorda em ficar vinculado por estes Termos e Condições. Se você não concordar com qualquer parte dos termos, então você não poderá acessar o serviço.
        </p>
        <h3 className="text-lg font-semibold mb-1">1. Uso do Serviço</h3>
        <p className="mb-3">
          Você concorda em usar o serviço apenas para fins legais e de acordo com estes Termos. Você concorda em não usar o serviço:
          <ul className="list-disc list-inside ml-4">
            <li>De qualquer forma que viole qualquer lei ou regulamento aplicável.</li>
            <li>Para explorar, prejudicar ou tentar explorar ou prejudicar menores de qualquer forma.</li>
            <li>Para transmitir ou obter o envio de qualquer material publicitário ou promocional, incluindo qualquer "junk mail", "chain letter", "spam" ou qualquer outra solicitação semelhante.</li>
          </ul>
        </p>
        <h3 className="text-lg font-semibold mb-1">2. Contas</h3>
        <p className="mb-3">
          Ao criar uma conta conosco, você deve nos fornecer informações precisas, completas e atuais em todos os momentos. A falha em fazê-lo constitui uma violação dos Termos, o que pode resultar na rescisão imediata de sua conta em nosso serviço.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Política de Privacidade</h2>
        <p className="mb-2 text-sm text-gray-500">Última atualização: 19 de maio de 2025</p>
        <p className="mb-3">
          Sua privacidade é importante para nós. É política de nossa empresa respeitar sua privacidade em relação a qualquer informação que possamos coletar de você em nosso site.
        </p>
        <h3 className="text-lg font-semibold mb-1">1. Informações que Coletamos</h3>
        <p className="mb-3">
          Coletamos informações pessoais que você nos fornece voluntariamente ao se registrar no site, expressar interesse em obter informações sobre nós ou nossos produtos e serviços, ao participar de atividades no site ou de outra forma entrar em contato conosco.
        </p>
        <h3 className="text-lg font-semibold mb-1">2. Como Usamos Suas Informações</h3>
        <p className="mb-3">
          Usamos as informações pessoais coletadas por meio de nosso site para diversos fins comerciais descritos abaixo. Processamos suas informações pessoais para esses fins com base em nossos interesses comerciais legítimos, a fim de celebrar ou executar um contrato com você, com o seu consentimento e/ou para o cumprimento de nossas obrigações legais.
          <ul className="list-disc list-inside ml-4">
            <li>Para facilitar a criação de contas e o processo de logon.</li>
            <li>Para enviar informações administrativas para você.</li>
            <li>Para proteger nossos Serviços.</li>
            <li>Para responder a solicitações legais e prevenir danos.</li>
          </ul>
        </p>
      </section>
    </div>
  );
};

export default TermsAndPrivacyContent;
