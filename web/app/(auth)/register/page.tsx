import Link from "next/link";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Criar conta
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Faça login
            </Link>
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
