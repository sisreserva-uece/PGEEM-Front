'use client';

const sections = [
  {
    id: 'collection',
    title: '1. Informações que Coletamos',
    content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    bullets: [
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit',
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur',
      'Ut labore et dolore magnam aliquam quaerat voluptatem exercitationem',
    ],
  },
  {
    id: 'usage',
    title: '2. Como Usamos seus Dados',
    content:
            'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    bullets: [
      'Nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit',
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus',
      'Itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis',
    ],
  },
  {
    id: 'sharing',
    title: '3. Compartilhamento de Dados',
    content:
            'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
    bullets: [
      'Quis nostrum exercitationem ullam corporis suscipit laboriosam',
      'Nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure',
      'Vel illum dolorem eum fugiat quo voluptas nulla pariatur excepturi',
    ],
  },
  {
    id: 'rights',
    title: '4. Seus Direitos',
    content:
            'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
    bullets: [
      'Direito de acesso — Lorem ipsum dolor sit amet consectetur adipiscing',
      'Direito de exclusão — Adipiscing elit sed do eiusmod tempor incididunt',
      'Direito de portabilidade — Ut labore et dolore magna aliqua ut enim',
    ],
  },
  {
    id: 'contact',
    title: '5. Contato',
    content:
            'Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi consequatur. Para dúvidas sobre esta política, entre em contato:',
    bullets: [],
  },
];

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Política de Privacidade</h1>
          <span className="text-sm text-gray-500">Atualizado em 30/04/2026</span>
        </div>

        {/* Intro banner */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-blue-700 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Esta política descreve como coletamos,
            usamos e protegemos suas informações pessoais.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.id} className="border border-gray-100 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm mb-3">{section.content}</p>

              {section.bullets.length > 0 && (
                <ul className="space-y-1">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {/* Contact info */}
              {section.id === 'contact' && (
                <div className="bg-green-50 p-3 rounded-lg mt-3">
                  <div className="space-y-1 text-sm text-green-700">
                    <p>
                      <strong>E-mail:</strong>
                      {' '}
                      privacidade@empresa.com.br
                    </p>
                    <p>
                      <strong>Endereço:</strong>
                      {' '}
                      Lorem ipsum, 123 — Fortaleza, CE
                    </p>
                    <p>
                      <strong>Horário:</strong>
                      {' '}
                      Segunda a sexta, das 9h às 18h
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Ao continuar usando o sistema de gestão de espaços, você concorda com os termos desta
            política. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.
          </p>
        </div>
      </div>
    </div>
  );
}
