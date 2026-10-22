import React, { useState, useEffect, useRef } from 'react';

interface Collaborator {
  id: string;
  name: string;
  cpf: string;
  matricula: string;
  birthDate: string;
  gender: string;
  admissionDate: string;
  status: 'Ativo' | 'Afastado' | 'Férias';
  cargo: string;
  cbo: string;
  setor: string;
  unidade: string;
  cnpjUnidade: string;
  categoriaEsocial: string;
}

export default function App() {
  // Global States
  const [step1Complete, setStep1Complete] = useState<boolean>(false);
  const [step2Complete, setStep2Complete] = useState<boolean>(false);
  const [step3Complete, setStep3Complete] = useState<boolean>(false);

  // Company Details
  const [companyName, setCompanyName] = useState<string>("Koima Fashion Confecções");
  const [companyCnpj, setCompanyCnpj] = useState<string>("15.464.747/0001-78");
  const [isEditingCompany, setIsEditingCompany] = useState<boolean>(false);
  
  // Modals, Alerts, and Display States
  const [isBannerHidden, setIsBannerHidden] = useState<boolean>(false);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState<boolean>(false);
  const [isImportValidationModalOpen, setIsImportValidationModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Collaborators List
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Carlos Eduardo Rocha',
      cpf: '142.890.319-45',
      matricula: '#0142',
      birthDate: '1988-05-14',
      gender: 'M',
      admissionDate: '2020-02-10',
      status: 'Ativo',
      cargo: 'Costureiro Geral',
      cbo: '7632-10',
      setor: 'Corte & Costura',
      unidade: 'Matriz Ponta Grossa',
      cnpjUnidade: '15.464.747/0001-78',
      categoriaEsocial: '101 - Empregado Geral'
    },
    {
      id: '2',
      name: 'Aline Beatriz Freitas',
      cpf: '089.432.119-02',
      matricula: '#0143',
      birthDate: '1995-11-22',
      gender: 'F',
      admissionDate: '2021-06-15',
      status: 'Ativo',
      cargo: 'Auxiliar de Expedição',
      cbo: '4141-05',
      setor: 'Logística',
      unidade: 'Matriz Ponta Grossa',
      cnpjUnidade: '15.464.747/0001-78',
      categoriaEsocial: '101 - Empregado Geral'
    },
    {
      id: '3',
      name: 'Renato Ribeiro Souza',
      cpf: '321.765.989-11',
      matricula: '#0144',
      birthDate: '1990-08-05',
      gender: 'M',
      admissionDate: '2019-10-01',
      status: 'Ativo',
      cargo: 'Mecânico de Manutenção',
      cbo: '9113-05',
      setor: 'Manutenção',
      unidade: 'Matriz Ponta Grossa',
      cnpjUnidade: '15.464.747/0001-78',
      categoriaEsocial: '101 - Empregado Geral'
    }
  ]);

  // Form State for New Collaborator
  const [newCollab, setNewCollab] = useState<Omit<Collaborator, 'id'>>({
    name: '',
    cpf: '',
    matricula: '',
    birthDate: '',
    gender: '',
    admissionDate: '',
    status: 'Ativo',
    cargo: '',
    cbo: '',
    setor: '',
    unidade: 'Matriz Ponta Grossa',
    cnpjUnidade: '15.464.747/0001-78',
    categoriaEsocial: '101'
  });

  // Simulated Video Player States
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState<number>(0);
  const videoDuration = 195; // 3 minutes 15 seconds
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // File Upload States
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatusStep, setUploadStatusStep] = useState<string>("");
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>("");
  const [showUploadStatus, setShowUploadStatus] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Procuração File Upload States
  const [procuracaoFile, setProcuracaoFile] = useState<string | null>(null);
  const [isUploadingProcuracao, setIsUploadingProcuracao] = useState<boolean>(false);
  const procuracaoFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Procuração File Upload
  const handleProcuracaoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProcuracao(true);
    setTimeout(() => {
      setProcuracaoFile(file.name);
      setIsUploadingProcuracao(false);
      setStep3Complete(true);
      showToastMsg(`Comprovante "${file.name}" enviado com sucesso! Outorga e-CAC confirmada.`);
    }, 1200);
  };

  // Helper: Show Toast
  const showToastMsg = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Progress Calculations
  const completedStepsCount = [step1Complete, step2Complete, step3Complete].filter(Boolean).length;
  const progressPercent = Math.max(0, Math.round((completedStepsCount / 3) * 100));

  // Video Simulated Playback Tick
  useEffect(() => {
    if (videoPlaying) {
      videoIntervalRef.current = setInterval(() => {
        setVideoTime((prev) => {
          if (prev >= videoDuration) {
            setVideoPlaying(false);
            setStep1Complete(true);
            showToastMsg("Vídeo assistido integralmente! Passo 1 concluído.");
            if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
            return videoDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    }
    return () => {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    };
  }, [videoPlaying]);

  // Handle format time helper
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Handle Play Click
  const handlePlayVideo = () => {
    setVideoPlaying(!videoPlaying);
    if (!videoPlaying) {
      showToastMsg("Reproduzindo vídeo institucional...", "info");
    }
  };

  // Handle Fast Forward / Force complete Video
  const handleCompleteVideo = () => {
    setVideoTime(videoDuration);
    setVideoPlaying(false);
    setStep1Complete(true);
    showToastMsg("Vídeo marcado como assistido! Passo 1 validado com sucesso.");
  };

  // Toggle Video State Manual Checkbox Click
  const handleToggleStep1 = () => {
    if (step1Complete) {
      setStep1Complete(false);
      setVideoTime(0);
      showToastMsg("Passo 1 redefinido.", "info");
    } else {
      setStep1Complete(true);
      setVideoTime(videoDuration);
      showToastMsg("Passo 1 concluído!", "success");
    }
  };

  // Handle Copy CNPJ
  const handleCopyCNPJ = () => {
    navigator.clipboard.writeText("12.345.678/0001-90");
    showToastMsg("CNPJ da Reque SST (12.345.678/0001-90) copiado para a área de transferência!");
  };

  // Toggle step 3 proxy
  const handleToggleStep3 = () => {
    const nextState = !step3Complete;
    setStep3Complete(nextState);
    if (nextState) {
      showToastMsg("Procuração eletrônica confirmada pelo cliente! Passo 3 concluído.");
    } else {
      showToastMsg("Passo 3 redefinido.", "info");
    }
  };

  // Handle Adding Collaborator from Form
  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollab.name || !newCollab.cpf || !newCollab.matricula) {
      showToastMsg("Preencha todos os campos obrigatórios!", "error");
      return;
    }

    const createdCollab: Collaborator = {
      id: Date.now().toString(),
      ...newCollab
    };

    setCollaborators([...collaborators, createdCollab]);
    showToastMsg(`Colaborador ${newCollab.name} adicionado à lista temporária!`);
    
    // Reset core form values while maintaining some defaults
    setNewCollab({
      name: '',
      cpf: '',
      matricula: '',
      birthDate: '',
      gender: '',
      admissionDate: '',
      status: 'Ativo',
      cargo: '',
      cbo: '',
      setor: '',
      unidade: 'Matriz Ponta Grossa',
      cnpjUnidade: '15.464.747/0001-78',
      categoriaEsocial: '101'
    });
  };

  // Delete collaborator
  const handleDeleteCollaborator = (id: string, name: string) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
    showToastMsg(`Colaborador ${name} removido da lista.`, "info");
  };

  // Simulate Excel Upload
  const triggerExcelSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatusStep("Lendo arquivo Excel...");

    setTimeout(() => {
      setUploadProgress(40);
      setUploadStatusStep("Validando layout padrão (Modelo 1 - Carga de Vidas)...");
    }, 800);

    setTimeout(() => {
      setUploadProgress(75);
      setUploadStatusStep("Cruzando dados cadastrais com regras eSocial...");
    }, 1600);

    setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      
      // Add mock employees from spreadsheet
      const uploadedMockEmployees: Collaborator[] = [
        {
          id: 'mock-u-1',
          name: 'Juliana Mendes Vieira',
          cpf: '241.983.472-11',
          matricula: '#0145',
          birthDate: '1993-03-24',
          gender: 'F',
          admissionDate: '2022-01-15',
          status: 'Ativo',
          cargo: 'Analista de Qualidade',
          cbo: '3111-05',
          setor: 'Garantia de Qualidade',
          unidade: 'Matriz Ponta Grossa',
          cnpjUnidade: '15.464.747/0001-78',
          categoriaEsocial: '101 - Empregado Geral'
        },
        {
          id: 'mock-u-2',
          name: 'Marcos Roberto Santos',
          cpf: '109.284.111-90',
          matricula: '#0146',
          birthDate: '1985-09-12',
          gender: 'M',
          admissionDate: '2018-04-01',
          status: 'Ativo',
          cargo: 'Supervisor de Corte',
          cbo: '7632-15',
          setor: 'Corte & Costura',
          unidade: 'Matriz Ponta Grossa',
          cnpjUnidade: '15.464.747/0001-78',
          categoriaEsocial: '101 - Empregado Geral'
        }
      ];

      setCollaborators(prev => [...prev, ...uploadedMockEmployees]);
      setUploadSuccessMessage(`Planilha "${file.name}" importada com sucesso! ${uploadedMockEmployees.length} colaboradores foram carregados para validação.`);
      setShowUploadStatus(true);
      setIsImportValidationModalOpen(true);
      showToastMsg(`Planilha "${file.name}" importada! Confira os dados no modal e clique em Validar Informações.`);
    }, 2400);
  };

  // Validate Imported Data from Modal
  const handleValidateImportedData = () => {
    setIsImportValidationModalOpen(false);
    setStep2Complete(true);
    setUploadSuccessMessage(`Carga de vidas validada com sucesso! ${collaborators.length} registros confirmados para o sistema SOC.`);
    showToastMsg("Informações da planilha validadas e confirmadas com sucesso!");
  };

  // Save Modal Changes
  const handleSaveAndConfirmCollaborators = () => {
    setIsCollaboratorModalOpen(false);
    setStep2Complete(true);
    setUploadSuccessMessage(`Cadastro digital finalizado com sucesso! ${collaborators.length} registros salvos e validados para o sistema SOC.`);
    setShowUploadStatus(true);
    showToastMsg("Onboarding de colaboradores salvo e enviado para a coordenação SST!");
  };

  // Reset Onboarding State
  const handleResetOnboarding = () => {
    setStep1Complete(false);
    setStep2Complete(false);
    setStep3Complete(false);
    setVideoTime(0);
    setVideoPlaying(false);
    setShowUploadStatus(false);
    setProcuracaoFile(null);
    showToastMsg("A jornada de onboarding foi reiniciada para demonstração.", "info");
  };

  // Download Model 1 Spreadsheet (.xls) standardized exactly per official attachment (image_92fee0c6.png)
  const downloadModeloPlanilha = () => {
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Modelo 1</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11px; }
          td, th { border: 1px solid #cccccc; padding: 6px; text-align: left; }
          .m-title { font-weight: bold; font-size: 14px; background-color: #ffffff; color: #000000; }
          .th-red { background-color: #FF0000; color: #000000; font-weight: bold; text-align: center; }
          .th-cyan { background-color: #00CCFF; color: #000000; font-weight: bold; text-align: center; }
          .th-white { background-color: #ffffff; color: #000000; font-weight: bold; text-align: center; }
          .bg-red { background-color: #FF0000; }
          .bg-cyan { background-color: #00CCFF; }
          .bg-white { background-color: #ffffff; }
          .obs-title { font-weight: bold; color: #000000; background-color: #f0f0f0; }
          .obs-red { color: #FF0000; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <!-- Row 1: Title -->
          <tr>
            <td class="m-title" colspan="14">Modelo 1</td>
          </tr>

          <!-- Row 2: Headers with exact colors from print -->
          <tr>
            <th class="th-white">Cod.Unid</th>
            <th class="th-red">Nome Unidade</th>
            <th class="th-red">Nome Setor</th>
            <th class="th-red">Nome Cargo</th>
            <th class="th-cyan">Matrícula</th>
            <th class="th-red">Nome Funcionário</th>
            <th class="th-red">Dt.Nascimento</th>
            <th class="th-red">Sexo</th>
            <th class="th-red">Situação</th>
            <th class="th-red">Dt.Admissão</th>
            <th class="th-cyan">CPF</th>
            <th class="th-cyan">CBO</th>
            <th class="th-cyan">CNPJ Unidade</th>
            <th class="th-cyan">Código Categoria (eSocial)</th>
          </tr>

          <!-- Sample Data Rows -->
          <tr>
            <td>1</td>
            <td>Matriz Ponta Grossa</td>
            <td>Corte &amp; Costura</td>
            <td>Costureiro Geral</td>
            <td>0142</td>
            <td>Carlos Eduardo Rocha</td>
            <td>14/05/1988</td>
            <td>M</td>
            <td>Ativo</td>
            <td>10/02/2020</td>
            <td>142.890.319-45</td>
            <td>7632-10</td>
            <td>15.464.747/0001-78</td>
            <td>101</td>
          </tr>
          <tr>
            <td>1</td>
            <td>Matriz Ponta Grossa</td>
            <td>Logística</td>
            <td>Auxiliar de Expedição</td>
            <td>0143</td>
            <td>Aline Beatriz Freitas</td>
            <td>22/11/1995</td>
            <td>F</td>
            <td>Ativo</td>
            <td>15/06/2021</td>
            <td>089.432.119-02</td>
            <td>4141-05</td>
            <td>15.464.747/0001-78</td>
            <td>101</td>
          </tr>

          <!-- Blank Row -->
          <tr><td colspan="14" style="border:none;"></td></tr>

          <!-- Legenda Header -->
          <tr>
            <td colspan="3" style="font-weight:bold; background-color:#f0f0f0; text-align:center;">LEGENDA</td>
            <td colspan="11" style="border:none;"></td>
          </tr>
          <tr>
            <td class="bg-red" style="width:25px;"></td>
            <td colspan="2">Campos obrigatórios</td>
            <td colspan="11" style="border:none;"></td>
          </tr>
          <tr>
            <td class="bg-white" style="width:25px;"></td>
            <td colspan="2">Campo opcionais</td>
            <td colspan="11" style="border:none;"></td>
          </tr>
          <tr>
            <td class="bg-cyan" style="width:25px;"></td>
            <td colspan="2">Campos obrigatórios ou opcionais dependendo da parametrização utilizada</td>
            <td colspan="11" style="border:none;"></td>
          </tr>

          <!-- Blank Row -->
          <tr><td colspan="14" style="border:none;"></td></tr>

          <!-- Observações Importantes -->
          <tr>
            <td colspan="4" class="obs-title">OBSERVAÇÕES IMPORTANTES</td>
            <td colspan="10" style="border:none;"></td>
          </tr>
          <tr>
            <td colspan="4" style="vertical-align:top;">
              <p style="margin:4px 0;">1. <span class="obs-red">NÃO</span> delete as duas primeiras linhas e <span class="obs-red">NÃO</span> apague nenhuma coluna!</p>
              <p style="margin:4px 0;">2. Se a empresa possuir as opções de obrigatoriedade dos campos habilitadas nos Parâmetros eSocial, alguns campos poderão se tornar <span class="obs-red">obrigatórios</span>, mesmo não estando destacados em vermelho ou azul nessa planilha.</p>
              <p style="margin:4px 0;">3. A maioria dos campos possui comentários. <span class="obs-red">Leia-os!</span></p>
            </td>
            <td colspan="10" style="border:none;"></td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\uFEFF' + excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "modelo_1_carga_vidas_requesst.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMsg("Planilha padronizada Modelo 1 (.xls) baixada com sucesso!");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce shadow-xl rounded-xl p-4 bg-[#1A2D69] text-white border border-blue-400 max-w-md flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-400 text-[24px]">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <div className="text-xs font-semibold">{toast.message}</div>
        </div>
      )}

      {/* HEADER COMPONENT (Fixed) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          
          {/* Logo & Company Profile */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <a className="flex items-center" href="#" onClick={(e) => { e.preventDefault(); }}>
                <img 
                  alt="Reque - Saúde e Segurança do Trabalho" 
                  className="h-9 w-auto object-contain" 
                  src="https://bitrix24public.com/reque.bitrix24.com.br/docs/pub/12698cd7307b78da1b1aecf39b6d1eb0/showFile?token=1rjl6s4h7gcz"
                />
              </a>
              <span className="hidden sm:inline-block h-6 w-[1px] bg-slate-300"></span>
              <span className="hidden sm:inline-block font-sans text-xs font-semibold uppercase tracking-wider text-slate-500">
                Portal do Cliente
              </span>
            </div>

            <div className="hidden xl:block h-8 w-[1px] bg-slate-200"></div>

            {/* Dynamic Company Details */}
            <div className="hidden xl:flex flex-col justify-center">
              <div className="flex items-center gap-2">
                {isEditingCompany ? (
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="text" 
                      value={companyName} 
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="px-2 py-0.5 text-xs font-semibold border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1A2D69]"
                    />
                    <button 
                      onClick={() => setIsEditingCompany(false)}
                      className="text-xs bg-[#1A2D69] text-white px-1.5 py-0.5 rounded hover:bg-[#162557]"
                    >
                      Salvar
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-sans text-slate-800 font-semibold truncate max-w-[200px]">
                      {companyName}
                    </span>
                    <button 
                      onClick={() => setIsEditingCompany(true)}
                      className="p-1 text-slate-400 hover:text-[#1A2D69] rounded transition-colors"
                      title="Editar nome da empresa"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      Ativo
                    </span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-1.5">
                {isEditingCompany ? (
                  <input 
                    type="text" 
                    value={companyCnpj} 
                    onChange={(e) => setCompanyCnpj(e.target.value)}
                    placeholder="CNPJ"
                    className="px-2 py-0.5 text-[10px] font-mono border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1A2D69]"
                  />
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">
                    CNPJ {companyCnpj}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Integration Journey Header Progress */}
          <div className="hidden lg:flex flex-col items-center justify-center min-w-[280px] px-4">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs uppercase text-[#1A2D69] font-bold tracking-wide">
                Jornada de Integração
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {progressPercent === 100 ? "Onboarding Concluído!" : `Passo ${completedStepsCount + 1} de 3`}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div 
                className="h-full bg-[#1A2D69] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#1A2D69] font-semibold mt-1 self-start truncate max-w-[280px]" title={
              !step1Complete ? "Fase 1: Acesso ao Portal do Cliente e Apresentação" :
              step1Complete && !step2Complete ? "Fase 2: Preenchimento do Modelo 1 (Dados da Empresa)" :
              step1Complete && step2Complete && !step3Complete ? "Fase 3: Emissão da Procuração Eletrônica (e-CAC)" : "✓ Integração Concluída!"
            }>
              {!step1Complete && "• Fase 1: Acesso ao Portal e Apresentação"}
              {step1Complete && !step2Complete && "• Fase 2: Preenchimento do Modelo 1"}
              {step1Complete && step2Complete && !step3Complete && "• Fase 3: Emissão da Procuração e-CAC"}
              {step1Complete && step2Complete && step3Complete && "✓ Integração Concluída!"}
            </span>
          </div>

          {/* Action and User Support Widget */}
          <div className="flex items-center gap-4">
            <a 
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#059669] hover:bg-[#047857] text-white transition-colors shadow-xs text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0" 
              href="https://wa.me/554230264999" 
              rel="noopener noreferrer" 
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>WhatsApp Consultor</span>
            </a>

            <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-200">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm text-slate-900 leading-tight font-semibold">
                  Mariana Silveira
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-medium">
                  Gestão RH &amp; DP
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1A2D69] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="w-full pt-28 pb-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col gap-8">
          
          {/* BANNER HERO DE BOAS-VINDAS (Gradiente Corporativo Azul Marinho) */}
          {!isBannerHidden ? (
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A2D69] via-[#162557] to-[#1e3a8a] text-white shadow-lg">
              <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
              <div className="absolute right-1/4 -bottom-24 w-80 h-80 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none"></div>
              
              <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col gap-6 max-w-4xl">
                <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-blue-200 border border-white/10">
                    <span className="material-symbols-outlined text-[18px] text-blue-300">verified</span>
                    <span className="text-xs uppercase tracking-wider font-semibold">
                      Portal Oficial de Integração do Cliente
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      setIsBannerHidden(true);
                      showToastMsg("Tela de boas-vindas ocultada.", "info");
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-blue-100 hover:text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/20 shadow-xs cursor-pointer"
                    title="Ocultar tela de boas-vindas"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                    <span>Ocultar essa tela</span>
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <h1 className="text-2xl sm:text-[2.1rem] sm:leading-tight font-bold tracking-tight text-white">
                    Seja muito bem-vindo à Reque SST! Vamos iniciar a jornada de Saúde e Segurança de sua empresa
                  </h1>
                  <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed max-w-3xl">
                    Preparamos um guia interativo simples e rápido para parametrizar seus dados, importar os colaboradores e ativar os envios ao eSocial com total segurança e conformidade legal.
                  </p>
                </div>

                {/* Progress Bar & Onboarding Timer */}
                <div className="pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <div className="flex items-center justify-between text-white/90">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Status do Onboarding Inicial
                      </span>
                      <span className="text-xs font-semibold text-blue-100">
                        {completedStepsCount} de 3 etapas concluídas ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-black/30 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
                    <span className="material-symbols-outlined text-emerald-300 text-[26px]">timer</span>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-blue-200 font-medium">Tempo Médio</span>
                      <span className="text-sm sm:text-base font-bold text-white">15 Minutos Totais</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs text-slate-700 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#1A2D69] text-[20px]">info</span>
                <span className="font-semibold text-slate-700">A tela de boas-vindas do onboarding foi ocultada.</span>
              </div>
              <button 
                onClick={() => {
                  setIsBannerHidden(false);
                  showToastMsg("Tela de boas-vindas exibida.");
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1A2D69] font-bold transition-all border border-blue-200 text-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Exibir tela de boas-vindas</span>
              </button>
            </div>
          )}

          {/* CONGRATULATIONS CARD (WHEN 100% COMPLETED) */}
          {progressPercent === 100 && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[30px]">celebration</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    Parabéns! Todas as etapas de integração foram concluídas!
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sua empresa <strong>{companyName}</strong> está totalmente pronta para a conformidade legal. A equipe de Engenharia de Segurança e Medicina Ocupacional da Reque SST iniciou a análise técnica dos seus dados. Entraremos em contato em breve para os agendamentos!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
                <button 
                  onClick={handleResetOnboarding}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all"
                >
                  Reiniciar Demonstração
                </button>
                <a 
                  className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
                  href="https://wa.me/554230264999"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">whatsapp</span>
                  Falar com o Suporte
                </a>
              </div>
            </div>
          )}

          {/* STEP 1: WELCOME VIDEO INSTITUTIONAL */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A2D69]">
                  <span className="material-symbols-outlined text-[24px]">play_circle</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1A2D69] text-[10px] font-bold uppercase border border-blue-100">
                      Passo 1
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-100">
                      Essencial
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    1. Boas-Vindas e Como Funciona a Gestão SST da Sua Empresa
                  </h2>
                </div>
              </div>

              {step1Complete && (
                <div className="sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                  <span>Etapa Concluída</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* VIDEO PLAYER COLUMN */}
              <div className="lg:col-span-7">
                <div className="relative rounded-xl overflow-hidden shadow-md bg-slate-900 aspect-video w-full border border-slate-200">
                  <iframe 
                    className="w-full h-full rounded-xl border-0"
                    src="https://www.youtube.com/embed/ftSdjjHFYMo" 
                    title="1. Boas-Vindas e Como Funciona a Gestão SST da Sua Empresa"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* VIDEO INFO AND CONFIRMATION COLUMN */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full gap-6">
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Neste vídeo rápido, a nossa equipe de Relacionamento dá as boas-vindas e explica os primeiros passos da sua gestão: a importância do preenchimento correto do Modelo 1 (Dados da Empresa) e como emitir a Procuração Eletrônica (e-CAC) para os envios de SST ao eSocial. Assista antes de prosseguir com os envios.
                  </p>

                  <div className="bg-[#f0f4fd] p-4 rounded-xl flex flex-col gap-2 border border-blue-100">
                    <span className="text-xs text-[#1A2D69] font-bold uppercase tracking-wider">
                      Pontos Principais Deste Vídeo:
                    </span>
                    <ul className="space-y-2 text-slate-600 text-xs">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-[18px]">done</span>
                        Fluxo de agendamento de ASOs Clínicos e Complementares.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-[18px]">done</span>
                        Prazos legais para envio dos eventos de SST ao eSocial.
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-[18px]">done</span>
                        Atendimento direto via WhatsApp e Central do Cliente.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${step1Complete ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}
                      onClick={handleToggleStep1}
                      type="button"
                    >
                      <span className={`material-symbols-outlined text-[20px] ${step1Complete ? 'text-emerald-700' : 'text-[#1A2D69]'}`}>
                        {step1Complete ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span>{step1Complete ? 'Assistido integralmente ✓' : 'Marcar como assistido'}</span>
                    </button>

                    {videoTime > 0 && videoTime < videoDuration && (
                      <button 
                        onClick={handleCompleteVideo}
                        className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Pular vídeo e concluir"
                      >
                        <span className="material-symbols-outlined text-[20px]">fast_forward</span>
                      </button>
                    )}
                  </div>
                  
                  <span className="text-xs text-slate-500 uppercase font-medium">
                    Obrigatório p/ validação
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* STEP 2: EMPLOYEES PLANILLA MODEL & REGISTRATION */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <span className="material-symbols-outlined text-[24px]">table_chart</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-100">
                      Passo 2
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                      Carga de Vidas
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    2. Tutorial Guiado: Como Preencher a Planilha Padrão de Colaboradores (Modelo 1)
                  </h2>
                </div>
              </div>

              {step2Complete && (
                <div className="sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold self-start sm:self-auto">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                  <span>Lista Cadastrada ✓</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* TUTORIAL INFO AND COMPANION BANNER */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative group rounded-xl overflow-hidden shadow-md bg-slate-900 aspect-video flex items-center justify-center">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7N9_rsN1BMQsEOHSQLVoJm3bppljcaxA-kDqEERJbQOCpup6len3OikOsq_nK8z-Yq6dVxExyKp7IqbdLBQPpW_BDEwjurOnhWO5oSQhgf5dA3l1Zhg5MnLpHlmo8HzfjdwPSdx5zZKPkMTJo9t4HCc4Cua7xYHfN1rzbuSZj2aDPjfR1DBBmguJZkfFszokwFbweVT-9_FEVyilbX_NiwZJl30BMKpa7lAZfJT4arjSrj2v2lS_-')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-semibold">
                      Passo a Passo em Tela
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      showToastMsg("Exibindo passo-a-passo técnico para carga de dados.", "info");
                    }}
                    className="relative z-10 w-14 h-14 rounded-full bg-[#059669] hover:bg-[#047857] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 ring-4 ring-white/20 focus:outline-none"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[32px] ml-0.5">play_arrow</span>
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-[11px]">
                    <span>Tutorial Carga em Massa SOC</span>
                    <span className="font-mono bg-black/50 px-2 py-0.5 rounded">04:40</span>
                  </div>
                </div>

                {/* Dica de Ouro Box */}
                <div className="p-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-start gap-3 shadow-xs">
                  <span className="material-symbols-outlined text-[22px] text-amber-600 mt-0.5 shrink-0">lightbulb</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-amber-900">Dica de Ouro do Consultor</span>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Se tiver dúvidas com o CBO ou descrição dos cargos, nossa equipe de suporte e engenharia valida previamente antes da emissão dos ASOs. Não trave o seu preenchimento!
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTIONS AND EXCEL TEMPLATE INSTRUCTIONS */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Para cadastrar seus colaboradores no sistema SOC e parametrizar os exames médicos (ASOs) e riscos ocupacionais, baixe a planilha padrão Modelo 1 e faça a importação do arquivo preenchido:
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#f0f4fd] border border-blue-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1A2D69] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs text-slate-800 leading-normal">
                        <strong>Download da Planilha Padrão:</strong> Baixe o arquivo modelo oficial em Excel (Modelo 1 - Carga de Vidas) contendo a estrutura de colunas exigida pelo SOC e eSocial.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f0f4fd] border border-blue-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1A2D69] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs text-slate-800 leading-normal">
                        <strong>Preenchimento Obrigatório:</strong> Preencha as colunas destacadas em vermelho na planilha: <strong>Nome Unidade, Nome Setor, Nome Cargo, Matrícula, Nome Funcionário, Dt. Nascimento, Sexo, Situação, Dt. Admissão, CPF, CBO, CNPJ Unidade e Cód. Categoria (eSocial)</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f0f4fd] border border-blue-100 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1A2D69] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs text-slate-800 leading-normal">
                        <strong>Importação do Arquivo Preenchido:</strong> Envie a planilha preenchida no campo abaixo para validação automática dos dados cadastrais e registro das vidas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions: Download & Import Excel Hub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* Download Card */}
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-2 text-[#1A2D69]">
                      <span className="material-symbols-outlined text-[24px]">download_for_offline</span>
                      <span className="text-xs font-bold uppercase tracking-wide">1. Planilha Modelo Padrão</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Arquivo Excel Modelo 1 contendo todas as colunas do padrão oficial do anexo.
                    </p>
                    <button 
                      type="button" 
                      onClick={downloadModeloPlanilha}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A2D69] hover:bg-[#162557] text-white text-xs font-bold transition-all focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>Baixar Planilha Modelo 1</span>
                    </button>
                  </div>

                  {/* Import Card */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between gap-3">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <span className="material-symbols-outlined text-[24px]">upload_file</span>
                      <span className="text-xs font-bold uppercase tracking-wide">2. Importar Planilha Preenchida</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Envie o arquivo preenchido para validação automática dos CPFs e integração no SOC.
                    </p>
                    <div className="relative w-full">
                      <input 
                        type="file" 
                        accept=".xls,.xlsx,.csv" 
                        ref={fileInputRef}
                        onChange={triggerExcelSimulation}
                        className="hidden" 
                      />
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all focus:outline-none"
                        disabled={isUploading}
                      >
                        <span className="material-symbols-outlined text-[18px]">file_upload</span>
                        <span>{isUploading ? 'Processando...' : 'Importar Planilha Preenchida'}</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Upload Simulated Progress */}
                {isUploading && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-[#1A2D69] font-semibold">
                      <span>{uploadStatusStep}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1A2D69] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Step 2 Dynamic Result Warning banner */}
                {showUploadStatus && uploadSuccessMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                    <span>{uploadSuccessMessage}</span>
                  </div>
                )}


              </div>
            </div>
          </section>

          {/* STEP 3: PROCURACAO FEDERAL / e-CAC */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A2D69]">
                  <span className="material-symbols-outlined text-[24px]">vpn_key</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1A2D69] text-[10px] font-bold uppercase border border-blue-100">
                      Passo 3
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-100">
                      eSocial Integrado
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                    3. Passo a Passo: Outorga da Procuração Eletrônica Digital (e-CAC / eSocial)
                  </h2>
                </div>
              </div>

              {step3Complete && (
                <div className="sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                  <span>Procuração Ativa ✓</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COMPANION LEFT SIDE CARD */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative group rounded-xl overflow-hidden shadow-md bg-slate-900 aspect-video flex items-center justify-center">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
                    style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAXCN_ihHkg_PHqlxAONAPnTuKv3jKlaU92JdLlB8HaZac_QkxRawVTIUCQR2QeUyALA7GYF1Jr2We2cfvSL0Bcb4adPkrXa7D9GAISBWZaa0bTJkWUlpZiaFi__T_Mquloo9DvcwqlgCJ5dpOjRGAwQxU0ak9BJUyCBZfpG1Y73ZCVvmRnoNq64iN6wlEaMM2U6aYuS_4zCwdMlwZcShXVIQTuz2z2KU85jn5jd0NES8ICxrQjvz9x')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-semibold">
                      Tutorial Oficial e-CAC
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      showToastMsg("Reproduzindo passo a passo oficial de outorga de procuração Receita Federal.", "info");
                    }}
                    className="relative z-10 w-14 h-14 rounded-full bg-[#1A2D69] hover:bg-[#162557] text-white shadow-xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-105 ring-4 ring-white/20 focus:outline-none"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[32px] ml-0.5">play_arrow</span>
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-[11px]">
                    <span>Como conceder procuração eletrônica</span>
                    <span className="font-mono bg-black/50 px-2 py-0.5 rounded">02:50</span>
                  </div>
                </div>

                {/* REQUE RECIPIENT INFORMATION */}
                <div className="p-4 rounded-xl bg-[#f0f4fd] border border-blue-100 flex flex-col gap-2 shadow-xs">
                  <span className="text-[11px] text-[#1A2D69] font-bold uppercase tracking-wider">
                    Dados Para a Procuração
                  </span>
                  
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-blue-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                        CNPJ Outorgado Reque SST
                      </span>
                      <span className="text-sm text-slate-900 font-mono font-bold">
                        12.345.678/0001-90
                      </span>
                    </div>
                    <button 
                      className="p-2 text-[#1A2D69] hover:bg-blue-50 rounded-lg transition-colors focus:outline-none" 
                      onClick={handleCopyCNPJ}
                      title="Copiar CNPJ"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">content_copy</span>
                    </button>
                  </div>
                  
                  <span className="text-[11px] text-slate-600">
                    <strong>Razão Social:</strong> Reque Saúde e Segurança Ocupacional Ltda.
                  </span>
                </div>
              </div>

              {/* INSTRUCTION STEPS RIGHT COLUMN */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Para que a Reque SST possa transmitir os eventos de Saúde e Segurança do Trabalho (<strong>S-2210</strong> de Acidente de Trabalho, <strong>S-2220</strong> de Monitoramento da Saúde e <strong>S-2240</strong> de Condições Ambientais) diretamente ao eSocial da sua empresa sem ônus ou burocracia, é necessário conceder a procuração eletrônica no portal da Receita Federal.
                </p>

                <ol className="space-y-3 font-sans text-xs">
                  <li className="p-3.5 rounded-xl bg-[#f0f4fd] border border-blue-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</span>
                    <span className="text-slate-800 leading-normal">
                      Acesse o portal e-CAC da Receita Federal utilizando o Certificado Digital da empresa (e-CNPJ ou login Gov.br Prata/Ouro do responsável).
                    </span>
                  </li>
                  <li className="p-3.5 rounded-xl bg-[#f0f4fd] border border-blue-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</span>
                    <span className="text-slate-800 leading-normal">
                      Selecione o menu <strong>&quot;Senhas e Procurações&quot;</strong> &gt; <strong>&quot;Cadastro, Consulta e Cancelamento - Procuração para o e-CAC&quot;</strong>.
                    </span>
                  </li>
                  <li className="p-3.5 rounded-xl bg-[#f0f4fd] border border-blue-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</span>
                    <span className="text-slate-800 leading-normal">
                      Cadastre o CNPJ outorgado da Reque SST: <strong className="font-mono">12.345.678/0001-90</strong> (Reque Saúde e Segurança Ocupacional Ltda).
                    </span>
                  </li>
                  <li className="p-3.5 rounded-xl bg-[#f0f4fd] border border-blue-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">4</span>
                    <span className="text-slate-800 leading-normal">
                      Marque a opção de serviço específica: <strong>&quot;eSocial - Grupo SST&quot;</strong> (Engloba a transmissão dos Eventos S-2210, S-2220, S-2240 e consultas pertinentes).
                    </span>
                  </li>
                  <li className="p-3.5 rounded-xl bg-[#f0f4fd] border border-blue-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">5</span>
                    <span className="text-slate-800 leading-normal">
                      Defina a vigência recomendada (mínimo de 1 ano ou prazo final do contrato de prestação de serviços) e assine digitalmente a procuração.
                    </span>
                  </li>
                </ol>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Quadro 1: Acessar Portal e-CAC da Receita Federal */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/90 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[#1A2D69]">
                        <span className="material-symbols-outlined text-[20px] text-[#1A2D69]">open_in_new</span>
                        <span className="text-xs font-bold uppercase tracking-wide">
                          1. Acessar Portal e-CAC
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#1A2D69] text-[10px] font-bold uppercase shrink-0">
                        Receita Federal
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Acesse o portal e-CAC com o Certificado Digital da empresa para cadastrar a procuração eletrônica à Reque SST.
                    </p>

                    <div className="relative w-full">
                      <a 
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A2D69] hover:bg-[#162557] text-white text-xs font-bold transition-all shadow-xs text-center cursor-pointer" 
                        href="https://cav.receita.fazenda.gov.br/" 
                        rel="noopener noreferrer" 
                        target="_blank"
                      >
                        <span>Acessar Portal e-CAC Receita</span>
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </a>
                    </div>
                  </div>

                  {/* Quadro de Importação do Comprovante da Outorga */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/90 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <span className="material-symbols-outlined text-[20px] text-emerald-700">upload_file</span>
                        <span className="text-xs font-bold uppercase tracking-wide">
                          2. Enviar Comprovante da Outorga
                        </span>
                      </div>
                      {step3Complete && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase shrink-0">
                          Enviado ✓
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Anexe o comprovante ou recibo em PDF/Imagem gerado pelo e-CAC para validação da procuração eSocial.
                    </p>

                    <div className="relative w-full">
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        ref={procuracaoFileInputRef}
                        onChange={handleProcuracaoFileUpload}
                        className="hidden" 
                      />
                      
                      {!procuracaoFile ? (
                        <button 
                          type="button" 
                          onClick={() => procuracaoFileInputRef.current?.click()}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs focus:outline-none cursor-pointer"
                          disabled={isUploadingProcuracao}
                        >
                          <span className="material-symbols-outlined text-[18px]">file_upload</span>
                          <span>{isUploadingProcuracao ? 'Processando Arquivo...' : 'Anexar Comprovante e-CAC (.pdf)'}</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-emerald-300 text-xs">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="material-symbols-outlined text-emerald-600 text-[18px]">task_check</span>
                            <span className="font-semibold text-slate-800 truncate" title={procuracaoFile}>
                              {procuracaoFile}
                            </span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => procuracaoFileInputRef.current?.click()}
                            className="text-[11px] text-[#1A2D69] hover:underline font-bold shrink-0 cursor-pointer"
                          >
                            Substituir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* SUPPORT AND CONTACT DEDICATED CONSULTANT CONTAINER */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 sm:p-8 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-md flex-shrink-0">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Amanda Cordeiro - Consultora Dedicada de Onboarding"
                    src="https://bitrix24public.com/reque.bitrix24.com.br/docs/pub/d1f5bc306a6f90c2081c5f249dcd625b/showFile?token=mi5cthvzsrla"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white"></div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Amanda Cordeiro</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      Online
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#1A2D69]">
                    Consultora Dedicada de Onboarding &amp; Relacionamento
                  </span>
                  <span className="text-xs text-slate-500">
                    Atendimento preferencial para <strong className="font-semibold text-slate-700">{companyName}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <a 
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#059669] text-white hover:bg-[#047857] transition-all shadow-md text-sm font-bold text-center" 
                  href="https://wa.me/554230264999" 
                  rel="noopener noreferrer" 
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-[22px]">chat</span>
                  <span>Tirar dúvidas pelo WhatsApp</span>
                </a>
                
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#f0f4fd] text-slate-600 text-xs font-medium border border-blue-100">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">bolt</span>
                  <span>Tempo médio: ~5 min</span>
                </div>
              </div>

            </div>

            {/* Quick Contact Info Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f4fd] border border-blue-100">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#1A2D69] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Linha Direta SST</span>
                  <span className="text-sm font-bold text-slate-900">42 3026-4999</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f4fd] border border-blue-100">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-[#1A2D69] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">E-mail Suporte Técnico</span>
                  <span className="text-sm font-bold text-slate-900">relacionamento@reque.com.br</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f0f4fd] border border-blue-100 sm:col-span-2 lg:col-span-1">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Plantão do Onboarding</span>
                  <span className="text-sm font-bold text-slate-900">Segunda a Sexta: 08h às 17h</span>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* FOOTER COMPONENT */}
      <footer className="w-full bg-white border-t border-slate-200 py-10 shadow-[0_-1px_6px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img 
                  alt="Reque - Saúde e Segurança do Trabalho" 
                  className="h-9 w-auto object-contain" 
                  src="https://bitrix24public.com/reque.bitrix24.com.br/docs/pub/12698cd7307b78da1b1aecf39b6d1eb0/showFile?token=1rjl6s4h7gcz"
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Soluções completas em Engenharia de Segurança, Medicina Ocupacional e conformidade legal eSocial.
              </p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f0f4fd] text-slate-700 text-xs border border-blue-100">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">verified_user</span>
                <span>Ambiente Seguro 256-bit SSL</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Atalhos da Jornada</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleResetOnboarding(); }} className="text-slate-600 hover:text-[#1A2D69] transition-colors block">
                    Reiniciar Jornada (Intro)
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsCollaboratorModalOpen(true); }} className="text-slate-600 hover:text-[#1A2D69] transition-colors block">
                    Painel de Funcionários
                  </a>
                </li>
                <li>
                  <a href="https://cav.receita.fazenda.gov.br/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#1A2D69] transition-colors block">
                    Conectar e-CAC Receita
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/554230264999" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#1A2D69] transition-colors block">
                    Fale com o Engenheiro
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Canais de Atendimento</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#1A2D69]">mail</span>
                  <span>relacionamento@reque.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#1A2D69]">phone</span>
                  <span>42 3026-4999</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">schedule</span>
                  <span>Seg a Sex: 08h às 17h</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Plantão Onboarding</h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Dúvidas no preenchimento das planilhas ou outorga da procuração eletrônica do eSocial?
              </p>
              <a 
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#059669] text-white hover:bg-[#047857] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs" 
                href="https://wa.me/554230264999" 
                rel="noopener noreferrer" 
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span>Atendimento Rápido</span>
              </a>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] sm:text-xs text-slate-500">
              © 2026 Reque Medicina e Segurança do Trabalho. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-[11px] sm:text-xs text-slate-500">
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Termos de Uso</span>
              <span className="hover:text-slate-800 cursor-pointer transition-colors">Privacidade &amp; LGPD</span>
              <span className="hover:text-slate-800 cursor-pointer transition-colors">SLA de Atendimento</span>
            </div>
          </div>

        </div>
      </footer>

      {/* STEP 2 MODAL: CADASTRO DIGITAL DE COLABORADORES */}
      {isCollaboratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A2D69] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">group_add</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Cadastro Digital de Colaboradores
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preencha os dados regulamentares exigidos pelo eSocial e sistema SOC para a empresa {companyName}
                  </p>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => setIsCollaboratorModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body Scroll Container */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="bg-[#f0f4fd] p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1A2D69] text-[20px]">badge</span>
                  <span className="text-xs font-bold text-[#1A2D69] uppercase tracking-wider">
                    Novo Registro de Colaborador
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  * Todos os campos são obrigatórios para validação legal eSocial
                </span>
              </div>

              {/* Functional React Form */}
              <form onSubmit={handleAddCollaborator} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Nome Funcionário *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João da Silva" 
                    required
                    value={newCollab.name}
                    onChange={(e) => setNewCollab({ ...newCollab, name: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">CPF *</label>
                  <input 
                    type="text" 
                    placeholder="000.000.000-00" 
                    required
                    value={newCollab.cpf}
                    onChange={(e) => setNewCollab({ ...newCollab, cpf: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Matrícula *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 10452" 
                    required
                    value={newCollab.matricula}
                    onChange={(e) => setNewCollab({ ...newCollab, matricula: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Dt. Nascimento *</label>
                  <input 
                    type="date" 
                    required
                    value={newCollab.birthDate}
                    onChange={(e) => setNewCollab({ ...newCollab, birthDate: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Sexo *</label>
                  <select 
                    required
                    value={newCollab.gender}
                    onChange={(e) => setNewCollab({ ...newCollab, gender: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  >
                    <option value="">Selecione...</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Dt. Admissão *</label>
                  <input 
                    type="date" 
                    required
                    value={newCollab.admissionDate}
                    onChange={(e) => setNewCollab({ ...newCollab, admissionDate: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Situação *</label>
                  <select 
                    required
                    value={newCollab.status}
                    onChange={(e) => setNewCollab({ ...newCollab, status: e.target.value as any })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Afastado">Afastado</option>
                    <option value="Férias">Férias</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Nome Cargo *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Costureiro Industrial" 
                    required
                    value={newCollab.cargo}
                    onChange={(e) => setNewCollab({ ...newCollab, cargo: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">CBO *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 7632-10" 
                    required
                    value={newCollab.cbo}
                    onChange={(e) => setNewCollab({ ...newCollab, cbo: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Nome Setor *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Produção e Acabamento" 
                    required
                    value={newCollab.setor}
                    onChange={(e) => setNewCollab({ ...newCollab, setor: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">Nome Unidade *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Matriz Ponta Grossa" 
                    required
                    value={newCollab.unidade}
                    onChange={(e) => setNewCollab({ ...newCollab, unidade: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-slate-700">CNPJ Unidade *</label>
                  <input 
                    type="text" 
                    placeholder="15.464.747/0001-78" 
                    required
                    value={newCollab.cnpjUnidade}
                    onChange={(e) => setNewCollab({ ...newCollab, cnpjUnidade: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                  />
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2 md:col-span-3">
                  <label className="font-semibold text-slate-700">Código Categoria (eSocial) *</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ex: 101 - Empregado Geral" 
                      required
                      value={newCollab.categoriaEsocial}
                      onChange={(e) => setNewCollab({ ...newCollab, categoriaEsocial: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2D69]"
                    />
                    <button 
                      type="submit" 
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>

              </form>

              {/* Table List of Registered Collaborators */}
              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Colaboradores Adicionados ({collaborators.length} cadastrados)
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>{collaborators.length} prontos para envio</span>
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[800px]">
                      <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="p-3 font-bold">Funcionário / CPF</th>
                          <th className="p-3 font-bold">Cargo / CBO</th>
                          <th className="p-3 font-bold">Unidade / Setor</th>
                          <th className="p-3 font-bold">Matrícula</th>
                          <th className="p-3 font-bold">Situação</th>
                          <th className="p-3 font-bold text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {collaborators.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400">
                              Nenhum colaborador na lista. Cadastre usando o formulário acima ou importe uma planilha.
                            </td>
                          </tr>
                        ) : (
                          collaborators.map((collab) => (
                            <tr key={collab.id} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <div className="font-semibold text-slate-900">{collab.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{collab.cpf}</div>
                              </td>
                              <td className="p-3">
                                <div>{collab.cargo}</div>
                                <div className="text-[10px] text-slate-500">CBO {collab.cbo}</div>
                              </td>
                              <td className="p-3">
                                <div>{collab.unidade}</div>
                                <div className="text-[10px] text-slate-500">{collab.setor}</div>
                              </td>
                              <td className="p-3 font-mono text-slate-600">
                                {collab.matricula}
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  collab.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' :
                                  collab.status === 'Férias' ? 'bg-blue-100 text-blue-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {collab.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteCollaborator(collab.id, collab.name)}
                                  className="text-slate-400 hover:text-red-600 transition-colors focus:outline-none"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Os dados digitados serão previamente validados pelo suporte técnico antes do envio oficial ao SOC.
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsCollaboratorModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
                >
                  Fechar
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveAndConfirmCollaborators}
                  className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Salvar e Confirmar Cadastros</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE VALIDAÇÃO DA IMPORTAÇÃO DE PLANILHA (Modelo 1) */}
      {isImportValidationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Validação da Planilha Importada (Modelo 1)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Confira a relação de colaboradores extraída do arquivo para a empresa {companyName}
                  </p>
                </div>
              </div>
              
              <button 
                type="button" 
                onClick={() => setIsImportValidationModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors focus:outline-none"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Guidance Alert Box requested in screenshot_2 */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-600 text-[22px] mt-0.5 shrink-0">info</span>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Orientação Importante sobre a Importação
                  </span>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Caso as informações abaixo não estejam corretas ou completas, você pode fechar esta janela e realizar a importação de um novo arquivo corrigido a qualquer momento.
                  </p>
                </div>
              </div>

              {/* Table of Imported Collaborators */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-bold">Funcionário / CPF</th>
                        <th className="p-3 font-bold">Cargo / CBO</th>
                        <th className="p-3 font-bold">Unidade / Setor</th>
                        <th className="p-3 font-bold">Matrícula</th>
                        <th className="p-3 font-bold">Situação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {collaborators.map((collab) => (
                        <tr key={collab.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <div className="font-semibold text-slate-900">{collab.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{collab.cpf}</div>
                          </td>
                          <td className="p-3">
                            <div>{collab.cargo}</div>
                            <div className="text-[10px] text-slate-500">CBO {collab.cbo}</div>
                          </td>
                          <td className="p-3">
                            <div>{collab.unidade}</div>
                            <div className="text-[10px] text-slate-500">{collab.setor}</div>
                          </td>
                          <td className="p-3 font-mono text-slate-600">
                            {collab.matricula}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {collab.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button 
                type="button" 
                onClick={() => {
                  setIsImportValidationModalOpen(false);
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>Importar Novamente</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsImportValidationModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Cancelar / Fechar
                </button>
                <button 
                  type="button" 
                  onClick={handleValidateImportedData}
                  className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Validar Informações</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
