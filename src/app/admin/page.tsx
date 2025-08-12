"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Tipos auxiliares
interface Produto {
  idproduto: number;
  nomeproduto: string;
  descricao: string;
  unidade: string;
  idcategoria: number;
}

interface Categoria {
  idcategoria: number;
  desccategoria: string;
}

interface Feira {
  idfeira: number;
  nomeedicao: string;
  local: string;
  datafeira: string;
  statusfeira: string;
}

interface Usuario {
  idusuario: number;
  nomeusuario: string;
  perfil: string;
  cnpj_cpf?: string;
}

interface Oferta {
  idoferta?: number;
  nomeproduto: string;
  unidade?: string;
  nomeprodutor?: string;
  local?: string;
  datafeira?: string;
  precoestimado?: string;
  fotourl?: string;
}


// Modal de cadastro de produtor com layout igual ao /cadastro
function CadastroProdutorModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  // Máscara visual para telefone
  function maskTelefone(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
      return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      return value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      return value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      return value;
    }
  }
  // Máscara visual para CPF/CNPJ
  function maskCpfCnpj(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.slice(0, 11);
      if (value.length > 9) {
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else if (value.length > 6) {
        return value.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
      } else if (value.length > 3) {
        return value.replace(/(\d{3})(\d{0,3})/, "$1.$2");
      } else {
        return value;
      }
    } else {
      value = value.slice(0, 14);
      if (value.length > 12) {
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      } else if (value.length > 8) {
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
      } else if (value.length > 5) {
        return value.replace(/(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
      } else {
        return value;
      }
    }
  }
  // Estado do formulário
  const [formData, setFormData] = useState({
    nomeUsuario: '',
    email: '',
    senha: '',
    telefone: '',
    cnpj_cpf: '',
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  // Atualiza o estado com máscara visual, mas salva limpo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "telefone") maskedValue = maskTelefone(value);
    if (name === "cnpj_cpf") maskedValue = maskCpfCnpj(value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: maskedValue,
    }));
  };
  // Envia dados limpos para o backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');
    setLoading(true);
    const cleanTelefone = formData.telefone.replace(/\D/g, "");
    const cleanCpfCnpj = formData.cnpj_cpf.replace(/\D/g, "");
    const payload = {
      ...formData,
      telefone: cleanTelefone,
      cnpj_cpf: cleanCpfCnpj,
    };
    try {
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao cadastrar produtor.');
      setMensagem(data.message || 'Produtor cadastrado com sucesso!');
      setFormData({ nomeUsuario: '', email: '', senha: '', telefone: '', cnpj_cpf: '' });
      onSuccess();
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Estilos iguais ao cadastro
  const inputClass = "w-full rounded-md border-gray-600 bg-gray-800 p-3 text-white shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 mb-4";
  const labelClass = "block text-sm font-medium text-gray-200 mb-1";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.0)' }}>
      <img src="/feirahome.svg" alt="Fundo com itens da feira" className="absolute inset-0 w-full h-full object-cover -z-10" />
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="w-full max-w-md rounded-xl bg-gray-900/70 p-8 shadow-xl backdrop-blur-sm relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl" onClick={onClose}>×</button>
        <h1 className="text-center text-3xl font-bold text-white">Cadastro de Produtor</h1>
        <p className="text-center text-gray-300 mt-2">Preencha os dados para criar o produtor.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="nomeUsuario" className={labelClass}>Nome Completo</label>
            <input id="nomeUsuario" name="nomeUsuario" type="text" value={formData.nomeUsuario} onChange={handleChange} required className={inputClass} placeholder="Seu nome completo" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="seuemail@exemplo.com" />
          </div>
          <div>
            <label htmlFor="senha" className={labelClass}>Senha</label>
            <input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} required className={inputClass} placeholder="********" />
          </div>
          <div>
            <label htmlFor="telefone" className={labelClass}>Telefone</label>
            <input id="telefone" name="telefone" type="text" value={formData.telefone} onChange={handleChange} required className={inputClass} placeholder="(99) 99999-9999" />
          </div>
          <div>
            <label htmlFor="cnpj_cpf" className={labelClass}>CNPJ/CPF</label>
            <input id="cnpj_cpf" name="cnpj_cpf" type="text" value={formData.cnpj_cpf} onChange={handleChange} required className={inputClass} placeholder="Digite o CPF ou CNPJ" />
          </div>
          <button type="submit" className="w-full rounded-full bg-orange-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-orange-700 mt-2" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
        </form>
        {mensagem && <p className="text-center text-green-400 text-sm mt-4 font-bold">{mensagem}</p>}
        {erro && <p className="text-center text-red-400 text-sm mt-4 font-bold">{erro}</p>}
      </div>
    </div>
  );
}

