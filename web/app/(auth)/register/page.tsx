import Link from "next/link";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">ES</span>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Comece sua jornada
          </h2>
          <p className="text-lg text-gray-600">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
