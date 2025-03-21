'use client'

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Vérifiez votre email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nous vous avons envoyé un email de confirmation.
          Veuillez cliquer sur le lien dans l'email pour activer votre compte.
        </p>
      </div>
    </div>
  )
}