// Modal para cadastro/edição de feira
function FeiraModal({
  onClose,
  onSuccess,
  feira,
}: {
  onClose: () => void;
  onSuccess: () => void;
  feira?: Feira | null;
}) {
  const [form, setForm] = useState<{
    nomeedicao: string;
    local: string;
    datafeira: string;
    statusfeira: string;
  }>({
    nomeedicao: feira?.nomeedicao || "",
    local: feira?.local || "",
    datafeira: feira?.datafeira
      ? feira.datafeira.slice(0, 10)
      : "",
    statusfeira: feira?.statusfeira || "Planejada",
  });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const method = feira ? "PUT" : "POST";
      const url = feira ? `/api/feiras/${feira.idfeira}` : "/api/feiras";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao salvar feira.");
      onSuccess();
      onClose();
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl" onClick={onClose}>×</button>
        <h2 className="text-2xl font-bold mb-4">{feira ? "Editar Feira" : "Cadastrar Feira"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Edição</label>
            <input name="nomeedicao" type="text" value={form.nomeedicao} onChange={handleChange} required className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Local</label>
            <input name="local" type="text" value={form.local} onChange={handleChange} required className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input name="datafeira" type="date" value={form.datafeira} onChange={handleChange} required className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select name="statusfeira" value={form.statusfeira} onChange={handleChange} required className="w-full rounded border p-2">
              <option value="Planejada">Planejada</option>
              <option value="Ativa">Ativa</option>
              <option value="Concluida">Concluída</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <button type="submit" className="w-full rounded bg-orange-600 px-4 py-2 text-white font-semibold hover:bg-orange-700" disabled={loading}>
            {loading ? "Salvando..." : feira ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </form>
        {erro && <p className="text-center text-red-500 mt-4">{erro}</p>}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState<boolean>(false);
  // Estados
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [feiras, setFeiras] = useState<Feira[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<string>("produtores");

  // CRUD modals
  const [modal, setModal] = useState<{ tipo: string; aberto: boolean; item: any }>({ tipo: "", aberto: false, item: null });
  const [modalFeira, setModalFeira] = useState<{ aberto: boolean; feira: Feira | null }>({ aberto: false, feira: null });

  // Verifica autenticação admin
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("/api/usuarios/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) {
          router.replace("/login");
          return;
        }
        const user = await res.json();
        if (user.perfil !== "Administrador") {
          router.replace("/login");
          return;
        }
        setAutenticado(true);
        // Carrega dados do sistema
        Promise.all([
          fetch("/api/usuarios?perfil=Produtor").then(async res => {
            const text = await res.text();
            try {
              return JSON.parse(text);
            } catch {
              throw new Error('Resposta inválida da API de usuários: ' + text.slice(0, 100));
            }
          }),
          fetch("/api/produtos").then(res => res.json()),
          fetch("/api/categorias").then(res => res.json()),
          fetch("/api/feiras").then(res => res.json()),
          fetch("/api/ofertas?all=true").then(res => res.json()),
        ]).then(([users, prod, cat, fei, ofe]) => {
          setUsuarios(users);
          setProdutos(prod);
          setCategorias(cat);
          setFeiras(fei);
          setOfertas(ofe);
        }).catch((err) => setErro("Erro ao carregar dados: " + err.message));
      });
  }, [router]);

  // Função para deletar feira
  async function handleDeleteFeira(idfeira: number) {
    if (!window.confirm("Deseja realmente excluir esta feira?")) return;
    try {
      const res = await fetch(`/api/feiras/${idfeira}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir feira.");
      setFeiras(f => f.filter(fei => fei.idfeira !== idfeira));
    } catch (err: any) {
      setErro("Erro ao excluir feira: " + err.message);
    }
  }

  // Renderização principal
  if (!autenticado) {
    return <div className="flex justify-center items-center h-screen text-xl">Verificando permissão...</div>;
  }
  return (
    <div>
      <section className="relative flex h-[320px] items-center justify-center text-center text-white">
        <Image src="/feirahome.svg" alt="Painel Admin" fill className="object-cover -z-10" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center p-4">
          <h1 className="text-4xl font-bold tracking-tight">Painel do Administrador</h1>
          <p className="mt-2 max-w-2xl text-lg">Gerencie todas as entidades do sistema de forma centralizada.</p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto py-8">
        <nav className="flex gap-4 mb-8 justify-center">
          <button className={`px-4 py-2 rounded-lg font-semibold shadow ${aba === "produtores" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setAba("produtores")}>Produtores</button>
          {/* Opção Produtos removida conforme solicitado */}
          <button className={`px-4 py-2 rounded-lg font-semibold shadow ${aba === "categorias" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setAba("categorias")}>Categorias</button>
          <button className={`px-4 py-2 rounded-lg font-semibold shadow ${aba === "feiras" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setAba("feiras")}>Feiras</button>
          <button className={`px-4 py-2 rounded-lg font-semibold shadow ${aba === "ofertas" ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setAba("ofertas")}>Ofertas</button>
        </nav>
        {erro && <p className="text-red-600 text-center mb-4">{erro}</p>}
        {/* Produtores */}
        {aba === "produtores" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Produtores</h2>
            <table className="w-full text-left mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Nome</th>
                  <th className="p-2">CPF/CNPJ</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(usuarios) && usuarios.length > 0 ? (
                  usuarios.filter(u => u.perfil === "Produtor").map(produtor => (
                    <tr key={produtor.idusuario} className="border-b">
                      <td className="p-2 font-semibold">{produtor.nomeusuario}</td>
                      <td className="p-2">{produtor.cnpj_cpf || '-'}</td>
                      <td className="p-2 flex gap-2">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs" onClick={() => alert('Editar produtor ' + produtor.nomeusuario)}>Editar</button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs" onClick={() => alert('Deletar produtor ' + produtor.nomeusuario)}>Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="text-center text-gray-500">Nenhum produtor cadastrado.</td></tr>
                )}
              </tbody>
            </table>
            <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700" onClick={() => setModal({ tipo: "cadastroProdutor", aberto: true, item: null })}>Adicionar Produtor</button>
            {/* Modal de cadastro de produtor */}
            {modal.aberto && modal.tipo === "cadastroProdutor" && (
              <CadastroProdutorModal onClose={() => setModal({ tipo: "", aberto: false, item: null })} onSuccess={() => setModal({ tipo: "", aberto: false, item: null })} />
            )}
          </div>

        )}
        {aba === "produtos" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Produtos</h2>
            <table className="w-full text-left mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Nome</th>
                  <th className="p-2">Descrição</th>
                  <th className="p-2">Unidade</th>
                  <th className="p-2">Categoria</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(produtos) ? (
                  produtos.map(prod => (
                    <tr key={prod.idproduto} className="border-b">
                      <td className="p-2 font-semibold">{prod.nomeproduto}</td>
                      <td className="p-2 text-sm text-gray-600">{prod.descricao}</td>
                      <td className="p-2">{prod.unidade}</td>
                      <td className="p-2">{categorias.find(c => c.idcategoria === prod.idcategoria)?.desccategoria || "-"}</td>
                      <td className="p-2 flex gap-2">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">Editar</button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs">Excluir</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="text-center text-red-500">Nenhum produto encontrado ou erro ao carregar.</td></tr>
                )}
              </tbody>
            </table>
              {/* Botão de cadastro de produto removido conforme solicitado */}
          </div>
        )}
        {/* Categorias */}
        {aba === "categorias" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Categorias</h2>
            <table className="w-full text-left mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Descrição</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(cat => (
                  <tr key={cat.idcategoria} className="border-b">
                    <td className="p-2 font-semibold">{cat.desccategoria}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">Editar</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700">Adicionar Categoria</button>
          </div>
        )}
        {/* Feiras */}
        {aba === "feiras" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Feiras</h2>
            <table className="w-full text-left mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Nome</th>
                  <th className="p-2">Local</th>
                  <th className="p-2">Data</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {feiras.map(feira => (
                  <tr key={feira.idfeira} className="border-b">
                    <td className="p-2 font-semibold">{feira.nomeedicao}</td>
                    <td className="p-2">{feira.local}</td>
                    <td className="p-2">{new Date(feira.datafeira).toLocaleDateString()}</td>
                    <td className="p-2">{feira.statusfeira}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                        onClick={() => setModalFeira({ aberto: true, feira })}>Editar</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                        onClick={() => handleDeleteFeira(feira.idfeira)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700"
              onClick={() => setModalFeira({ aberto: true, feira: null })}>Adicionar Feira</button>
            {modalFeira.aberto && (
              <FeiraModal
                feira={modalFeira.feira}
                onClose={() => setModalFeira({ aberto: false, feira: null })}
                onSuccess={async () => {
                  // Recarrega feiras após cadastro/edição
                  const res = await fetch("/api/feiras");
                  const novasFeiras = await res.json();
                  setFeiras(novasFeiras);
                }}
              />
            )}
          </div>
        )}
        {/* Ofertas */}
        {aba === "ofertas" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Ofertas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ofertas.map((oferta, idx) => (
                <div
                  key={oferta.idoferta || idx}
                  className="bg-gray-50 rounded-xl shadow p-6 flex flex-col items-center text-center min-h-[320px] w-[280px] justify-center transition-transform hover:scale-105"
                >
                  <img
                    src={oferta.fotourl ? (oferta.fotourl.startsWith("/") ? oferta.fotourl : `/${oferta.fotourl}`) : "/imagens/placeholder.svg"}
                    alt={oferta.nomeproduto}
                    className="w-32 h-32 object-contain rounded border border-gray-300 bg-gray-50 mb-2"
                    style={{ maxWidth: "120px", maxHeight: "120px" }}
                    onError={e => { e.currentTarget.src = "/imagens/placeholder.svg"; }}
                  />
                  <h3 className="mb-1 text-lg font-bold text-[#4B3A1B]">{oferta.nomeproduto}</h3>
                  <p className="mb-1 font-semibold text-[#8B6B3B]">{oferta.unidade}</p>
                  {oferta.nomeprodutor && (
                    <p className="mb-1"><strong>Produtor:</strong> {oferta.nomeprodutor}</p>
                  )}
                  {oferta.local && oferta.datafeira && (
                    <p className="mb-1">
                      <strong>Feira:</strong> {oferta.local} - {new Date(oferta.datafeira).toLocaleDateString()}
                    </p>
                  )}
                  {oferta.precoestimado && (
                    <p className="mb-1 font-semibold text-green-700">Preço: R$ {parseFloat(oferta.precoestimado).toFixed(2).replace(".", ",")}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs">Editar</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-green-700 mt-6">Adicionar Oferta</button>
          </div>
        )}
      </div>
    </div>
  );
}

