"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Plus } from "lucide-react";
import { getUsuarios } from "@/lib/api";
import type { Usuario } from "@/lib/types";
import PageHeader from "@/components/common/PageHeader";
import InfoBanner from "@/components/common/InfoBanner";
import { Loading, ErrorMsg } from "@/components/common/DataState";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import UsuariosTable from "@/components/usuarios/UsuariosTable";
import PermissoesMatrix from "@/components/usuarios/PermissoesMatrix";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsuarios()
      .then(setUsuarios)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <ErrorMsg message={error} />;
  if (!usuarios) return <Loading />;

  return (
    <div>
      <PageHeader
        icon={ShieldCheck}
        title="Usuários e Permissões"
        subtitle="Quem acessa o sistema e o que cada perfil pode fazer."
        actions={<Button icon={<Plus size={15} />}>Novo Usuário</Button>}
      />

      <InfoBanner>
        As contas vêm do diretório corporativo (Microsoft Entra ID). Aqui
        você define apenas o perfil de acesso. Usuários com histórico de
        ações são inativados, nunca excluídos.
      </InfoBanner>

      <Card padded={false} className="mb-6">
        <UsuariosTable itens={usuarios} />
      </Card>

      <PermissoesMatrix />
    </div>
  );
}
