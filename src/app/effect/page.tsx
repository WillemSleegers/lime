type searchParamsProps = {
  effect: string
}

type Props = {
  params: {}
  searchParams: searchParamsProps
}

export default function Effect(props: Props) {
  const searchParams = props.searchParams

  return (
    <main className="p-3">
      <h1 className="text-2xl">Effect</h1>
      <p>{searchParams.effect}</p>
    </main>
  )
}
