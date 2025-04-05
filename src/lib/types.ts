import data from "@/assets/data/data.json"
import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"

export type Data = typeof data
export type DataKeys = keyof Data[0]

export type Papers = typeof papers
export type PapersKeys = keyof Papers[0]

export type Studies = typeof studies
export type StudiesKeys = keyof Studies[0]

export type Locks = {
    paper: boolean,
    study: boolean,
    intervention: boolean,
    outcome: boolean,
    effect: boolean
}