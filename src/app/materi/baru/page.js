// File: src/app/materi/baru/page.js
import CreateMaterialForm from "@/components/CreateMaterialForm";

export default function CreateMaterialPage() {
  return (
    <main className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Buat Materi Baru</h1>
      <CreateMaterialForm />
    </main>
  );
}