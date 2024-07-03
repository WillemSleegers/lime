import { columns } from "@/components/tables/data-columns"
import { DataTable } from "@/components/tables/data-table"

import effects from "../../assets/data/prepared-effects.json"

export default async function DemoPage() {
  const data = effects.map((e) => {
    return {
      effect: e.effect_label,
      title: e.paper_title,
      year: e.paper_year,
      effect_size: e.effect_size_value,
      intervention_aspect: e.intervention_aspect,
    }
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-center text-4xl font-bold tracking-tight">Data</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
