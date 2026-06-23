import { PageHeader } from "../components/page-header";
import { InviteEmployeeForm } from "./components/invite-employee-form";

export default function InvitacionesPage() {
  return (
    <>
      <PageHeader
        title="Invitaciones"
        description="Invitá empleados a la plataforma. Se les enviará un enlace por email para completar su registro."
      />
      <div className="flex flex-col gap-4 p-6">
        <InviteEmployeeForm />
      </div>
    </>
  );
}
