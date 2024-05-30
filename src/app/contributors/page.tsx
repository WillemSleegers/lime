const Contributors = () => {
  return (
    <main className="m-auto max-w-3xl px-3 py-9">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Contributors
      </h1>
      <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground ">
          dr. Willem Sleegers
        </div>

        <div className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground ">
          dr. Bastian Jaeger
        </div>
      </div>
    </main>
  )
}

export default Contributors
